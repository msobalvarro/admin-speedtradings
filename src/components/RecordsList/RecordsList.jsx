import React, { useState } from "react"

// Import constant
import { Moment } from '../../utils/constanst'

const RecordsList = ({ data = [], activeDetail = -1, onDetail = _ => { } }) => {
    const [filter, setFilter] = useState('')

    // Componente que representa un articulo de la lista
    // Registos
    const itemRecord = (item, index) => {
        if (
            item.name.length > 0 && item.name.toLowerCase().search(filter) > -1 ||
            item.country.length > 0 && item.country.toLowerCase().search(filter) > -1
        ) {
            return (
                <div
                    className={`row ${activeDetail === item.id_user ? 'active' : ''}`}
                    key={index}
                    onClick={_ => onDetail(item.id_user)}>
                    <span className="name">{item.name}</span>
                    <span>{item.country}</span>
                    <span>
                        {
                            item.sponsor_email !== null
                                ? item.sponsor_email
                                : <i>Sin sponsor</i>
                        }
                    </span>
                    <span><Moment date={item.start_date} /></span>
                </div>
            )
        }
    }

    // Componente contenedor de la lista
    return (
        <>
            <div className="sub-header">
                <h2 className="title">Lista de usuarios</h2>

                <input
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    placeholder="Escribe para buscar.."
                    type="text"
                    className="text-input" />
            </div>

            <div className="table records">
                <div className="header">
                    <span>Nombre</span>
                    <span>Pais</span>
                    <span>Sponsor</span>
                    <span>Fecha</span>
                </div>

                {
                    data
                        .sort((a, b) =>
                            (new Date(b.start_date) - new Date(a.start_date)))
                        .map(itemRecord)
                }
            </div>
        </>
    )
}

export default RecordsList