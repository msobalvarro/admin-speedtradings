import React from "react"
import moment from "moment"

/**
 * @param {Array} data - Datos a renderizar
 * @param {Callback} onDetail - Función a ejecutar al abrir el detalle del registro
 */
const MoneyChangerList = ({ data=[], onDetail=_=>{} }) => {
    // Componente que representa un articulo de la lista Exchange request
    const itemMoneyChanger = (item, index) => {
        // Tipo - Moneda - Monto - Solicitado
        return (
            <div className="row" key={index} onClick={_ => onDetail(index)}>
                {
                    item.type === "buy" &&
                    <span>Compra</span>
                }

                {
                    item.type === "sell" &&
                    <span>Venta</span>
                }

                {
                    (item.type !== "sell" && item.type !== "buy") &&
                    <span>No identificado</span>
                }

                <span>{item.coin_name}</span>
                <span>$ {item.amount_usd}</span>
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
                    <span>Tipo</span>
                    <span>Moneda</span>
                    <span>Monto</span>
                    <span>Solicitado</span>
                </div>

                {
                    data.map(itemMoneyChanger)
                }
            </div>

        </>
    )
}

export default MoneyChangerList