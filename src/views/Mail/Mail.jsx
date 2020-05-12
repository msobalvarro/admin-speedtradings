import React, { useState, useEffect, useRef } from "react"

// Constant and redux store
import { useSelector } from "react-redux"
import { Petition, copyData } from "../../utils/constanst"

// Import assets
import "quill/dist/quill.snow.css"
import "./Mail.scss"

// Import components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Quill from "quill"
import Swal from "sweetalert2"

const Mailing = () => {
    // get token auth from redux
    const { token } = useSelector(x => x.globalStorage)

    const inputSearchUser = useRef(null)

    // Estado que almacena el cuerpo del correo
    const [html, setHTML] = useState("")

    // Estado que almacena todos los correos
    const [allEmails, setEmails] = useState([])

    // Estado que alamcena todos los correos seleccionados por el usuario
    const [emailSelected, setSelect] = useState([])

    // Estado que alamcena el subject del correo
    const [subject, setSubject] = useState("")

    // Estado que almacena el texto de busqueda a un usuario
    const [searchUser, setSearch] = useState("")

    // Estado que define si se muestra los resultados de busqueda
    const [showList, setShowList] = useState(false)

    /**Creacion de correo */
    const createEditor = () => {
        const editor = new Quill('#editor', {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['link', 'image']
                ]
            },
            theme: 'snow'
        })

        editor.on('text-change', onHandledChangeText)
    }

    /**Evento que se ejecuta cuando el usuario escribe en el editor */
    const onHandledChangeText = () => {
        const content = document.getElementsByClassName("ql-editor")[0].innerHTML


        setHTML(content)
    }

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
        const { value } = target

        setSearch(value)

        if (value.length > 3) {
            setShowList(true)
        }
    }

    /**Metodo que se ejecuta cuando selecciona el usuario */
    const selectUser = (index = 0) => {
        const dataSelect = allEmails[index]

        const copyArray = emailSelected

        copyArray.push(dataSelect)

        setSelect(copyArray)
        setSearch("")
    }

    /**Metodo que se ejecuta cuando el usuario se desenfoca en el input search by user or email */
    const blurSearch = () => {
        setTimeout(() => setShowList(false), 100)
    }

    /**Metodo que elimina elemento especifico de la lista a enviar */
    const deleteItem = (index = 0) => {
        const copyArray = emailSelected

        copyArray.splice(index, 1)

        setSelect([...copyArray])
    }

    useEffect(() => {
        createEditor()

        getData()
    }, [])

    return (
        <div className="container-mailing">
            <NavigationBar />

            <div className="header-mail">
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="input-subject" placeholder="Subject" />

                <div className="auto-complete">
                    {
                        emailSelected.map((item, index) => (
                            <div className="item" key={index} title={item.email}>
                                <span className="name">{item.fullname}</span>

                                <span className="delete" onClick={_ => deleteItem(index)}>
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKklEQVQ4T42TS2sTURTHz7ljJuhmtG5aCIrUuDU6aZo0UkooxXwB97qoghvBRfqgUOimTxBEbQt+Ab9AtVRJH3lAYw1urE2UIIEW+khdqdPJPXJuM0MSo3gXA/ee+//dc/7nDELTWjPNmzrifQCIEeJlDqOUJUB8V7Xt+Wg+n6+XoLPJmeY5G/EpCnGvGVq/JykXv+3tPbpTLv9QcP7UxG9QiFv/EjuxKtFaeXf3NkMUIBsMvnRevjgwAEfJJJBlNbCE1wsXYjE4XFpS5yTlQjiXe4Bcs1fT3vMhizsnJuA4nYZCIuFChK6Df24OjFAIiqOjcLSyoiC2Zd3AbDC4gEIMqnp0Ha5NTYHR0wPf02nYSSRUjf7ZWTC6u6GyugrFkREg21YASfSCAQUU4qqTbwMkkwFABCMchsr6OhSHhlwx368SfcZMV5clED0NreFMpqfBiETU8fHGBhRYfHLS4IsksloCVM0zM+plBUilTgFNxipA1jR3UNP8DlqJazWzkNf5aLQlRBJtswfzKARPHnCrlDgUOq15eFh54J+cbAkhKZ9hKhAInNH1D6qN8Th0jo//4TYb60C+jI3B4fKyyuyXbV93BsltZVt/P1R4kGqtqu9OW1+fK5ZEzyObmw8V4JXPd9bX0fFaQ+z9n1EmKZOfDg7id0uln+7PxJBL7e1PnKH6G4hf3t7ff8xiNXzNF9kT4fEMEkAMAa7U4l+R6K0l5WLv1tbHes1v388CuJ4KyckAAAAASUVORK5CYII=" alt="delete" />
                                </span>
                            </div>
                        ))
                    }

                    <input
                        ref={inputSearchUser}
                        onChange={onHandledChangeSearch}
                        value={searchUser}
                        onBlur={blurSearch}
                        type="text"
                        placeholder="Buscar usuario"
                        className="search-user" />
                </div>


                {
                    (allEmails.length > 0 && showList) &&
                    <div className="list-avaible" style={{ left: `${inputSearchUser.current.offsetLeft}px` }}>
                        {
                            allEmails.map((item, key) => {
                                if (
                                    item.fullname.length > 0 && item.fullname.toLowerCase().search(searchUser.toLocaleLowerCase()) > -1 ||
                                    item.email.length > 0 && item.email.toLowerCase().search(searchUser.toLocaleLowerCase()) > -1 &&
                                    // emailSelected.some(e => e.email !== item.email)
                                    emailSelected.filter(e => e.email === item.email).length > 0
                                ) {
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

            <div className="content">
                <div className="editor-container">
                    <div id="editor"></div>
                </div>

                <div className="preview">
                    <div className="results" dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            </div>
        </div>
    )
}

export default Mailing