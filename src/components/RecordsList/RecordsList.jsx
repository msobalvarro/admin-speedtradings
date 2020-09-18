import React from "react"
import moment from "moment"

// Import components
import ActivityIndicator from "../ActivityIndicator/Activityindicator"

const RecordsList = ({ data=[], filter='', onChangeFilter=_=>{}, onDetail=_=>{}, loader=false }) => {
    // Componente que representa un articulo de la lista
    // Registos
    const itemRecord = (item, index) => {
        if (
            item.name.length > 0 && item.name.toLowerCase().search(filter) > -1 ||
            item.country.length > 0 && item.country.toLowerCase().search(filter) > -1
        ) {
            return (
                <div className="row" key={index} onClick={_ => onDetail(item.id_user)}>
                    <span>{moment(item.start_date).format('MMM. D, YYYY')}</span>
                    <span className="name">{item.name}</span>
                    <span>{item.country}</span>
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
    }

    // Componente contenedor de la lista
    return (
        <>
            {
                loader &&
                <ActivityIndicator size={48} />
            }

            {
                !loader &&
                <>
                    <div className="sub-header">
                        <h2 className="title">Registros</h2>

                        <input
                            value={filter}
                            onChange={e => onChangeFilter(e.target.value)}
                            placeholder="Escribe para buscar.."
                            type="text"
                            className="text-input" />
                    </div>

                    <div className="table records">
                        <div className="header">
                            <span>Fecha</span>
                            <span>Nombre</span>
                            <span>Pais</span>
                            <span>Sponsor</span>
                        </div>

                        {
                            data
                                .sort((a, b) => 
                                    (new Date(b.start_date) - new Date(a.start_date)))
                                .map(itemRecord)
                        }
                    </div>
                </>
            }
        </>
    )
}

export default RecordsList