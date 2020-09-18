import React from "react"

/**
 * @param {Array} data - Datos a renderizar
 * @param {Callback} onDetail - Función a ejecutar al abrir el detalle del registro
 */
const RequestList = ({ data=[], onDetail=_=>{} }) => {
    // Componente que representa un articulo de la lista
    // de solicitudes de registro
    const itemRequest = (item, index) => {
        return (
            <div className="row" key={index} onClick={_ => onDetail(item.id)}>
                <span className="name">{item.name}</span>
                <span>{item.amount} {item.id_currency === 1 && 'BTC'} {item.id_currency === 2 && 'ETH'}</span>
                <span>
                    {
                        item.sponsor_email !== null
                            ? item.sponsor_email
                            : <i>Sin sponsor</i>
                    }
                </span>
            </div>
        )
    }

    return (
        <>
            <h2 className="title">Solicitudes de registros</h2>


            <div className="table request">
                <div className="header">
                    <span>Nombre</span>
                    <span>Monto</span>
                    <span>Sponsor</span>
                </div>

                {
                    data.map(itemRequest)
                }
            </div>
        </>
    )
}

export default RequestList