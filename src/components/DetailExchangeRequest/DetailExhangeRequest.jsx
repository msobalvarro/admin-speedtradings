import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'

// Import components
import ActivityIndicator from "../ActivityIndicator/Activityindicator"
import EmptyIndicator from "../EmptyIndicator/EmptyIndicator"

// Import utils
import { copyData, Petition, Moment } from "../../utils/constanst"


/**
 * 
 * @param {Object} data - datos del detalle del Exchange
 * @param {Callback} onRemove -función a ejecutar luego de aceptar/rechazar una solicitud 
 */
const DetailExchangeRequest = ({ data = {}, onRemove = _ => { } }) => {
    const { token } = useSelector(storage => storage.globalStorage)
    const credentials = {
        headers: {
            'x-auth-token': token
        }
    }

    const [loader, setLoader] = useState(false)
    // Estado que muestra la ventana de confirmacion de rechazo
    const [declineConfirm, setDeclineConfirm] = useState(false)
    // Estado que contiene el hash de pago en exchange
    const [hashExchangeRequest, setHashExchangeRequest] = useState('')
    // Estado que guarda la razon del rechazo de intercambio exchange
    const [reasonDecline, setReasonDecline] = useState('')

    const reset = _ => {
        setReasonDecline('')
        setHashExchangeRequest('')
        setDeclineConfirm(false)
        onRemove(data.id)
    }

    const onAccept = async _hashExchangeRequest => {
        try {
            if (_hashExchangeRequest.length < 8) {
                throw String("El hash de transaccion no es valido")
            }

            setLoader(true)

            const previousData = {
                exchange: data,
                hash: _hashExchangeRequest,
            }

            const { data: dataResult } = await Petition.post("/exchange/accept", previousData, credentials)

            if (dataResult.error) {
                throw String(dataResult.message)
            }

            reset()
            Swal.fire({
                icon: 'success',
                title: 'Reporte enviado',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            Swal.fire("AlyExchange", error.toString(), "error")
        } finally {
            setLoader(false)
        }
    }

    const onDecline = async _reasonDecline => {
        try {
            if (_reasonDecline.length < 10) {
                throw String("La razon de rechazo debe de tener minimo 10 caracteres")
            }

            setLoader(true)

            const previousData = {
                exchange: data,
                reason: _reasonDecline,
            }

            const { data: dataResult } = await Petition.post("/exchange/decline", previousData, credentials)

            if (dataResult.error) {
                throw String(dataResult.message)
            }

            reset()
            Swal.fire({
                icon: 'success',
                title: 'Solicitud Rechazada',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.log(error)
            Swal.fire("Ha ocurrido un errro", error.toString(), "error")
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className="content-modal exchange">

            {
                loader &&
                <ActivityIndicator size={48} />
            }

            {
                !loader && Object.keys(data).length === 0 &&
                <EmptyIndicator message='Sin detalle de solicitud para mostrar' />
            }

            {
                !loader && Object.keys(data).length > 0 && !declineConfirm &&
                <>
                    <div className="content-col">
                        <div className="col body">
                            <div className="container">
                                <div className="col">
                                    <h2>Detalle de Compra</h2>
                                    <div className="row">
                                        <span className="name">Solicitud Procesada</span>
                                        <span className="value">
                                            <Moment date={data.date} />
                                        </span>
                                    </div>

                                    <div className="row">
                                        <span className="name">Moneda a pagar</span>
                                        <span className="value">{data.currency}</span>
                                    </div>

                                    <div className="row">
                                        <span className="name">Precio de Moneda</span>
                                        <span className="value">$ {data.coin_price}</span>
                                    </div>

                                    <div className="row">
                                        <span className="name">Moneda a comprar</span>
                                        <span className="value">{data.request_currency}</span>
                                    </div>

                                    <div className="row">
                                        <span className="name">Cliente</span>
                                        <span className="value">{data.email}</span>
                                    </div>
                                </div>

                                <div className="col">
                                    <h2>Detalle de Transaccion</h2>

                                    <div className="row">
                                        <span className="name">Hash de transaccion</span>
                                        <span
                                            onClick={_ => copyData(data.hash)}
                                            className="value">{data.hash}</span>
                                    </div>

                                    <div className="row">
                                        <span className="name">Monto recibido</span>
                                        <span className="value">{data.amount} {data.currency}</span>
                                    </div>


                                    <div className="row">
                                        <span className="name">Monto aproximado de {data.request_currency}</span>
                                        <span className="value">{data.approximate_amount} <b>{data.request_currency}</b></span>
                                    </div>

                                    <div className="row">
                                        <span className="name">Direccion Wallet</span>
                                        <span className="value copy" onClick={_ => copyData(data.wallet)}>{data.wallet}</span>
                                    </div>

                                    {
                                        data.memo !== null &&
                                        <div className="row">
                                            <span className="name">Memo</span>
                                            <span className="value">{data.memo}</span>
                                        </div>
                                    }

                                    {
                                        data.label !== null &&
                                        <div className="row">
                                            <span className="name">Label</span>
                                            <span className="value">{data.label}</span>
                                        </div>
                                    }

                                    <div className="row">
                                        <span className="name">Hash de Pago</span>
                                        <input
                                            type="text"
                                            value={hashExchangeRequest}
                                            onChange={e => setHashExchangeRequest(e.target.value)}
                                            placeholder="Hash de Transaccion"
                                            className="text-input" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="buttons">
                        <button className="button large" onClick={_ => setDeclineConfirm(true)}>
                            Rechazar
                            </button>

                        <button className="button large secondary" onClick={_ => onAccept(hashExchangeRequest)}>
                            Responder
                            </button>
                    </div>
                </>
            }

            {
                (declineConfirm && !loader) &&
                <div className="content-col">
                    <div className="col body">
                        <div className="container">
                            <div className="confirm-decline">
                                <h1>Rechazar Solicitud de intercambio</h1>

                                <div className="row-reason">
                                    <span className="legend-decline">
                                        Describa la razon de rechazo ({reasonDecline.length})
                            </span>

                                    <textarea
                                        className="text-input"
                                        placeholder="Razon de rechazo"
                                        value={reasonDecline}
                                        rows="5"
                                        onChange={e => setReasonDecline(e.target.value)} />
                                </div>

                                <div className="buttons">
                                    <button className="button large" onClick={e => setDeclineConfirm(false)}>
                                        Cancelar
                            </button>

                                    <button onClick={_ => onDecline(reasonDecline)} className="button large secondary">
                                        Rechazar
                            </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default DetailExchangeRequest