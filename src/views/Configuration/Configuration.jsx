import React, { useState, useEffect } from 'react'
import './Configuration.scss'

// Constant and redux store
import { useSelector } from "react-redux"

// Import components
import UploadFile from '../../components/UploadFile/UploadFile'
import Swal from "sweetalert2"
import Modal from "../../components/Modal/Modal"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"

// Import utils
import { Petition, randomKey } from '../../utils/constanst'


const Configuration = () => {
    // get token auth from redux
    const { token } = useSelector(x => x.globalStorage)
    const credentials = {
        headers: {
            "x-auth-token": token
        }
    }

    const [termsList, setTermsList] = useState([])
    const [nameTerm, setNameTerm] = useState('')
    const [descriptionTerm, setDescriptionTerm] = useState('')

    const [loader, setLoader] = useState(false)
    const [showTermModal, setShowTermModal] = useState(false)
    const [readonlyTerm, setReadonlyTerm] = useState(false)

    /**
     * Función para leer el contenido de un archivo de texto
     * @param {File} file 
     */
    const readFile = (file) => new Promise((resolve, _) => {
        const fileReader = new FileReader()

        fileReader.onload = _ => {
            resolve(fileReader.result)
        }

        fileReader.readAsText(file)
    })

    /**
     * Se obtiene la lista de los términos y condiciones disponibles
     */
    const fetchData = async _ => {
        try {
            setLoader(true)

            const { data } = await Petition.get('/terms/list', credentials)

            if (data.error) {
                throw String(data.message)
            }

            setTermsList(data)
        } catch (error) {
            console.error(error)
            Swal.fire('¡Opps!', 'Error al obtener la lista de Términos y condiciones disponibles', 'error')
        } finally {
            setLoader(false)
        }
    }

    // función que se ejecuta a la hora de crear o actualizar un término de condición
    const submitTerm = async _ => {
        try {
            setLoader(true)

            const dataSend = new FormData()

            dataSend.append('key', nameTerm)
            dataSend.append('description', descriptionTerm)
            //dataSend.append('file', file)

            const { data } = await Petition.post('/terms/add', dataSend, credentials)

            if (data.error) {
                throw String(data.message)
            }

            setShowTermModal(false)
            setReadonlyTerm(true)
            Swal.fire('¡Listo!', 'Términos y condiciones agregados correctamente', 'success')
                .then(_ => fetchData())
        } catch (error) {
            Swal.fire("¡Opps!", "Error subir archivo", "error")
        } finally {
            setLoader(false)
        }
    }

    // Muestra el detalle de un término de condición
    const showTermDetail = (term) => {
        setNameTerm(term.name)
        setDescriptionTerm(term.description)
        setShowTermModal(true)
        setReadonlyTerm(true)
    }

    useEffect(_ => {
        fetchData()
    }, [])

    return (
        <div className="Configuration">
            <div className="content">
                <h2>Términos y condiciones</h2>

                <div className="terms-list">
                    {
                        termsList.map(term => (
                            <div key={randomKey()} className="term-item">
                                <p>{term.name}</p>
                                <button
                                    onClick={_ => showTermDetail(term)}
                                    className="button secondary">
                                    Visualizar
                                </button>
                            </div>
                        ))
                    }

                    <button
                        onClick={_ => setShowTermModal(true)}
                        className="button create-term">
                        Crear nuevo
                    </button>
                </div>

                {
                    showTermModal &&
                    <Modal persist={true} onlyChildren>
                        <div className="termDetail">
                            <div className="row">
                                <span>Nombre</span>
                                <input
                                    disabled={readonlyTerm}
                                    value={nameTerm}
                                    onChange={e => setNameTerm(e.target.value)}
                                    type="text"
                                    className="text-input" />
                            </div>

                            <div className="row">
                                <span>Descripción</span>
                                <textarea
                                    disabled={readonlyTerm}
                                    value={descriptionTerm}
                                    onChange={e => setDescriptionTerm(e.target.value)}
                                    className="text-input"></textarea>
                            </div>

                            {
                                !readonlyTerm &&
                                <UploadFile
                                    onChange={async files => {
                                        setDescriptionTerm(await readFile(files))
                                    }}
                                    accept='.txt' />
                            }

                            <div className="buttons">
                                <button
                                    onClick={_ => {
                                        setReadonlyTerm(false)
                                        setShowTermModal(false)
                                        setNameTerm('')
                                        setDescriptionTerm('')
                                    }}
                                    className="button cancel">
                                    {
                                        readonlyTerm
                                            ? 'Cerrar'
                                            : 'Cancelar'
                                    }
                                </button>

                                {
                                    !readonlyTerm &&
                                    <button
                                        onClick={submitTerm}
                                        className="button">Guardar</button>
                                }

                                {
                                    readonlyTerm &&
                                    <button
                                        onClick={_ => setReadonlyTerm(false)}
                                        className="button">Editar</button>
                                }
                            </div>
                        </div>
                    </Modal>
                }
            </div>

            {
                (loader) &&
                <Modal persist={true} onlyChildren>
                    <ActivityIndicator size={64} />
                </Modal>
            }
        </div>
    )
}

export default Configuration