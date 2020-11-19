import React, { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import { useSelector } from "react-redux"
import "./DetailRequest.scss"

// Import components
import ActivityIndicator from "../ActivityIndicator/Activityindicator"
import EmptyIndicator from "../EmptyIndicator/EmptyIndicator"

// Import utils
import { copyData, Petition } from "../../utils/constanst"

/**
 * @param {Object} data - Datos a renderizar
 * @param {Callback} onClose - Función a ejecutar al cerrar el modal
 * @param {Callback} onAccept - Función a ejecutar al hacer click en el botón de aprobar
 * @param {Callback} onDecline - Función a ejecutar al hacer click en el botón de rechazar
 * @param {Boolean} loader - Estado indicador de carga de los datos
 */
const DetailRequest = ({ id = -1 }) => {
    const { token } = useSelector((storage) => storage.globalStorage)
    const credentials = {
        headers: {
            "x-auth-token": token
        }
    }

    const [loader, setLoader] = useState(false)
    const [data, setData] = useState({})

    const fetchDetail = async _ => {
        try {
            // Show loader
            setLoader(true)

            // get data for petition
            const { data } = await Petition.post('/admin/request/id', { id }, credentials)

            if (data.error) {
                throw data.message
            }
            window.alert('fetched')
            setData(data)
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    const onAccept = _ => { }
    const onDecline = _ => { }

    useEffect(_ => {
        if (id !== -1) {
            fetchDetail()
        }
    }, [id])

    return (
        <div className="content-modal request">
            {
                loader &&
                <ActivityIndicator size={48} />
            }

            {
                !loader && id === -1 &&
                <EmptyIndicator message='Sin detalle de solicitud para mostrar' />
            }

            {
                !loader && Object.keys(data).length > 0 &&
                <>
                    <div className="content-col">
                        <div className="col body">
                            <h2>Detalle de solicitud</h2>

                            <div className="container">
                                <div className="col">
                                    <div className="row">
                                        <span className="name">Nombre</span>
                                        <span className="value">{data.name}</span>
                                    </div>

                                    <div className="row">
                                        <span className="name">Correo</span>
                                        <span className="value">{data.email}</span>
                                    </div>

                                    <div className="row">
                                        {
                                            data.email_airtm !== null
                                                ? <span className="name">Id de manipulacion</span>
                                                : <span className="name">Hash de transaccion</span>
                                        }

                                        <span className="value copy" onClick={_ => copyData(data.hash)}>{data.hash}</span>
                                    </div>
                                </div>

                                <div className="col">
                                    {
                                        (data.aproximate_amount !== null) &&

                                        <>
                                            <div className="row">
                                                <span className="name">Deposito aproximado</span>
                                                <span className="value">$ {data.aproximate_amount}</span>
                                            </div>

                                            <div className="row">
                                                <span className="name">Correo de transaccion</span>
                                                <span className="value">{data.email_airtm}</span>
                                            </div>
                                        </>
                                    }

                                    <div className="row">
                                        <span className="name">Monto</span>
                                        <span className="value">
                                            {data.amount} {data.id_currency === 1 && 'BTC'} {data.id_currency === 2 && 'ETH'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="buttons">
                        <button className="button large" onClick={_ => onDecline()}>
                            Rechazar
                        </button>

                        <button className="button large secondary" onClick={_ => onAccept()}>
                            Aprobar
                        </button>
                    </div>
                </>
            }

        </div>
    )
}

export default DetailRequest