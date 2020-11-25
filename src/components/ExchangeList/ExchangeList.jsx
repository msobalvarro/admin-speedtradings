import React from "react"
import { Moment } from '../../utils/constanst'

/**
 * @param {Array} data - Datos a renderizar
 * @param {Callback} onDetail - Función a ejecutar al abrir el detalle del registro
 */
const ExchangeList = ({ data = [], onDetail = _ => { }, activeDetail = { id: -1 } }) => {
    // Componente que representa un articulo de la lista Exchange request
    const itemExchnage = (item, index) => {
        // Compra -- Venta -- Cantidad -- tiempo
        return (
            <div
                className={`row ${activeDetail.id === item.id ? 'active' : ''}`}
                key={index}
                onClick={_ => onDetail(item)}>
                <span>{item.request_currency}</span>
                <span>{item.currency}</span>
                <span>{item.amount}</span>
                <span><Moment date={item.date} /></span>
            </div>
        )
    }

    return (
        <>
            <div className="separator" />

            <h2 className="title">Solicitudes de Exchange</h2>

            <div className="table exchange">
                <div className="header">
                    <span>Compra</span>
                    <span>Venta</span>
                    <span>Cantidad</span>
                    <span>Solicitado</span>
                </div>

                {
                    data.map(itemExchnage)
                }
            </div>

        </>
    )
}

export default ExchangeList