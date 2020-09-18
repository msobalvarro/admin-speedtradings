import React from "react"
import moment from "moment"

/**
 * @param {Array} data - Datos a renderizar
 * @param {Callback} onDetail - Función a ejecutar al abrir el detalle del registro
 */
const ExchangeList = ({ data=[], onDetail=_=>{} }) => {
    // Componente que representa un articulo de la lista Exchange request
    const itemExchnage = (item, index) => {
        // Compra -- Venta -- Cantidad -- tiempo
        return (
            <div className="row" key={index} onClick={_ => onDetail(index)}>
                <span>{item.request_currency}</span>
                <span>{item.currency}</span>
                <span>{item.amount}</span>
                <span>{moment(item.date).fromNow()}</span>
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