import React, { useState } from 'react'
// Import icons
import { ReactComponent as PersonIcon } from '../../static/images/user.svg'
import { ReactComponent as EnterpriseIcon } from '../../static/images/enterprise.svg'

// Import constant
import { Moment } from '../../utils/constanst'

const RecordsList = ({ data = [], activeDetail = -1, onDetail = _ => {} }) => {
  const [filter, setFilter] = useState('')
  const PERSON_TYPE = 1

  //validar el tipo de usuario
  const showTypeIcon = type => {
    if (!type) return ''

    return type === PERSON_TYPE ? (
      <PersonIcon className="icon" fill="#ffcb08" />
    ) : (
      <EnterpriseIcon className="icon" fill="#ffcb08" />
    )
  }

  // Componente que representa un articulo de la lista
  // Registos
  const itemRecord = (item, index) => {
    if (
      (item.name.length > 0 && item.name.toLowerCase().search(filter) > -1) ||
      (item.country.length > 0 &&
        item.country.toLowerCase().search(filter) > -1)
    ) {
      return (
        <div
          className={`row ${activeDetail === item.id_user ? 'active' : ''}`}
          key={index}
          onClick={_ => onDetail(item.id_user)}
        >
          <span className="icon-container">
            {item.type_users && showTypeIcon(item.type_users)}
          </span>
          <span className="name">{item.name}</span>
          <span>{item.country}</span>
          <span>
            <Moment date={item.start_date} format="YYYY-MM" />
          </span>
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
          className="text-input"
        />
      </div>
      <div className="leyenda-container">
        <span>
          <PersonIcon className="icon" fill="#ffcb08" /> Personal
        </span>
        <div className="separator"></div>
        <span>
          <EnterpriseIcon className="icon" fill="#ffcb08" />
          Empresarial
        </span>
      </div>

      <div className="table records">
        <div className="header">
          <span>Tipo</span>
          <span>Nombre</span>
          <span>Pais</span>
          <span>Fecha</span>
        </div>

        {data
          .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
          .map(itemRecord)}
      </div>
    </>
  )
}

export default RecordsList
