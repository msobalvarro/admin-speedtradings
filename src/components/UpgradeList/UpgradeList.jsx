import React from "react"

/**
 * @param {Array} data - Datos a renderizar
 * @param {Callback} onDetail - Función a ejecutar al abrir el detalle del registro
 */
const UpgradeList = ({ data=[], onDetail=_=>{} }) => {
    // Componente que representa un articulo de la lista
    // de solicitudes de Upgrade
    const itemUpgrade = (item, index) => {
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
            <div className="separator" />

            <h2 className="title">Solicitudes de UPGRADES</h2>


            <div className="table request">
                <div className="header">
                    <span>Nombre</span>
                    <span>Monto</span>
                    <span>Sponsor</span>
                </div>

                {
                    data.map(itemUpgrade)
                }
            </div>

        </>
    )
}

export default UpgradeList