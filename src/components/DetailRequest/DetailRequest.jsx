import React, { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import "./DetailRequest.scss"

// Import components
import ActivityIndicator from "../ActivityIndicator/Activityindicator"
import EmptyIndicator from "../EmptyIndicator/EmptyIndicator"

// Import utils
import { copyData, Petition } from "../../utils/constanst"

/**
 * @param {Number} id - id de la solicitud de registro
 * @param {Callback} onRemove - función a ejecutar cuando se rechaza un registro
 */
const DetailRequest = ({ id = -1, onRemove = _ => { } }) => {
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState({})

    // Obtiene el detalle de una solicitud de registro
    const fetchDetail = async _ => {
        try {
            // Show loader
            setLoader(true)

            // get data for petition
            const { data } = await Petition.get(`/admin/request/details/${id}`)

            if (data.error) {
                throw data.message
            }

            setData(data)
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    const onRemoveDetail = _id => {
        onRemove(_id)
        setData({})
    }

    /**
     * Acepta una solicitud de registro
     * @param {Object} dataSend - datos de la solicitud de registro
     */
    const onAccept = async _ => {
        try {
            setLoader(true)

            const { data: dataResult } = await Petition.post('/admin/request/accept', { data })

            if (dataResult.error) {
                throw String(dataResult.message)
            }

            onRemoveDetail(id)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Solicitud Aceptada',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "warning")
        } finally {
            setLoader(false)
        }
    }

    // Rechaza una solicitud de registro
    const onDecline = _ => {
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

                    const { data } = await Petition.delete('/admin/request/decline', {
                        data: { id }
                    })

                    if (data.error) {
                        throw String(data.message)
                    }

                    onRemoveDetail(id)
                    Swal.fire({
                        icon: 'success',
                        title: 'Solicitud Rechazada',
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
                            <h2>Detalle solicitud de registro</h2>

                            <div className="container">
                                <div className="col">
                                    <div className="row">
                                        <span className="name">Nombre</span>
                                        <span
                                            onClick={_ => copyData(data.name)}
                                            className="value">{data.name}</span>
                                    </div>

                                    <div className="row">
                                        <span className="name">Correo</span>
                                        <span
                                            onClick={_ => copyData(data.email)}
                                            className="value">{data.email}</span>
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
                                        data.sponsor_name &&
                                        <div className="row">
                                            <span className="name">Nombre sponsor</span>
                                            <span className="value">{data.sponsor_name}</span>
                                        </div>
                                    }
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
                                                <span
                                                    onClick={_ => data.email_airtm}
                                                    className="value">{data.email_airtm}</span>
                                            </div>
                                        </>
                                    }

                                    <div className="row">
                                        <span className="name">Monto</span>
                                        <span className="value">
                                            {data.amount} {data.id_currency === 1 && 'BTC'} {data.id_currency === 2 && 'ETH'}
                                        </span>
                                    </div>

                                    {
                                        data.sponsor_email &&
                                        <div className="row">
                                            <span className="name">Correo sponsor</span>
                                            <span className="value">{data.sponsor_email}</span>
                                        </div>
                                    }
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