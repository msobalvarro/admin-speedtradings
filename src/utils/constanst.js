import jwt from "jwt-simple"
import Axios from "axios"
import Swal from "sweetalert2"

// Constanst
const keyStorage = "@storage"

/**Indica en que puerto correra el socket en backend */
// const portSocket = ":2000"

export const keySecret = "testDevelop"

export const emailImageToken = "jRVFgyxiXKHxAWQL47jVzoMwj2m9DfG6-fLv8j9zBtLDMjpBd4QeLpXdTHM2Mnlyg-zZEfQrPoCn9yPUVaUQEvTl3B904h3xcY"

//export const urlServer = "https://ardent-medley-272823.appspot.com"
export const urlServer = "http://192.168.11.238:9000"
//export const urlServer = "http://192.168.11.224:8084"

export const urlServerSocket = urlServer.replace("https", "wss").replace("http", "ws")
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
    let input = document.createElement('input');

    input.setAttribute('value', str);
    document.body.appendChild(input);
    input.select();

    let result = document.execCommand('copy');
    document.body.removeChild(input);

    if(result) {
        Swal.fire("¡Listo!", "Copiado a portapapeles", "success")
    } else {
        Swal("¡Opps!", "Error al copiar al portapapeles", "error")
    }
}

/**
 * Función para leer un archivo y retornarlo en base64
 * @param {File} file - Archivo a leer y retornar en base64 
 */
export const readFile = (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
  
        reader.onload = () => {
            resolve(reader.result)
        };
  
        reader.onerror = reject
  
        reader.readAsDataURL(file)
    })
}

/**
 * Metodo para cambiar el nombre de la pagina
 * 
 * @param {String} title 
 */
export const setTittleDOM = (title = "Back Office") => {
    document.title = title
}

/**
 * Return a unique string to use how component key into react
 * */
export const randomKey = _ => ('_' + Math.random().toString(36).substr(2, 9))

/**Config Axios for petition automatic */
export const Petition = Axios.create({
    baseURL: urlServer,
    headers: {
        "Content-Type": "application/json"
    },
    validateStatus: (status) => {
        if (status === 401) {
            // LogOut()
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


/**
 * Reducer para estados generales
 */
export const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}