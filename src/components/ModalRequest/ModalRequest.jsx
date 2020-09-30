import React, { useState } from "react"
import "./ModalRequest.scss"

// Import components
import Modal from "../Modal/Modal"
import ActivityIndicator from "../ActivityIndicator/Activityindicator"

// Import utils
import { copyData } from "../../utils/constanst"

/**
 * @param {Object} data - Datos a renderizar
 * @param {Callback} onClose - Función a ejecutar al cerrar el modal
 * @param {Callback} onAccept - Función a ejecutar al hacer click en el botón de aprobar
 * @param {Callback} onDecline - Función a ejecutar al hacer click en el botón de rechazar
 * @param {Boolean} loader - Estado indicador de carga de los datos
 */
const ModalRequest = ({ data=null, onClose=_=>{}, onAccept=_=>{}, onDecline=_=>{}, loader=false }) => {

    return (
        <Modal onClose={_ => onClose()}>
            <div className="content-modal request">
                {
                    loader &&
                    <ActivityIndicator size={48} />
                }
                {
                    !loader && data !== null &&
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
        </Modal>
    )
}

export default ModalRequest