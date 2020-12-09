import React, { useState, useEffect } from 'react'
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'
import { Petition, readFile } from '../../utils/constanst'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import {
  identificationType,
  foundsOrigin,
  relationship,
} from '../../utils/values'

import { countries } from '../../utils/countries'
import './KYCStyles.scss'

const KYCPerson = ({ id = -1, onClickChangePage }) => {
  const [loader, setLoader] = useState(false)
  const [dataKYC, setDataKYC] = useState({})

  const { token } = useSelector(storage => storage.globalStorage)
  const credentials = {
    headers: {
      'x-auth-token': token,
    },
  }

  const USER_LIST_PAGE = 1

  // Obtiene el KYC del usuario seleccionado
  const fetchDetail = async _ => {
    try {
      setLoader(true)

      const { data } = await Petition.get(`/admin/kyc/${id}`, credentials)

      //Obtener nacionalidad y pais de residencia
      const nationality = countries.filter(
        country => country.phoneCode === data.nationality
      )

      const countryResidence = countries.filter(
        country => country.phoneCode === data.residence
      )

      //Obtener fotos
      const identificationPhoto = await readFile(
        data.identificationPictureId,
        credentials
      )
      const profilePhoto = await readFile(data.profilePictureId, credentials)

      //Actualizamos el estado
      setDataKYC({
        ...data,
        nationality: nationality[0].name,
        countryResidence: countryResidence[0].name,
        identificationPhoto: URL.createObjectURL(identificationPhoto),
        profilePhoto: URL.createObjectURL(profilePhoto),
      })

      if (data.error) {
        throw String(data.message)
      }
    } catch (error) {
      console.error(error)
      Swal.fire('Ha ocurrido un error', error.toString(), 'error')
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    if (id !== -1) fetchDetail()
  }, [id])

  if (loader) return <ActivityIndicator size={64} />

  return (
    <section className="KYCPerson">
      <div className="kyc-header">
        <div className="icon-container">
          <CloseIcon
            className="icon"
            fill="#ffffff"
            onClick={() => onClickChangePage(USER_LIST_PAGE)}
          />
        </div>

        <h2>KYC Personal</h2>
      </div>

      <h1 className="person-name">{dataKYC.fullname}</h1>
      <div className="card-container">
        <div className="card">
          <h3 className="card-title">Información personal</h3>
          <div className="card-body three-columns">
            <div className="column image-container">
              <img
                className="card-image"
                src={dataKYC.profilePhoto}
                alt="Avatar"
              />
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Correo</span>
                <p className="card-value">{dataKYC.email}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Número de teléfono </span>
                <p className="card-value">{dataKYC.alternativeNumber}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Fecha de nacimiento</span>
                <p className="card-value">{dataKYC.birthday}</p>
              </div>
            </div>

            <div className="image-container identity-container">
              <img
                className="card-image"
                src={dataKYC.identificationPhoto}
                alt="Avatar"
              />
              <div className="identity">
                <span className="card-label">
                  {dataKYC.identificationNumber}
                </span>
                <p className="card-value">
                  {identificationType[dataKYC.identificationType]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Información de control</h3>

          <div className="card-body">
            <div className="label-group">
              <span className="card-label">Origen de ingresos</span>
              <p className="card-value">{foundsOrigin[dataKYC.foundsOrigin]}</p>
            </div>
            <div className="label-group">
              <span className="card-label">Monto estimado al mes</span>
              <p className="card-value">USD$ {dataKYC.estimateMonthlyAmount}</p>
            </div>
            <div className="label-group">
              <span className="card-label">Profesión</span>
              <p className="card-value">{dataKYC.profession}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Nacionalidad y residencia</h3>

          <div className="card-body three-columns">
            <div>
              <div className="label-group">
                <span className="card-label">Nacionalidad</span>
                <p className="card-value">{dataKYC.nationality}</p>
              </div>
              <div className="label-group">
                <span className="card-label">País de residencia</span>
                <p className="card-value">{dataKYC.countryResidence}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Estado / Provincia / Región</span>
                <p className="card-value">{dataKYC.province}</p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Ciudad</span>
                <p className="card-value">{dataKYC.city}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Dirección (linea 1)</span>
                <p className="card-value">{dataKYC.direction1}</p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Código postal</span>
                <p className="card-value">{dataKYC.postalCode}</p>
              </div>

              <div className="label-group">
                <span className="card-label">Dirección (linea 2)</span>
                <p className="card-value">{dataKYC.direction2}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Beneficiario</h3>

          {!dataKYC.beneficiary && (
            <p className="card-value">Sin beneficiario</p>
          )}

          {dataKYC.beneficiary && (
            <div className="card-body">
              <div className="label-group">
                <span className="card-label">Nombre</span>
                <p className="card-value">
                  {dataKYC.beneficiary?.firstname}{' '}
                  {dataKYC?.beneficiary?.lastname}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Parentesco</span>
                <p className="card-value">
                  {relationship[dataKYC.beneficiary?.relationship]}
                </p>
              </div>
              <div className="label-group">
                <button className="button large secondary">
                  {' '}
                  Ver detalles
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default KYCPerson
