import jwt from "jwt-simple"
import Axios from "axios"
import copy from "copy-to-clipboard"
import Swal from "sweetalert2"

// Constanst
const keyStorage = "@storage"

/**
 * Indica en que puerto donde corre el codigo backend 
 * cuando esta en desarollo
 * */
const devPort = ":8080"

/**Indica en que puerto correra el socket en backend */
const portSocket = ":2000"

export const keySecret = "testDevelop"

export const urlServer = "https://ardent-medley-272823.appspot.com"
// export const urlServer = "http://127.0.0.1" + devPort

export const urlServerSocket = urlServer.replace("https", "ws").replace("http", "ws").replace(devPort, portSocket)
// export const urlServerSocket = urlServer

/**
 * Format number with decimal miles separator
 * example: 
 *  * 10000 *(INPUT)*
 *  * 10,000 *(OUTPUT)* 
 * 
 * `return string` */
export const WithDecimals = (number = 0) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export const Round = (number = 0) => Math.round(number * 100) / 100

/**Copy string */
export const copyData = (str = "") => {
    navigator.clipboard.writeText(str).catch(_ => {
        return false
    })


    copy(str, {
        message: "Dato copiado",
        onCopy: () => Swal.fire("Listo", "Copiado a portapapeles", "success")
    })


    // Swal.fire('Direccion Wallet copiada', '', 'success')
}

/**Config Axios for petition automatic */
export const Petition = Axios.create({
    baseURL: urlServer,
    headers: {
        "Content-Type": "application/json"
    },
    validateStatus: (status) => {
        if (status === 401) {
            LogOut()
        }

        return status >= 200 && status < 300;
    }
})

/**Opciones para grafica diaria de dashboard */
export const optionsChartDashboard = {
    low: 0,
    showArea: true,
    scaleMinSpace: 20,
    height: '256px'
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