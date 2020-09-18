import React, { useState } from "react"
import moment from "moment"
import "./ModalExchangeRequest.scss"

// Import components
import Modal from "../Modal/Modal"
import ActivityIndicator from "../ActivityIndicator/Activityindicator"

// Import utils
import { copyData } from "../../utils/constanst"

/**
 * @param {Object} data - Datos a renderizar
 * @param {Callback} onClose - Función a ejecutar el cerrar el modal
 * @param {Callback} onAccept - Función a ejecutar al aceptar el exchange
 * @param {Callback} onDecline - Función a ejecutar al rechazar el exchange
 * @param {Boolean} loader - Estado para el indicador de carga 
 */
const ModalExchangeRequest = ({ data=null, onClose=_=>{}, onAccept=_=>{}, onDecline=_=>{}, loader=false }) => {
    // Estado que muestra la ventana de confirmacion de rechazo
    const [declineConfirm, setDeclineConfirm] = useState(false)
    // Estado que contiene el hash de pago en exchange
    const [hashExchangeRequest, setHashExchangeRequest] = useState('')
    // Estado que guarda la razon del rechazo de intercambio exchange
    const [reasonDecline, setReasonDecline] = useState('')

    return (
        <Modal onClose={_ => onClose()}>
            <div className="content-modal exchange">

                {
                    loader &&
                    <ActivityIndicator size={48} />
                }

                {
                    (!loader && !declineConfirm) && data !== null &&
                    <>
                        <div className="content-col">
                            <div className="col">
                                <h2>Detalle de Compra</h2>

                                <div className="row">
                                    <span className="name">Solicitud Procesada</span>
                                    <span className="value">{moment(data.date).fromNow()}</span>
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
                                    <span className="value">{data.hash}</span>
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
                }
            </div>
        </Modal>
    )
}

export default ModalExchangeRequest