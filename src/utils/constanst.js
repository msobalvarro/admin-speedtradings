import React from 'react'
import { useLocation } from 'react-router-dom'
import jwt from 'jwt-simple'
import Axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'
import 'moment/locale/es'
import { countries } from './countries.js'

import soundNotification from '../static/sound/notification.mp3'

// Constanst
const keyStorage = '@storage'

/**Indica en que puerto correra el socket en backend */
// const portSocket = ":2000"

export const keySecret = 'testDevelop'

export const emailImageToken =
    'jRVFgyxiXKHxAWQL47jVzoMwj2m9DfG6-fLv8j9zBtLDMjpBd4QeLpXdTHM2Mnlyg-zZEfQrPoCn9yPUVaUQEvTl3B904h3xcY'

export const urlServer = 'https://ardent-medley-272823.appspot.com'
//export const urlServer = "http://192.168.1.238:8084"
//export const urlServer = "http://192.168.11.224:8084"
//export const urlServer = "http://192.168.1.224:8084"
//export const urlServer = 'http://192.168.0.125:8084'
//export const urlServer = "http://192.168.0.119:8084"

export const urlServerSocket = urlServer
    .replace('https', 'wss')
    .replace('http', 'ws')
// export const urlServerSocket = urlServer

/**
 * Format number with decimal miles separator
 * example:
 *  * 10000 *(INPUT)*
 *  * 10,000 *(OUTPUT)*
 *
 * `return string` */
export const WithDecimals = (number = 0) =>
    number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const Round = (number = 0) => Math.round(number * 100) / 100

/**
 * Creates a function like `round`. Extract from lodash library
 *
 * @private
 * @param {string} methodName The name of the `Math` method to use when rounding.
 * @returns {Function} Returns the new round function.
 */
export const floor = (number, precision) => {
    const func = Math.floor

    if (isNaN(number) || number === null) {
        return 0
    }

    precision =
        precision == null
            ? 0
            : precision >= 0
            ? Math.min(precision, 292)
            : Math.max(precision, -292)

    if (precision) {
        // Shift with exponential notation to avoid floating-point issues.
        // See [MDN](https://mdn.io/round#Examples) for more details.
        let pair = `${number}e`.split('e')
        const value = func(`${pair[0]}e${+pair[1] + precision}`)

        pair = `${value}e`.split('e')
        return +`${pair[0]}e${+pair[1] - precision}`
    }

    return func(number)
}

/**Copy string */
export const copyData = (str = '') => {
    let input = document.createElement('input')

    input.setAttribute('value', str)
    document.body.appendChild(input)
    input.select()

    let result = document.execCommand('copy')
    document.body.removeChild(input)

    if (result) {
        Swal.fire('¡Listo!', 'Copiado a portapapeles', 'success')
    } else {
        Swal('¡Opps!', 'Error al copiar al portapapeles', 'error')
    }
}

export const downloadReport = (data, filename) => {
    const blob = new Blob([data], {
        type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    let downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()

    // cleanup
    downloadLink.remove()
    URL.revokeObjectURL(blob)
}

/**
 * Wrapper for MomentJS component with locale preconfigure
 */
export const Moment = ({
    date = new Date(),
    fromNow = false,
    format = 'YYYY-MM-DD HH:mm',
    ...rest
}) => {
    const checkHoursOffset = _ => {
        const NOW = moment(new Date())
        const fromDate = moment(date)

        return moment.duration(NOW.diff(fromDate)).asHours() > 24 && !fromNow
            ? fromDate.format(format)
            : fromDate.fromNow()
    }

    return (
        <time {...rest} locale='es'>
            {checkHoursOffset()}
        </time>
    )
}

/**
 * Retorna un string con los primeros 4 caracteres y los últimos 4 caracteres de una wallet
 * @param {String} _wallet
 */
export const formatWallet = _wallet => {
    if (!_wallet) {
        return ''
    }

    const { length } = _wallet

    return `${_wallet.substr(0, 4)}...${_wallet.substr(length - 4, 4)}`
}

/**
 * Hook para obtener los parámetros de ruta
 */
export const useQueryParams = _ => {
    return new URLSearchParams(useLocation().search)
}

// Reproduce el sonido de notificación
export const dispatchNotification = _ => {
    const audioNotification = new Audio(soundNotification)

    audioNotification.muted = false
    audioNotification.pause()
    audioNotification.play().catch(_ => {})
}

/**
 * Metodo para cambiar el nombre de la pagina
 *
 * @param {String} title
 */
export const setTittleDOM = (title = 'Back Office') => {
    document.title = title
}

/**
 * Return a unique string to use how component key into react
 * */
export const randomKey = _ => '_' + Math.random().toString(36).substr(2, 9)

/**Config Axios for petition automatic */
const Petition = Axios.create({
    baseURL: urlServer,
    headers: {
        'Content-Type': 'application/json',
        'ignore-release-date': true,
    },
    validateStatus: status => {
        if (status === 401) {
            LogOut()
        }

        return status >= 200 && status < 300
    },
    timeout: 0,
})

Petition.interceptors.request.use(config => {
    const whiteListUrl = [
        '/admin/payments/apply',
        '/admin/trading',
        '/admin/reports-users/delivery',
    ]

    if (whiteListUrl.indexOf(config.url)) {
        // Sí se consume el endpoint del trading, se configura el tiempo de espera en 30 min
        config.timeout = 1000 * 60 * 30
    }

    // Se añade el token de acceso antes de cada petición
    config.headers = {
        ...config.headers,
        'x-auth-token': getStorage().token,
    }

    return config
})

export { Petition }

/**Opciones para grafica diaria de dashboard */
export const optionsChartDashboard = {
    low: 0,
    showArea: true,
    scaleMinSpace: 20,
    height: '256px',
}

/**Funcion que ejecuta el LOGOUT de sesion */
export const LogOut = () => {
    deleteStorage()

    window.location.hash = '/'

    window.location.reload()
}

/** Elimina el api storage de localstorage */
export const deleteStorage = () => {
    localStorage.removeItem(keyStorage)
}

/**Setea los datos de api storage modo encriptado */
export const setStorage = (json = {}) => {
    const data = jwt.encode(json, keySecret)

    localStorage.setItem(keyStorage, data)
}

/**Desencripta el api storage del dashboard y lo retorna */
export const getStorage = () => {
    const storage = localStorage.getItem(keyStorage)

    if (storage) {
        return jwt.decode(storage, keySecret)
    } else {
        return {}
    }
}

/**
 * Reducer para estados generales
 */
export const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload,
    }
}

/**
 * Función para leer un archivo y retornarlo en base64
 * @param {File} file - Archivo a leer y retornar en base64
 */
export const readFile = (fileId, credentials) =>
    new Promise(async (resolve, _) => {
        Petition.get(`/file-admin/${fileId}`, {
            responseType: 'arraybuffer',
            ...credentials,
        })
            .then(({ data, headers }) => {
                const blob = new Blob([data], { type: headers['content-type'] })
                resolve(blob)
            })
            .catch(error => resolve({ error: true, message: error }))
    })

/**
 * Función para obtener el nombre de un pais pasandole el phone code
 * @param {Number} code - Codigo telefonico del pais ej. +505
 */
export const getCountry = (code = -1) => {
    if (code === -1) return
    //Obtener nombre de la nacionalidad
    const country = countries.filter(country => country.phoneCode === code)

    return country[0].name
}
