import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useSelector } from "react-redux"

// Import components
import ActivityIndicator from "../ActivityIndicator/Activityindicator"
import EmptyIndicator from "../../components/EmptyIndicator/EmptyIndicator"

// Import utils
import { copyData, Petition } from "../../utils/constanst"


/**
 * Muestra el detalle de un upgrade
 * @param {Number} id - id del registro de upgrade
 * @param {Callback} onRemove - función a ejecutar luego de aceptar/rechazar una solicitud
 */
const DetailUpgrade = ({ id = -1, onRemove = _ => { } }) => {
    const { token } = useSelector((storage) => storage.globalStorage)
    const credentials = {
        headers: {
            "x-auth-token": token
        }
    }

    const [data, setData] = useState({})
    const [loader, setLoader] = useState(false)

    const fetchDetail = async _ => {
        try {
            // Show loader
            setLoader(true)

            // get data for petition
            const { data } = await Petition.post('/admin/upgrades/id', { id }, credentials)

            if (data.error) {
                throw data.message
            }

            setData(data)
        } catch (error) {
            console.error(error)
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    // Reestrablece los estados a su valor inicial
    const onRemoveDetail = _id => {
        onRemove(_id)
        setData({})
    }

    /**
     * Función a ejecutar para aceptar un upgrade
     * @param {Object} dataSend - datos del upgrade 
     */
    const onAccept = async (dataSend) => {
        try {

            const { data } = await Petition.post('/admin/upgrades/accept', { data: dataSend }, credentials)

            if (data.error) {
                throw String(data.message)
            }

            onRemoveDetail(id)
            Swal.fire({
                icon: 'success',
                title: 'Solicitud Aceptada',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.error(error)
            Swal.fire("Ha ocurrido un error", error.toString(), "warning")
        } finally {
            setLoader(false)
        }
    }

    /**
     * Función a ejecutar para rechazar una solicitud
     */
    const onDecline = _ => {
        // Se muestra un mensaje de confirmación antes de proceder
        Swal.fire({
            title: 'Rechazar',
            text: "¿Esta seguro que quiere ejecutar esta Accion? No se podra revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, Rechazar!'
        }).then(async (result) => {
            if (result.value) {
                try {
                    setLoader(true)

                    const { data } = await Petition.delete('/admin/upgrades/decline', {
                        ...credentials,
                        data: { id },
                    })

                    if (data.error) {
                        throw String(data.message)
                    }

                    onRemoveDetail(id)
                    Swal.fire({
                        icon: 'success',
                        title: 'Upgrade Rechazada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } catch (error) {
                    console.error(error)
                    Swal.fire('Se ha producido un error', error.toString(), 'error')
                } finally {
                    setLoader(false)
                }
            }
        })
    }

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
                            <h2>Detalles de solicitud</h2>

                            <div className="container">
                                <div className="col">
                                    <div className="row">
                                        <span className="name">Nombre</span>
                                        <span className="value">{data.name}</span>
                                    </div>

                                    <div className="row">
                                        {
                                            data.email_airtm !== null
                                                ? <span className="name">Id de manipulacion</span>
                                                : <span className="name">Hash de transaccion</span>
                                        }

                                        <span className="value copy" onClick={_ => copyData(data.hash)}>{data.hash}</span>
                                    </div>

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
                                        <span className="name">Monto Actual</span>
                                        <span className="value">
                                            {data.current_amount} {data.id_currency === 1 && 'BTC'} {data.id_currency === 2 && 'ETH'}
                                        </span>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="row">
                                        <span className="name">Correo</span>
                                        <span className="value">{data.email}</span>
                                    </div>

                                    <div className="row">
                                        <span className="name">Monto a Sumar</span>
                                        <span className="value">
                                            {data.amount_requested} {data.id_currency === 1 && 'BTC'} {data.id_currency === 2 && 'ETH'}
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

export default DetailUpgrade