import React, { useState, useMemo } from 'react'
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
  onDetail = _ => { },
}) => {
  const [keyword, setKeyword] = useState('')

  const filteredUsers = useMemo(
    () =>
      data.filter(user => {
        return (
          user.name.toLowerCase().includes(keyword.toLocaleLowerCase()) ||
          user.user_email.toLowerCase().includes(keyword.toLocaleLowerCase()) ||
          user.country.toLowerCase().includes(keyword.toLocaleLowerCase())
        )
      }),
    [data, keyword]
  )

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
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
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
          <span>Estado</span>
          <span>Pais</span>
          <span>Fecha</span>
        </div>

        {filteredUsers
          .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
          .map((item, index) => (
            <div
              className={`row ${activeDetail === item.id_user ? 'active' : ''}`}
              key={index}
              onClick={_ => onDetail(item.id_user)}
            >
              <span className="icon-container">
                {item.type_users && <UserIcon type={item.type_users} />}
              </span>
              <span className="name">{item.name}</span>
              <span>{item.reviewed < 1 ? 'Sin verificar' : 'Verificado'}</span>
              <span>{item.country}</span>
              <span>
                <Moment date={item.start_date} format="YYYY-MM" />
              </span>
            </div>
          ))}
      </div>
    </>
  )
}

export default RecordsList
