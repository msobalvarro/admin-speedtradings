import React, { useState } from "react"
import moment from "moment"
import "./ModalMoneyChangerRequest.scss"

// Import components
import Modal from "../Modal/Modal"
import ActivityIndicator from "../ActivityIndicator/Activityindicator"

// Import Utils
import { copyData, WithDecimals } from "../../utils/constanst"

/**
 * @param {Object} data - Datos a renderizar
 * @param {Callback} onClose - Función a ejecutar al cerrar el modal
 * @param {Callback} onAccept - Función a ejecutar al aceptar el request
 * @param {Callback} onDecline - Función a ejecutar al declinar el request
 * @param {Boolean} loader - Estado del indicador de carga  
 */
const ModalMoneyChangerRequest = ({
    data=null,
    onClose=_=>{},
    onAccept=_=>{},
    onDecline=_=>{},
    loader=false 
}) => {
    const [declineConfirm, setDeclineConfirm] = useState(false)
    // Estado que contiene el hash de pago en Compra (Money Changer)
    const [hashMoneyChangerRequest, setHashMoneyChangerRequest] = useState("")
    const [reasonDecline, setReasonDecline] = useState("")
    // Estado que indica si envia notificacion al correo del rechazo de solicitud en Money Changer
    const [checkSendNotification, setCheckSendNotification] = useState(false)

    return (
        <Modal onClose={_ => onClose()}>
            <div className="content-modal exchange">
                {
                    loader &&
                    <ActivityIndicator size={48} />
                }

                {
                    (!loader && data !== null && !declineConfirm) &&
                    <>
                        <div className="content-col">
                            <div className="col">
                                {
                                    data.type === "buy" &&
                                    <h2>Detalles de Compra</h2>
                                }

                                {
                                    data.type === "sell" &&
                                    <h2>Detalles de Venta</h2>
                                }

                                {
                                    (data.type !== "sell" && data.type !== "buy") &&
                                    <h2>Detalles general</h2>
                                }

                                <div className="row">
                                    <span className="name">Solicitud Procesada</span>
                                    <span className="value">{moment(data.date).fromNow()}</span>
                                </div>

                                <div className="row">
                                    <span className="name">Moneda</span>
                                    <span className="value">{data.coin_name}</span>
                                </div>

                                <div className="row">
                                    <span className="name">Precio moneda</span>
                                    <span className="value copy" onClick={_ => copyData(data.price_coin)}>
                                        $ {data.price_coin}
                                    </span>
                                </div>

                                <div className="row">
                                    <span className="name">Correo Airtm</span>
                                    <span className="value copy" onClick={_ => copyData(data.email_airtm)}>{data.email_airtm}</span>
                                </div>
                            </div>

                            <div className="col">
                                <h2>Detalle de Transaccion</h2>

                                {
                                    data.manipulation_id !== null &&
                                    <div className="row">
                                        <span className="name">ID de manipulacion</span>
                                        <span className="value copy" onClick={_ => copyData(data.manipulation_id)}>{data.manipulation_id}</span>
                                    </div>
                                }

                                {
                                    data.wallet !== null &&
                                    <div className="row">
                                        <span className="name">Wallet</span>
                                        <span className="value copy" onClick={_ => copyData(data.wallet)}>{data.wallet}</span>
                                    </div>
                                }


                                <div className="row">
                                    {
                                        data.type === "buy" &&
                                        <span className="name">Monto (USD) <b>A RECIBIR</b></span>
                                    }

                                    {
                                        data.type === "sell" &&
                                        <span className="name">Monto (USD) <b>A ENVIAR</b></span>
                                    }

                                    {
                                        (data.type !== "sell" && data.type !== "buy") &&
                                        <span className="name">Monto (USD)</span>
                                    }
                                    <span className="value copy" onClick={_ => copyData(data.amount_usd)}>
                                        $ {WithDecimals(data.amount_usd)}
                                    </span>
                                </div>

                                <div className="row">
                                    <span className="name">Fracciones</span>
                                    <span className="value copy" onClick={_ => copyData(data.amount_fraction)}>{data.amount_fraction}</span>
                                </div>

                                {
                                    data.hash === null &&
                                    <div className="row">
                                        <span className="name">Hash de Pago</span>

                                        <input
                                            type="text"
                                            value={hashMoneyChangerRequest}
                                            onChange={e => setHashMoneyChangerRequest(e.target.value)}
                                            placeholder="Hash de Transaccion"
                                            className="text-input" />
                                    </div>
                                }

                                {
                                    data.hash !== null &&
                                    <div className="row">
                                        <span className="name">Hash de transaccion</span>
                                        <span className="value copy" onClick={_ => copyData(data.hash)}>{data.hash}</span>
                                    </div>
                                }

                                {
                                    data.manipulation_id === null &&
                                    <div className="row">
                                        <span className="name">ID de manipulacion</span>

                                        <input
                                            type="text"
                                            value={hashMoneyChangerRequest}
                                            onChange={e => setHashMoneyChangerRequest(e.target.value)}
                                            placeholder="ID de manipulacion"
                                            className="text-input" />
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="buttons">
                            <button className="button large" onClick={_ => setDeclineConfirm(true)}>
                                Rechazar
                            </button>

                            <button className="button large secondary" onClick={_ => onAccept(hashMoneyChangerRequest)}>
                                Aceptar
                            </button>
                        </div>
                    </>
                }

                {
                    (declineConfirm && !loader) &&
                    <div className="confirm-decline">
                        <h1>Rechazar Solicitud de intercambio</h1>

                        <div className="row-reason">
                            <div className="sub-row">
                                <span className="legend-decline">
                                    Describa la razon de rechazo ({reasonDecline.length})
                                </span>

                                <div className="content-check">
                                    <label htmlFor="check-send-email-decline">Enviar notificación</label>
                                    <input
                                        checked={checkSendNotification}
                                        onChange={_ => setCheckSendNotification(!checkSendNotification)}
                                        type="checkbox"
                                        id="check-send-email-decline" />
                                </div>
                            </div>

                            <textarea
                                className="text-input"
                                placeholder="Razon de rechazo"
                                value={reasonDecline}
                                rows="5"
                                onChange={e => setReasonDecline(e.target.value)} />
                        </div>

                        <div className="buttons">
                            <button className="button large" onClick={_ => setDeclineConfirm(false)}>
                                Cancelar
                            </button>

                            <button onClick={_ => onDecline(reasonDecline, checkSendNotification)} className="button large secondary">
                                Rechazar
                            </button>
                        </div>
                    </div>
                }
            </div>
        </Modal>
    )
}

export default ModalMoneyChangerRequest