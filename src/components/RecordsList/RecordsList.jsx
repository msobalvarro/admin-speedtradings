import React, { useState, useMemo } from 'react'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'

// Import constant
import { Moment } from '../../utils/constanst'
import UserIcon from '../UserIcon/UserIcon'

import { ReactComponent as ReviewedIcon } from '../../static/images/checked.svg'

//constantes para los filtros
const EMPTY_KYC = 0
const PERSON_TYPE = 1
const ENTERPRISE_TYPE = 2
const ANY_TYPE_OF_USER = 3

const USERS_VERIFIED_AND_NOT_VERIFIED = 2

const RecordsList = ({
  data = [],
  loader,
  activeDetail = -1,
  onDetail = _ => { },
}) => {
  const [keyword, setKeyword] = useState('')
  const [kycVerified, setKycVerified] = useState(
    USERS_VERIFIED_AND_NOT_VERIFIED
  )
  const [typeUsers, setTypeUsers] = useState(ANY_TYPE_OF_USER)

  const parseBoolean = value => Boolean(Number(value))

  const searchByKeyword = _data => {
    if (keyword.length === 0) {
      return _data
    }

    return _data.filter(
      user =>
        user.name.toLowerCase().includes(keyword.toLowerCase()) ||
        user.user_email.toLowerCase().includes(keyword.toLocaleLowerCase()) ||
        user.country.toLowerCase().includes(keyword.toLocaleLowerCase())
    )
  }

  const searchByUserType = _data => {
    //Selecciono la opcion de todos
    if (Number(typeUsers) === ANY_TYPE_OF_USER) return _data

    //Selecciono la opcion de sin KYC
    if (Number(typeUsers) === EMPTY_KYC)
      return _data.filter(user => parseBoolean(user.type_users) === false)

    //Busqueda por tipo (Persona/ Empresa)
    return _data.filter(user => Number(user.type_users) === Number(typeUsers))
  }

  const filteredUsers = useMemo(() => {
    const dataTypeUserSeleted = searchByUserType(data)

    const dataVerifyUserStatus =
      Number(kycVerified) === USERS_VERIFIED_AND_NOT_VERIFIED
        ? dataTypeUserSeleted
        : dataTypeUserSeleted.filter(
            user => parseBoolean(user.reviewed) === parseBoolean(kycVerified)
          )

    return searchByKeyword(dataVerifyUserStatus)
  }, [data, keyword, typeUsers, kycVerified])

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

  return (
    <>
      <div className="sub-header">
        <div className="title-and-caption">
          <h2 className="title">Lista de usuarios</h2>

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
        </div>

        <div className="filters-container">
          <h4 className="filter-title">Filtrar por</h4>
          <div className="filters">
            <div className="form-group">
              <label className="filter-label" htmlFor="typeUsers">
                Tipo de usuario
              </label>
              <select
                id="typeUsers"
                value={typeUsers}
                onChange={e => setTypeUsers(e.target.value)}
                className="text-input"
              >
                <option value={ANY_TYPE_OF_USER}>Todos</option>
                <option value={PERSON_TYPE}>Tipo persona</option>
                <option value={ENTERPRISE_TYPE}>Tipo empresa</option>
                <option value={EMPTY_KYC}>Sin KYC</option>
              </select>
            </div>

            <div className="form-group">
              <label className="filter-label" htmlFor="kycVerified">
                Estado
              </label>
              <select
                id="kycVerified"
                value={kycVerified}
                onChange={e => setKycVerified(e.target.value)}
                className="text-input"
              >
                <option value={2}>Todos</option>
                <option value={0}>Pendiente</option>
                <option value={1}>Verificado</option>
              </select>
            </div>

            <div className="form-group">
              <label className="filter-label" htmlFor="keyword">
                Palabra clave
              </label>

              <input
                id="keyword"
                className="form-group"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Escribe para buscar.."
                type="text"
                className="text-input"
              />
            </div>
          </div>
        </div>
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
              <span>
                {Boolean(Number(item.reviewed)) ? (
                  <div className="reviewed-container">
                    <ReviewedIcon fill="#2e8b12" className="icon" />
                    <span>Verificado</span>
                  </div>
                ) : (
                  'Pendiente'
                )}
              </span>
              <span className="country">{item.country}</span>
              <span>
                <Moment date={item.start_date} format="DD-MM-YYYY" />
              </span>
            </div>
          ))}
      </div>
    </>
  )
}

export default RecordsList
