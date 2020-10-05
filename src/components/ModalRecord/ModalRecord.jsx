import React from "react"
import { Link } from "react-router-dom"
import "./ModalRecord.scss"

// Import components
import Modal from "../Modal/Modal"
import ActivityIndicator from "../ActivityIndicator/Activityindicator"

// Import utils
import { copyData } from "../../utils/constanst"

/**
 * @param {Object} data - Datos a renderizar
 * @param {Callback} onClose - Función a ejecutar al cerrar el modal
 * @param {Boolean} loader - Estado del indicador de carga
 */
const ModalRecord = ({data=null, onClose=_=>{}, loader=false}) => {
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
                            <div className="col">
                                <h2>Detalles</h2>
                                <div className="row">
                                    <span className="name">Nombre</span>
                                    <span className="value">{data.name}</span>
                                </div>

                                <div className="row">
                                    <span className="name">Correo</span>
                                    <span className="value">{data.email}</span>
                                </div>


                                <div className="row">
                                    <span className="name">Pais</span>
                                    <span className="value">{data.country}</span>
                                </div>

                                <div className="row">
                                    <span className="name">Telefono</span>
                                    <span className="value">{data.phone}</span>
                                </div>

                                <div className="row color">
                                    <span className="name">Sponsor</span>
                                    {
                                        data.email_sponsor !== null &&
                                        < span className="value">{data.email_sponsor}</span>
                                    }

                                    {
                                        data.email_sponsor === null &&
                                        < span className="value">
                                            <i>SIN SPONSOR</i>
                                        </span>
                                    }
                                </div>

                            </div>

                            <div className="col">
                                <div className="rows border-bottom">
                                    <div className="header">
                                        <span className={`status ${data.amount_btc !== null ? 'active' : 'inactive'}`}>
                                            {data.amount_btc !== null ? 'Activo' : 'Inactivo'}
                                        </span>
                                        <h2>Plan en Bitcoin</h2>
                                    </div>

                                    <div className="row">
                                        <span className="name">Monto Actual</span>
                                        {
                                            data.amount_btc !== null
                                                ? <span className="value">{data.amount_btc} BTC</span>
                                                : <span className="value"> <i>SIN MONTO</i> </span>
                                        }
                                    </div>

                                    <div className="row">
                                        <span className="name">Wallet</span>
                                        <span className="value copy" onClick={_ => copyData(data.wallet_btc)}>{data.wallet_btc}</span>
                                    </div>
                                </div>

                                <div className="rows border-bottom">
                                    <div className="header">
                                        <span className={`status ${data.amount_eth !== null ? 'active' : 'inactive'}`}>
                                            {data.amount_eth !== null ? 'Activo' : 'Inactivo'}
                                        </span>
                                        <h2>Plan en Ethereum</h2>
                                    </div>

                                    <div className="row">
                                        <span className="name">Monto Actual</span>
                                        {
                                            data.amount_eth !== null
                                                ? <span className="value">{data.amount_eth} ETH</span>
                                                : <span className="value"> <i>SIN MONTO</i> </span>
                                        }
                                    </div>

                                    <div className="row">
                                        <span className="name">Wallet</span>
                                        <span className="value copy" onClick={_ => copyData(data.wallet_eth)}>{data.wallet_eth}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="buttons">
                            <button className="button large" onClick={_ => onClose()}>
                                cerrar
                            </button>

                            <Link to={`/reports/${data.id}`} className="button large secondary">
                                Generar Reporte
                            </Link>
                        </div>
                    </>
                }
            </div>
        </Modal>
    )
}

export default ModalRecord