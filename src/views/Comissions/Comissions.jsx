import React, { useEffect, useState } from "react"
import "./Comissions.scss"

// Import components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"

import dataset from "./data"

const Comissions = () => {
    const [data, setData] = useState([])
    const [dataDetail, setDataDetail] = useState({})

    useEffect(_ => {
        setTimeout(_ => {
            setData(dataset)
            setDataDetail(dataset[0])
        }, 1000)
    }, [])

    return (
        <div className="Comissions">
            <NavigationBar/>

            <div className="Comissions-content">
                <div className="column Comissions-list">
                    <div className="Comissions-list-header">
                        <h2>Comisiones</h2>

                        <div>
                            <input type="text" placeholder="Escribe para buscar..." className="field-input"/>
                            <p>
                                <span className="pending">Pendiente</span>
                                <span>|</span>
                                <span className="ready">Listo para pagar</span>
                            </p>
                        </div>
                    </div>

                    {
                        data.length === 0 &&
                        <ActivityIndicator size={46}/>
                    }

                    {
                        data.length > 0 &&
                        <div className="table">
                            <div className="header">
                                <span>Nombre</span>
                                <span>Moneda</span>
                                <span>Monto</span>
                                <span>Estado</span>
                            </div>
                            <div className="body">
                                {
                                    data.map(item => (
                                        <div onClick={_ => setDataDetail(item)} className="row">
                                            <span>{item.name}</span>
                                            <span>{item.coin}</span>
                                            <span>{item.amount} {item.symbol}</span>
                                            <span className={item.status ? 'ready' : 'pending'}></span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>

                <div className="column Comissions-detail">
                    <h2>Vista previa de Sponsor</h2>

                    {
                        Object.keys(dataDetail).length === 0 &&
                        <p className="empty-detail">No hay ningún elemento seleccionado</p>
                    }

                    {
                        Object.keys(dataDetail).length > 0 &&
                        <>
                            <div className="detail-item">
                                <span className="label">Nombre</span>
                                <span className="value">{dataDetail.name}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">Correo electrónico</span>
                                <span className="value">{dataDetail.email}</span>
                            </div>

                            <div className="detail-section">
                                <div className="column">
                                    <div className="detail-item">
                                        <span className="label">Monto</span>
                                        <span className="value">{dataDetail.amount} {dataDetail.symbol}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Comissión</span>
                                        <span className="value">
                                            {dataDetail.comission} % | {(dataDetail.amount * dataDetail.comission) / 100} {dataDetail.symbol}
                                        </span>
                                    </div>
                                </div>

                                <div className="column">
                                    <div className="detail-item">
                                        <span className="label">Moneda</span>
                                        <span className="value">{dataDetail.coin}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Estado</span>
                                        <span className={`value ${dataDetail.status ? 'ready' : 'pending'}`}>
                                            {
                                                dataDetail.status === 1
                                                ? 'Pagado'
                                                : 'Pendiente'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-item">
                                <span className="label">Wallet en {dataDetail.symbol}</span>
                                <span className="value hash">{dataDetail.wallet}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">Hash de transacción</span>
                                <input type="text" placeholder="Hash de transacción" className="value field-input"/>
                            </div>

                            <div className="detail-buttons">
                                <button className="decline">Rechazar &#10005;</button>
                                <button className="confirm">Aprobar &#10003;</button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Comissions