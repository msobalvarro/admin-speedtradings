import React, { useState } from 'react'
import { ReactComponent as BackIcon } from '../../static/images/arrow.svg'
import { readFile, Moment } from '../../utils/constanst'
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

  const KYC_PERSON_PAGE = 2
  const TUTOR_TYPE = 1

  if (loader)
    return (
      <div className="center-element">
        <ActivityIndicator size={64} />
      </div>
    )

  if (!loader && Object.keys(dataKYC).length === 0)
    return (
      <div className="center-element">
        <EmptyIndicator message="Este usuario no cuenta con información KYC" />
      </div>
    )

  if (!loader && Object.keys(dataKYC).length > 0)
    return (
      <section className="KYCPerson">
        <div className="kyc-header">
          <div className="icon-container">
            <BackIcon
              className="icon"
              fill="#ffffff"
              onClick={() => onClickChangePage(KYC_PERSON_PAGE)}
            />
          </div>

          <h2>KYC Personal</h2>
        </div>

        <h1 className="person-name">{dataKYC?.fullname}</h1>
        <div className="card-container">
          <div className="card">
            <h3 className="card-title">Información personal</h3>
            <div className="card-body three-columns">
              <div className="column image-container">
                <img
                  className="card-image"
                  src={dataKYC?.profilePhoto}
                  alt="Avatar"
                />
              </div>

              <div>
                <div className="label-group">
                  <span className="card-label">Correo</span>
                  <p className="card-value">{dataKYC?.email}</p>
                </div>
                <div className="label-group">
                  <span className="card-label">Número de teléfono </span>
                  <p className="card-value">{dataKYC?.alternativeNumber}</p>
                </div>
                <div className="label-group">
                  <span className="card-label">Fecha de nacimiento</span>
                  <p className="card-value">
                    <Moment date={dataKYC?.birthday} format="DD-MM-YYYY" />
                  </p>
                </div>
              </div>

              <div className="identity-container">
                <div className="image-container ">
                  <img
                    className="card-image"
                    src={dataKYC?.identificationPhoto}
                    alt="Avatar"
                  />
                </div>

                <div className="identity">
                  <span className="card-label">
                    {dataKYC?.identificationNumber}
                  </span>
                  <p className="card-value">
                    {identificationType[dataKYC?.identificationType]}
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
                <p className="card-value">
                  {foundsOrigin[dataKYC?.foundsOrigin]}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Monto estimado al mes</span>
                <p className="card-value">
                  USD$ {dataKYC?.estimateMonthlyAmount}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Profesión</span>
                <p className="card-value">{dataKYC?.profession}</p>
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
                  <span className="card-label">
                    Estado / Provincia / Región
                  </span>
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
            <h3 className="card-title">
              {dataKYC?.beneficiary?.tutor === TUTOR_TYPE
                ? 'Tutor'
                : 'Beneficiario'}
            </h3>

            {!dataKYC.beneficiary && <p>Sin beneficiario</p>}

            {dataKYC.beneficiary && (
              <div className="card-body">
                <div className="label-group">
                  <span className="card-label">Nombre</span>
                  <p className="card-value">
                    {dataKYC?.beneficiary?.firstname}{' '}
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
                  <button className="button large secondary">Ver más</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
}

export default KYCPerson
