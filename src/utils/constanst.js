import jwt from "jwt-simple"
import Axios from "axios"
import { Dispatch } from "redux"

// Constanst
const keySecret = "testDevelop"
const keyStorage = "@storage"

export const urlServer = "http://localhost:8080"

/**
 * Format number with decimal miles separator
 * example: 
 *  * 10000 *(INPUT)*
 *  * 10,000 *(OUTPUT)* 
 * 
 * `return string` */
export const WithDecimals = (number = 0) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export const Round = (number = 0) => Math.round(number * 100) / 100

export const Petition = Axios.create({
    baseURL: urlServer,
    // headers: {
    //     "content-type": "application/x-www-form-urlencoded"
    // },
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