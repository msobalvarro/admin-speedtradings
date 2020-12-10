import React, { useState } from 'react'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'
// Import constant
import { Moment } from '../../utils/constanst'
import UserIcon from '../UserIcon/UserIcon'
const PERSON_TYPE = 1
const ENTERPRISE_TYPE = 2

const RecordsList = ({
  data = [],
  loader,
  activeDetail = -1,
  onDetail = _ => {},
}) => {
  const [filter, setFilter] = useState('')

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
            {item.type_users && <UserIcon type={item.type_users} />}
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

  if (loader)
    return (
      <div className="center-element">
        <ActivityIndicator size={64} />
      </div>
    )

  if (!loader && data.length === 0)
    return (
      <div className="center-element">
        <EmptyIndicator message="Sin usuarios para mostrar" />
      </div>
    )

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
      <div className="caption-container">
        <span>
          <UserIcon type={PERSON_TYPE} />
          Personal
        </span>
        <div className="separator"></div>
        <span>
          <UserIcon type={ENTERPRISE_TYPE} />
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
