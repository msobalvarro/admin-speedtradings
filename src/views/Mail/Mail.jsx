import React, { useState, useEffect, useRef, useReducer } from "react"
import ReactQuill from "react-quill"
import "../../static/react-quill-snow.css"
import "./Mail.scss"

// Constant and redux store
import { useSelector } from "react-redux"
import {
    Petition,
    randomKey,
    urlServer,
    emailImageToken
} from "../../utils/constanst"

// Import assets
import allSelect from "../../static/images/addAll.svg"

// Import components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Swal from "sweetalert2"
import Modal from "../../components/Modal/Modal"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"


const initialState = {
    // Estado que alamcena el subject del correo
    subject: "",

    // Estado que almacena el texto de busqueda a un usuario
    searchUser: "",

    // Estado que define si se muestra los resultados de busqueda
    showList: false,

    // Contiene el contenido del correo
    emailContent: "",

    // Estado que define si se muestra el desplegabe con la lista de los correos remitentes
    showMailerFromList: false,

    // Correo remitente
    mailerFrom: "",

    // Remitentes de correos
    mailersFromList: {
        DASHBOARD: "dashboard@speedtradings.com",
        EXCHANGE: "alyExchange@speedtradings.com",
        MANAGEMENT: "gerencia@speedtradings.com"
    }
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}

// Lista de los elementos a mostrar en la barra de herramientas del editor
var toolbarContainer = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['link', 'image'],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
]

// Se establecen cuales serán las modificaciones de formato que permitirá el editor
const toolbarFormats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video', 'color', 'direction', 'script', 'background', 'align'
]

/**
 * Capturador para añadir imagenes en el editar de plantillas de correo
 * @param {ReactQuill} editor - instancia del editor 
 * @param {Object} credentials - objeto con las credenciales de acceso al server 
 * @param {Callback} loaderState - callback para modificar el valor del estado de carga
 */
const editorImageHandler = (editor, credentials, loaderState) => {
    const input = document.createElement('input')

    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async function () {
        try {
            loaderState(true)

            const file = input.files[0]
            const datasender = new FormData()

            datasender.append('image', file)

            const { data } = await Petition.post('/admin/file/email', datasender, credentials)
            console.log(data)

            if (data.error) {
                throw String(data.message)
            }

            const range = editor.getEditorSelection(true)
            const link = `${urlServer}/admin/file/email/${data.fileId}?token=${emailImageToken}`

            editor.getEditor().insertEmbed(range.index, 'image', link)
            editor.getEditor().setSelection(range.index + 1)
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "error")
        } finally {
            loaderState(false)
        }
    }
}


const Mail = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // get token auth from redux
    const { token } = useSelector(x => x.globalStorage)
    const header = {
        headers: {
            "x-auth-token": token
        }
    }

    // Estado que almacena todos los correos
    const [allEmails, setEmails] = useState([])

    // Estado que almacena la lista de los correos destinatarios
    const [mailerToList, setMailerToList] = useState([])

    // Estado que alamcena todos los correos seleccionados por el usuario
    const [emailSelected, setEmailSelect] = useState([])

    // Estado que controla el indicador de carga
    const [loader, setLoader] = useState(false)
    const [uploading, setUploading] = useState(false)

    const searchUserRef = useRef(null)
    const inputSearchUserRef = useRef(null)
    const mailerFromRef = useRef(null)
    const editorRef = useRef(null)


    /**Metodo que obtiene todos los datos del servidor (emails) */
    const getData = async () => {
        try {
            const { data } = await Petition.get("/admin/email/all", header)

            if (data.error) {
                throw String(data.message)
            }

            setEmails(data)
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString())
        } finally {
            editorRef.current
                .getEditor()
                .getModule('toolbar')
                .addHandler('image', _ => editorImageHandler(editorRef.current, header, setUploading))
        }
    }

    /**
     * Función que captura el cambio en correo remitente
     * @param {String} payload - valor del correo que será el remitente 
     */
    const onHandledChangeMailerFrom = (payload) => {
        dispatch({ type: "mailerFrom", payload })
        dispatch({ type: "showMailerFromList", payload: false })
    }

    /**
     * Función que captura la entrada en el campo para buscar un destinatario
     * @param {HtmlElement} target 
     */
    const onHandledChangeSearch = ({ target }) => {
        const { value: payload } = target

        if (payload === ',') return

        dispatch({ type: "searchUser", payload })

        if (payload.length > 3) {
            dispatch({ type: "showList", payload: true })
        } else {
            dispatch({ type: "showList", payload: false })
        }
    }

    /**
     * Función que detecta cuando se presiona ',' en el campo del ingreso remitentes.
     * Cuando se detecta el ingreso de la ',', se verifica si hay correos seleccionados 
     * de la lista sugerencia, o el correo ingresado en caso que no haya ningún correo 
     * seleccionado de la lista y lo(s) añade a la lista de destinatarios
     * @param {Event} e 
     */
    const onHandledMailerToListUpdate = (e) => {
        // Verifica si la tecla presionada es una ','
        if (e.which === 44 || e.key === ',') {

            // Se verifican si hay elementos seleccinados de la lista de sugerencias
            if (emailSelected.length > 0) {
                setMailerToList([...mailerToList, ...emailSelected])
                setEmailSelect([])
            } else {
                /**
                 * De no haber elementos seleccionados de la lista, se añade el correo
                 * ingresado manualmente
                 */
                let customEmail = {
                    fullname: state.searchUser,
                    email: state.searchUser
                }

                setMailerToList([...mailerToList, customEmail])
            }

            // Se oculta la lista de sugerencias y se limpia el campo de ingreso de remitente
            dispatch({ type: "showList", payload: false })
            dispatch({ type: "searchUser", payload: '' })
        }
    }

    /**
     * Función que añade/elimina un correo a la lista de destinatarios
     * @param {String} value - Email a agregar/eliminar de la lista de destinatarios 
     */
    const onHandledChangeSelectedMail = (item) => {
        // Si el elemento no está en la lista se seleccionados, se añade a la lista
        if (!emailSelected.map(({ email }) => email).includes(item.email)) {
            setEmailSelect([...emailSelected, item])
        } else {
            // Si el elemento está actualmente añadido a la lista de seleccionados, se remueve
            let indexDelete = emailSelected.map(({ email }) => email).indexOf(item.email)

            emailSelected.splice(indexDelete, 1)
            setEmailSelect([...emailSelected])
        }

        // Se dispara el foco al campo de ingreso de remitentes
        inputSearchUserRef.current.focus()
    }

    /**
     * Función que remueve un elemento dentro de la lista de destinatarios cuando se 
     * presiona la x
     * @param {Object} item - Elemento del tipo de correo 
     */
    const onHandledRemoveSelectedMail = (item) => {
        // Se obtiene la posición del elemento dentro de la lista de destinatarios
        let indexDelete = mailerToList.map(({ email }) => email).indexOf(item.email)

        // Se remueve el elemento y se actualiza la  lista de destinatarios
        mailerToList.splice(indexDelete, 1)
        setMailerToList([...mailerToList])
    }

    /**
     * Función que añade todos los correos dentro del registro a la lista de destinatarios
     */
    const addAllEmails = () => {
        setMailerToList([...allEmails])
    }

    /**
     * Evento para ocultar la lista de sugerencias en el campo de búsqueda de destinatario
     * y el campo de remitente
     * @param {Event} e 
     */
    const handleBlur = (e) => {
        // Ocultar la lista  para la sección de los correos destinatarios
        if (
            !searchUserRef.current.contains(e.target) &&
            !e.target.classList.contains("mailerTo-item")
        ) {
            dispatch({ type: "showList", payload: false })
        }

        // Oculta la lista de los correos remitentes
        if (!mailerFromRef.current.contains(e.target)) {
            dispatch({ type: "showMailerFromList", payload: false })
        }
    }

    // Realiza el filtro de las sugerencias a medida que se va escribiendo en el campo de remitente
    const emailSuggestionFilter = (item => {
        if (state.searchUser.length === 0) return item

        const { email, fullname } = item

        if (
            !mailerToList.map(_item => _item.email).includes(email) &&
            (email.toLowerCase().search(state.searchUser) > -1 ||
                fullname.toLowerCase().search(state.searchUser) > -1)
        ) {
            return item
        }
    })

    /**
     * Función que retorna la lista de correos a renderizar
     * @param {Array} data - lista de todos los correos existentes dentro del registro 
     */
    const mailerToListRender = (data) => {
        /**
         * Si la lista de destinatarios es mayor que la lista de los correos en el
         * registro, se retorna una lista con todos aquellos correos ingresados de manera
         * manual
         */
        if (data.length > allEmails.length) {
            let _data = Array.from(data)
                .splice(allEmails.length, data.length - allEmails.length)

            return _data
        }

        // Retorna la lista de correos destinatarios
        if (mailerToList.length < allEmails.length) {
            return data
        }

        return []
    }

    // Función para reiniciar los campos 
    const resetFields = _ => {
        dispatch({ type: "emailContent", payload: "" })
        dispatch({ type: "subject", payload: "" })
        dispatch({ type: "mailerFrom", payload: "" })

        setMailerToList([])
        setEmailSelect([])
        editorRef.current.getEditor().setContents([])
    }

    // Función para descartar un correo
    const onDiscarted = _ => {
        Swal.fire({
            title: "¿Desea descartar el correo actual?",
            text: "La acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: '#ffcb08',
            confirmButtonColor: ' #C0392B',
            confirmButtonText: 'Sí, descartar',
            cancelButtonText: 'Cancelar',
        }).then(result => {
            if (result.value) {
                resetFields()
            }
        })
    }

    // Función para enviar el correo a los destinatarios
    const onSend = async _ => {
        try {
            // Activamos el loader
            setLoader(true)

            // Vaidamos si hay correos que enviar
            if (mailerToList.length === 0) {
                throw String("Seleccione al menos un correo")
            }

            if (state.subject.trim() === "") {
                throw String("Agrege un Subject para continuar")
            }

            if (editorRef.current.getEditorContents().trim() === "") {
                throw String("Escriba un correo para continuar")
            }


            /**Almacenara todos los correos que enviara */
            const emails = await mailerToList.map(item => item.email)

            const dataSend = {
                html: editorRef.current.getEditorContents(),
                subject: state.subject,
                sender: state.mailerFrom,
                emails
            }

            const header = {
                headers: {
                    "x-auth-token": token
                }
            }

            const { data } = await Petition.post("/admin/email/send", dataSend, header)

            // Revisamos si hay mensaje de error de parte del server
            if (data.error) {
                throw String(data.message)
            } else if (data.response === "success") {
                // Se ejecuta cuando los correso se ejecutaron correctamente
                Swal.fire("Listo", "Tus correos se han enviado", "success")

                // Reiniciamos los campos
                resetFields()
            } else {
                // respuesta incorrecta del server
                console.log(data)
                Swal.fire("No se han enviado los correos", "Contacte a Samuel Sobalvarro", "warning")
            }
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "error")
        } finally {
            setLoader(false)
        }
    }

    useEffect(_ => {
        getData()

        window.addEventListener('click', handleBlur)

        return () => {
            window.removeEventListener('click', handleBlur)
        }
    }, [])

    return (
        <div className="Mail">
            <NavigationBar />

            <div className="Mail-content">
                <h2 className="title">Enviar correo electrónico</h2>

                <div className="mail-item">
                    <span className="label">De</span>
                    <div ref={mailerFromRef} className="value mailerFrom">
                        <div onClick={_ => dispatch({ type: "showMailerFromList", payload: true })}>
                            {
                                state.mailerFrom.length > 0
                                    ? state.mailerFrom
                                    : <p className="placeholder">Selecccionar correo aquí...</p>
                            }
                        </div>

                        <div className={`mailerFromList ${state.showMailerFromList ? 'active' : ''}`}>
                            {
                                Object.entries(state.mailersFromList)
                                    .map(([key, email]) => (
                                        <span
                                            key={randomKey()}
                                            onClick={_ => onHandledChangeMailerFrom(email)}
                                            className="mailerFrom-item">
                                            { key} ({ email})
                                        </span>
                                    ))
                            }
                        </div>
                    </div>
                </div>

                <div className="mail-item">
                    <span className="label">Para</span>
                    <div ref={searchUserRef} className="value mailerTo">

                        {
                            allEmails.length > 0 &&
                            mailerToList.length >= allEmails.length &&
                            <div className="selected-mail mailerTo-item">
                                <span>Se seleccionaron todos los correos registrados</span>
                                <span
                                    onClick={_ => setMailerToList([])}
                                    className="remove">
                                    &#8855;
                                </span>
                            </div>
                        }

                        {

                            mailerToListRender(mailerToList).map(item => (
                                <div
                                    key={randomKey()}
                                    className="selected-mail">
                                    <span>{item.fullname}</span>
                                    <span
                                        onClick={_ => onHandledRemoveSelectedMail(item)}
                                        className="remove">
                                        &#8855;
                                    </span>
                                </div>
                            ))
                        }

                        <input
                            ref={inputSearchUserRef}
                            onChange={onHandledChangeSearch}
                            onKeyPress={onHandledMailerToListUpdate}
                            type="text"
                            value={state.searchUser}
                            placeholder="Ingresar remitente..."
                            className="input-mail searchUserMail" />

                        <button
                            title={"Seleccionar todos los correos"}
                            disabled={mailerToList.length >= allEmails.length}
                            className="select-all"
                            onClick={addAllEmails}>
                            <img src={allSelect} alt="allEmailImage" />
                        </button>

                        <div className={`mailerToList ${state.showList ? 'active' : ''}`}>
                            {
                                allEmails.filter(emailSuggestionFilter).length > 0 &&
                                <span className="indication">
                                    Esrciba una coma (,) luego de seleccionar el remitente
                                </span>
                            }

                            {
                                allEmails
                                    .filter(emailSuggestionFilter)
                                    .map(item => (
                                        <span
                                            key={randomKey()}
                                            onClick={_ => onHandledChangeSelectedMail(item)}
                                            className={`mailerTo-item ${emailSelected.map(({ email }) => email).includes(item.email) ? 'active' : ''}`}>
                                            { item.email}
                                        </span>
                                    ))
                            }
                        </div>
                    </div>
                </div>

                <div className="mail-item">
                    <span className="label">Asunto</span>
                    <input
                        value={state.subject}
                        onChange={e => dispatch({ type: "subject", payload: e.target.value })}
                        type="text"
                        placeholder="Agregar asunto..."
                        className="value input-mail subject" />
                </div>

                <div className="editor">
                    <ReactQuill
                        ref={editorRef}
                        theme={"snow"}
                        modules={{ toolbar: toolbarContainer }}
                        formats={toolbarFormats}
                        onBlur={_ => {
                            // Se carga el contenido del editor al estado
                            dispatch({
                                type: 'emailContent',
                                payload: editorRef.current.getEditorContents()
                            })
                        }}
                    />
                </div>

                <div className="email-buttons">
                    <button onClick={onDiscarted}>Descartar</button>
                    <button onClick={onSend}>Enviar</button>
                </div>
            </div>

            {
                (loader || uploading) &&
                <Modal persist={true} onlyChildren>
                    <ActivityIndicator size={64} />
                </Modal>
            }
        </div>
    )
}

export default Mail