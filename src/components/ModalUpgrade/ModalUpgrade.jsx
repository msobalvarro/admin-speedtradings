import React, { useState } from "react"
import "./ModalUpgrade.scss"

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
const ModalUpgrade = ({ data=null, onClose=_=>{}, onAccept=_=>{}, onDecline=_=>{}, loader=false}) => {
    // Estado que guarda el hash de transaccion al sponsor_email
    // Cuando un usuario hace una solicitud de inversion
    const [hashForSponsor, setHashForSponsor] = useState('')

    data.sponsors = [
        {
            hash: "hfskjdfhkdsfhksdhfk",
            name: "Harold Espinoza",
            amount: 10.099,
            wallet: "ndfbskjrkhdfsdgfdkj4"
        },
        {
            hash: "hfskjdfhkdsfhksdhfk",
            name: "Harold Espinoza",
            amount: 10.099,
            wallet: "ndfbskjrkhdfsdgfdkj4"
        },
        {
            hash: null,
            name: "Harold Espinoza",
            amount: 10.099,
            wallet: "ndfbskjrkhdfsdgfdkj4"
        }
    ]
    return (
        <Modal onClose={_ => onClose()} className={"upgrade-modal"}>
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

                            <button className="button large secondary" onClick={_ => onAccept(hashForSponsor)}>
                                Aprobar
                            </button>
                        </div>
                    </>
                }

            </div>
        </Modal>
    )
}

export default ModalUpgrade