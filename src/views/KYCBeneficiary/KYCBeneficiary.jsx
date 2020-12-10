import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
//Import icons
import { ReactComponent as BackIcon } from '../../static/images/arrow.svg'
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'
import DefaultPhoto from '../../static/images/placeholder-profile.jpg'

//Import utils
import { readFile, Moment } from '../../utils/constanst'
import { countries } from '../../utils/countries'

import {
  identificationType,
  foundsOrigin,
  relationship,
} from '../../utils/values'

//Import components
import Modal from '../../components/Modal/Modal'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'

//Import styles
import '../KYCPerson/KYCStyles.scss'

const KYCBeneficiary = ({ data, onClickChangePage }) => {
  const [loader, setLoader] = useState(true)
  const { token } = useSelector(storage => storage.globalStorage)
  const credentials = {
    headers: {
      'x-auth-token': token,
    },
  }

  const KYC_PERSON_PAGE = 2
  const [showModal, setShowModal] = useState({
    visible: false,
    image: '',
    title: '',
  })

  const [beneficiary, setBeneficiary] = useState({})

  const fetchDetail = async () => {
    //Obtener nombre de la nacionalidad
    const nationality = countries.filter(
      country => country.phoneCode === data.nationality
    )
    //Obtener nombre del pais de residencia
    const countryResidence = countries.filter(
      country => country.phoneCode === data.residence
    )

    //Obtener fotos
    const identificationPhoto = await readFile(
      data.indentificationPictureId,
      credentials
    )

    const profilePhoto = await readFile(data.profilePictureId, credentials)

    setBeneficiary({
      ...data,
      nationality: nationality[0]?.name,
      countryResidence: countryResidence[0]?.name,
      identificationPhoto: data.indentificationPictureId
        ? URL.createObjectURL(identificationPhoto)
        : DefaultPhoto,
      profilePhoto: data.profilePictureId
        ? URL.createObjectURL(profilePhoto)
        : DefaultPhoto,
    })

    setLoader(false)
  }

  useEffect(
    _ => {
      if (data) fetchDetail()
    },
    [data]
  )

  if (Object.keys(data).length === 0)
    return (
      <div className="center-element">
        <EmptyIndicator message="Este usuario no cuenta con un beneficiario" />
        <button
          className="button large mt"
          onClick={() => onClickChangePage(KYC_PERSON_PAGE)}
        >
          Regresar
        </button>
      </div>
    )

  return (
    <section className="KYCPerson">
      {loader && (
        <div className="center-element">
          <ActivityIndicator size={100} />
        </div>
      )}
      <div className="kyc-header">
        <div className="icon-container">
          <BackIcon
            className="icon"
            fill="#ffffff"
            onClick={() => onClickChangePage(KYC_PERSON_PAGE)}
          />
        </div>

        <h2>Información del beneficiario</h2>
      </div>

      <h1 className="person-name">
        {beneficiary?.firstname} {beneficiary?.lastname}
      </h1>
      <div className="card-container">
        <div className="card">
          <h3 className="card-title">Información personal</h3>
          <div className="card-body three-columns">
            <div className="column image-container">
              {beneficiary.profilePictureId && (
                <img
                  className="card-image"
                  src={beneficiary.profilePhoto}
                  alt="Avatar"
                  onClick={() =>
                    setShowModal({
                      visible: true,
                      image: beneficiary.profilePhoto,
                      title: beneficiary.fullname,
                    })
                  }
                />
              )}
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Correo</span>
                <p className="card-value">{beneficiary?.email}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Número de teléfono </span>
                <p className="card-value">{beneficiary?.principalNumber}</p>
              </div>

              <div className="label-group">
                <span className="card-label">Teléfono alternativo</span>
                <p className="card-value">{beneficiary?.alternativeNumber}</p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Parentesco</span>
                <p className="card-value">
                  {relationship[beneficiary?.relationship]}
                </p>
              </div>

              <div className="label-group">
                <span className="card-label">Fecha de nacimiento</span>
                <p className="card-value">
                  <Moment date={beneficiary?.birthday} format="DD-MM-YYYY" />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Identificación personal</h3>
          <div className="card-body">
            <div className="identity-container">
              <div className="image-container ">
                {beneficiary.indentificationPictureId && (
                  <img
                    onClick={() =>
                      setShowModal({
                        visible: true,
                        image: beneficiary.identificationPhoto,
                        title: beneficiary.identificationNumber,
                      })
                    }
                    className="card-image"
                    src={beneficiary.identificationPhoto}
                    alt="Avatar"
                  />
                )}
              </div>

              <div className="identity">
                <span className="card-label">
                  {beneficiary?.identificationNumber}
                </span>
                <p className="card-value">
                  {identificationType[beneficiary?.identificationType]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Nacionalidad y residencia</h3>

          <div className="card-body three-columns">
            <div>
              <div className="label-group">
                <span className="card-label">Nacionalidad</span>
                <p className="card-value">{beneficiary.nationality}</p>
              </div>
              <div className="label-group">
                <span className="card-label">País de residencia</span>
                <p className="card-value">{beneficiary.countryResidence}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Estado / Provincia / Región</span>
                <p className="card-value">{beneficiary.province}</p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Ciudad</span>
                <p className="card-value">{beneficiary.city}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Dirección (linea 1)</span>
                <p className="card-value">{beneficiary.direction1}</p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Código postal</span>
                <p className="card-value">{beneficiary.postalCode}</p>
              </div>

              <div className="label-group">
                <span className="card-label">Dirección (linea 2)</span>
                <p className="card-value">{beneficiary.direction2}</p>
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
                {foundsOrigin[beneficiary?.foundsOrigin]}
              </p>
            </div>
            <div className="label-group">
              <span className="card-label">Monto estimado al mes</span>
              <p className="card-value">
                USD$ {beneficiary?.estimateMonthlyAmount}
              </p>
            </div>
            <div className="label-group">
              <span className="card-label">Profesión</span>
              <p className="card-value">{beneficiary?.profession}</p>
            </div>
          </div>
        </div>
      </div>

      {showModal.visible && (
        <Modal persist={true} onlyChildren>
          <div className="overlay">
            <div className="modal-container">
              <div className="button-container">
                <CloseIcon
                  className="icon"
                  fill="#ffffff"
                  onClick={() => setShowModal({ ...showModal, visible: false })}
                />
              </div>

              <img
                className="modal-image"
                src={showModal.image}
                alt="Foto de perfil"
              />
              <p className="modal-title">{showModal.title}</p>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}

export default KYCBeneficiary
