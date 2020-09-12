import React, { useState, useEffect, useRef, useReducer } from "react"

// Constant and redux store
import { useSelector } from "react-redux"
import { Petition } from "../../utils/constanst"

// Import assets
import "./Mail.scss"
import "froala-editor/css/froala_style.min.css"
import "froala-editor/css/froala_editor.pkgd.min.css"
import allEmailImage from "../../static/images/email.png"

// Import other for editor
// import 'froala-editor/js/third_party/image_tui.min.js'
import 'froala-editor/js/third_party/embedly.min.js'

// Import components
// import FroalaEditorComponent from "react-froala-wysiwyg"
import { Editor as EditorComponent, EditorState } from "draft-js"
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Swal from "sweetalert2"
import Modal from "../../components/Modal/Modal"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"

const Editor = ({ onChange = () => { } }) => {
    // Estado que almacena el cuerpo del correo
    const [html, setHTML] = useState(EditorState.createEmpty())

    useEffect(() => console.log(html), [html])

    return (
        <div className="content">
            <div className="editor-container">
                <EditorComponent editorState={html} onChange={setHTML}/>
            </div>

            <div className="preview">
                <div className="results" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
    )
}

const initialState = {
    // Estado que alamcena el subject del correo
    subject: "",

    // Estado que almacena el texto de busqueda a un usuario
    searchUser: "",

    // Estado que define si se muestra los resultados de busqueda
    showList: false,

    // Contiene el contenido del correo
    emailContent: "",
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}

const Mailing = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // get token auth from redux
    const { token } = useSelector(x => x.globalStorage)

    const inputSearchUser = useRef(null)

    // Estado que almacena todos los correos
    const [allEmails, setEmails] = useState([])

    // Estado que alamcena todos los correos seleccionados por el usuario
    const [emailSelected, setSelect] = useState([])

    // Estado que alamacena un proceso
    const [loader, setLoader] = useState(false)


    /**Metodo que obtiene todos los datos del servidor (emails) */
    const getData = () => {
        try {
            Petition.get("/admin/email/all", { headers: { "x-auth-token": token } })
                .then(({ data }) => {
                    if (data.error) {
                        throw data.message
                    }

                    setEmails(data)
                })
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString())
        }
    }

    /**Metodo que se ejecuta para buscar un usuario por correo o email */
    const onHandledChangeSearch = ({ target }) => {
        const { value: payload } = target

        dispatch({ type: "searchUser", payload })

        if (payload.length > 3) {
            dispatch({ type: "showList", payload: true })
        }
    }

    /**Metodo que se ejecuta cuando selecciona el usuario */
    const selectUser = (index = 0) => {
        const copyArray = emailSelected

        copyArray.push(index)

        setSelect(copyArray)

        dispatch({ type: "searchUser", payload: "" })
    }

    /**Metodo que se ejecuta cuando el usuario se desenfoca en el input search by user or email */
    const blurSearch = () => {
        setTimeout(() => dispatch({ type: "showList", payload: false }), 100)
    }

    /**Metodo que elimina elemento especifico de la lista a enviar */
    const deleteItem = (index = 0) => {
        const copyArray = emailSelected

        copyArray.splice(index, 1)

        setSelect([...copyArray])
    }

    /**Metodo que agrega todos los correos a la lista */
    const addAllEmails = async () => {
        // emailSelected
        const copyArr = emailSelected

        allEmails.map((_, index) => {
            if (!emailSelected.includes(index)) {
                copyArr.push(index)
            }
        })

        setSelect(copyArr)
    }

    /**
     * ### Metodo que retorna **boolean** para validar datos de renderizacion en la lista de correos disponibles
     * -- --
     * @param {*} item 
     * @param {Number} key      
     */
    const conditionalRenderAllEmailsAvaible = (item = {}, key = 0) => {
        try {
            const fullnameSearch = item.fullname.length > 0 && item.fullname.toLowerCase().search(state.searchUser.toLocaleLowerCase()) > -1
            const emailSearch = item.email.length > 0 && item.email.toLowerCase().search(state.searchUser.toLocaleLowerCase()) > -1

            const avaibleInList = !emailSelected.includes(key)

            return (fullnameSearch || emailSearch) && avaibleInList
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Metodo que envia los datos del 
     */
    const onSend = async () => {
        try {
            // Activamos el loader
            setLoader(true)

            // Vaidamos si hay correos que enviar
            if (emailSelected.length === 0) {
                throw new Error("Seleccione al menos un correo")
            }

            if (state.subject.trim() === "") {
                throw new Error("Agrege un Subject para continuar")
            }

            if (state.emailContent.trim() === "") {
                throw new Error("Escriba un correo para continuar")
            }


            /**Almacenara todos los correos que enviara */
            const emails = []

            await emailSelected.map(item => {
                // Verificamos si es un indice de la lista dispoible
                if (typeof item === "number") {
                    // Si es de la lista del sistema
                    emails.push(allEmails[item].email)
                } else {
                    // Si es correo desconocido
                    emails.push(item)
                }
            })

            const data = {
                html: state.emailContent,
                subject: state.subject,
                emails
            }

            await Petition.post("/admin/email/send", data, {
                headers: {
                    "x-auth-token": token
                }
            }).then(({ data }) => {
                // Revisamos si hay mensaje de error de parte del server
                if (data.error) {
                    throw new Error(data.message)
                } else if (data.response === "success") {
                    // Se ejecuta cuando los correso se ejecutaron correctamente
                    Swal.fire("Listo", "Tus correos se han enviado", "success")

                    // Limpiamos la lista de los correos selecionados
                    setSelect([])

                    // Limpiamos el `subject`
                    dispatch({ type: "subject", payload: "" })

                } else {
                    // respuesta incorrecta del server
                    console.log(data)
                    Swal.fire("No se han enviado los correos", "Contacte a Samuel Sobalvarro", "warning")
                }
            })
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "error")
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="container-mailing">
            <NavigationBar />

            <div className="header-mail">
                <input type="text" value={state.subject} onChange={e => dispatch({ type: "subject", payload: e.target.value })} className="input-subject" placeholder="Subject" />

                <div className="auto-complete">
                    {
                        emailSelected.map((item, index) => {
                            // Verificamos si el elemento es un indice de la lista de correos dispobles
                            if (typeof item === "number") {

                                // Renderizamos el correo de la lista del sistema
                                return (
                                    <div className="item" key={index} title={allEmails[item].email}>
                                        <span className="name">{allEmails[item].fullname}</span>

                                        <span className="delete" onClick={_ => deleteItem(index)}>
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKklEQVQ4T42TS2sTURTHz7ljJuhmtG5aCIrUuDU6aZo0UkooxXwB97qoghvBRfqgUOimTxBEbQt+Ab9AtVRJH3lAYw1urE2UIIEW+khdqdPJPXJuM0MSo3gXA/ee+//dc/7nDELTWjPNmzrifQCIEeJlDqOUJUB8V7Xt+Wg+n6+XoLPJmeY5G/EpCnGvGVq/JykXv+3tPbpTLv9QcP7UxG9QiFv/EjuxKtFaeXf3NkMUIBsMvnRevjgwAEfJJJBlNbCE1wsXYjE4XFpS5yTlQjiXe4Bcs1fT3vMhizsnJuA4nYZCIuFChK6Df24OjFAIiqOjcLSyoiC2Zd3AbDC4gEIMqnp0Ha5NTYHR0wPf02nYSSRUjf7ZWTC6u6GyugrFkREg21YASfSCAQUU4qqTbwMkkwFABCMchsr6OhSHhlwx368SfcZMV5clED0NreFMpqfBiETU8fHGBhRYfHLS4IsksloCVM0zM+plBUilTgFNxipA1jR3UNP8DlqJazWzkNf5aLQlRBJtswfzKARPHnCrlDgUOq15eFh54J+cbAkhKZ9hKhAInNH1D6qN8Th0jo//4TYb60C+jI3B4fKyyuyXbV93BsltZVt/P1R4kGqtqu9OW1+fK5ZEzyObmw8V4JXPd9bX0fFaQ+z9n1EmKZOfDg7id0uln+7PxJBL7e1PnKH6G4hf3t7ff8xiNXzNF9kT4fEMEkAMAa7U4l+R6K0l5WLv1tbHes1v388CuJ4KyckAAAAASUVORK5CYII=" alt="delete" />
                                        </span>
                                    </div>
                                )
                            } else {

                                // renderizamos el correo ingresado manualmente
                                return (
                                    <div className="item" key={index} title={item}>
                                        <span className="name">{item}</span>

                                        <span className="delete" onClick={_ => deleteItem(index)}>
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKklEQVQ4T42TS2sTURTHz7ljJuhmtG5aCIrUuDU6aZo0UkooxXwB97qoghvBRfqgUOimTxBEbQt+Ab9AtVRJH3lAYw1urE2UIIEW+khdqdPJPXJuM0MSo3gXA/ee+//dc/7nDELTWjPNmzrifQCIEeJlDqOUJUB8V7Xt+Wg+n6+XoLPJmeY5G/EpCnGvGVq/JykXv+3tPbpTLv9QcP7UxG9QiFv/EjuxKtFaeXf3NkMUIBsMvnRevjgwAEfJJJBlNbCE1wsXYjE4XFpS5yTlQjiXe4Bcs1fT3vMhizsnJuA4nYZCIuFChK6Df24OjFAIiqOjcLSyoiC2Zd3AbDC4gEIMqnp0Ha5NTYHR0wPf02nYSSRUjf7ZWTC6u6GyugrFkREg21YASfSCAQUU4qqTbwMkkwFABCMchsr6OhSHhlwx368SfcZMV5clED0NreFMpqfBiETU8fHGBhRYfHLS4IsksloCVM0zM+plBUilTgFNxipA1jR3UNP8DlqJazWzkNf5aLQlRBJtswfzKARPHnCrlDgUOq15eFh54J+cbAkhKZ9hKhAInNH1D6qN8Th0jo//4TYb60C+jI3B4fKyyuyXbV93BsltZVt/P1R4kGqtqu9OW1+fK5ZEzyObmw8V4JXPd9bX0fFaQ+z9n1EmKZOfDg7id0uln+7PxJBL7e1PnKH6G4hf3t7ff8xiNXzNF9kT4fEMEkAMAa7U4l+R6K0l5WLv1tbHes1v388CuJ4KyckAAAAASUVORK5CYII=" alt="delete" />
                                        </span>
                                    </div>
                                )
                            }

                        })
                    }

                    <input
                        ref={inputSearchUser}
                        onChange={onHandledChangeSearch}
                        value={state.searchUser}
                        onBlur={blurSearch}
                        type="text"
                        placeholder="Buscar usuario"
                        className="search-user" />

                    <button disabled={emailSelected.length === allEmails.length} className="select-all" onClick={addAllEmails}>
                        <img src={allEmailImage} alt="allEmailImage" />
                    </button>
                </div>


                {
                    (allEmails.length > 0 && state.showList) &&
                    <div className="list-avaible" style={{ left: `${inputSearchUser.current.offsetLeft}px` }}>
                        {
                            allEmails.map((item, key) => {
                                if (conditionalRenderAllEmailsAvaible(item, key)) {
                                    return (
                                        <div className="mail-item" onClick={_ => selectUser(key)} key={key}>
                                            <span className="name">{item.fullname}</span>
                                            <span className="email">{item.email}</span>
                                        </div>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                }
            </div>

            <Editor onChange={payload => dispatch({ type: "emailContent", payload })} />

            <div className="buttons">
                <button className="button" onClick={onSend}>Enviar</button>
            </div>


            {
                loader &&
                <Modal persist={true} onlyChildren>
                    <ActivityIndicator size={64} />
                </Modal>
            }
        </div>
    )
}

export default Mailing