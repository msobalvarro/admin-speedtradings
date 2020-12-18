import React, { useState } from 'react'
import Swal from 'sweetalert2'

// Import utils
import { copyData, Moment, Petition, WithDecimals } from '../../utils/constanst'

// Import components
import ActivityIndicator from '../ActivityIndicator/Activityindicator'
import EmptyIndicator from '../EmptyIndicator/EmptyIndicator'

/**
 * Muestra el detalle de una solicitud de MoneyChanger
 * @param {Object} data - datos del detalle
 * @param {Callback} onRemove - función a ejecutar luego que una solicitud es aceptada/rechazada 
 */
const DetailMoneyChanger = ({ data = {}, onRemove = _ => { } }) => {
    const [loader, setLoader] = useState(false)

    const [declineConfirm, setDeclineConfirm] = useState(false)
    // Estado que contiene el hash de pago en Compra (Money Changer)
    const [hashMoneyChangerRequest, setHashMoneyChangerRequest] = useState("")
    const [reasonDecline, setReasonDecline] = useState("")
    // Estado que indica si envia notificacion al correo del rechazo de solicitud en Money Changer
    const [checkSendNotification, setCheckSendNotification] = useState(false)

    // Reinicia los campos y los estados a sus valores por defecto
    const resetFields = _ => {
        setDeclineConfirm(false)
        setHashMoneyChangerRequest('')
        setReasonDecline('')
        setCheckSendNotification(false)
        onRemove(data.id)
    }

    /**
     * Acepta una solicitud de MoneyChanger
     * @param {String} _hashMoneyChangerRequest - hash de transacción de la transacción 
     */
    const onAccept = async _hashMoneyChangerRequest => {
        try {
            setLoader(true)

            // Validamos la compra si existe un hash de transaccion
            if (data.type === "buy") {
                if (_hashMoneyChangerRequest.length < 8) {
                    throw String("Hash de transacción es incorrecto")
                }
            } else if (data.type === "sell") {
                // Validamos la venta con un ID de manipulacion
                if (_hashMoneyChangerRequest.length < 8) {
                    throw String("ID de manipulación es incorrecto")
                }
            } else {
                // Si el detalle no es de venta ni de compra
                // Alertamos al usuario
                throw String("Detalles de compra no definido, contacte a Samuel")
            }

            const dataParams = {
                ...data,
                hash: _hashMoneyChangerRequest
            }

            const { data: dataMoneyChanger } = await Petition.post("/money-changer/accept", { data: dataParams })

            if (dataMoneyChanger.error) {
                // Verificamos si el server retorna un error
                throw String(data.message)
            }

            // Verificamos que el servidor retorne la confirmacion
            resetFields()

            Swal.fire({
                icon: 'success',
                title: 'Solicitud Procesada',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (reason) {
            Swal.fire('Ha ocurrido un error', reason.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    /**
     * Función para rechazar una solicitud
     * @param {String} _reasonDecline - Motivo del rechazo de la solicitud 
     * @param {Boolean} _checkSendNotification - Indica si se envía o no una
     * notificación del rechazo al usuario 
     */
    const onDecline = async (_reasonDecline, _checkSendNotification) => {
        try {
            setLoader(true)

            const dataParams = {
                data: data,
                send: checkSendNotification,
                reason: reasonDecline,
            }

            const { data: dataMoneyChanger } = await Petition.post("/money-changer/decline", dataParams)

            if (dataMoneyChanger.error) {
                // Verificamos si en la respuesta del servidor hay errores
                throw String(data.message)
            }

            // Verificamos si se rechazo correctamente
            resetFields()

            Swal.fire({
                icon: 'success',
                title: 'Solicitud Rechazada',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "error")
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className="content-modal request">
            {
                loader &&
                <ActivityIndicator size={48} />
            }

            {
                !loader && Object.keys(data).length === 0 &&
                <EmptyIndicator message='Sin detalle de solicitud para mostrar' />
            }

            {
                (!loader && Object.keys(data).length > 0 && !declineConfirm) &&
                <>
                    <div className="content-col">
                        <div className="col body">
                            <div className="container">
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
                                        <span className="value">
                                            <Moment date={data.date} />
                                        </span>
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
                        </div>
                    </div>

                    <div className="buttons">
                        <button
                            className="button large"
                            onClick={_ => setDeclineConfirm(true)}>
                            Rechazar
                        </button>

                        <button
                            className="button large secondary"
                            onClick={_ => onAccept(hashMoneyChangerRequest)}>
                            Aceptar
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
                                    <button
                                        className="button large"
                                        onClick={_ => setDeclineConfirm(false)}>
                                        Cancelar
                                    </button>

                                    <button
                                        onClick={_ => onDecline(reasonDecline, checkSendNotification)}
                                        className="button large secondary">
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

export default DetailMoneyChanger