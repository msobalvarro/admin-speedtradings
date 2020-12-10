import React, { useState, useEffect } from 'react'
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'
import { Petition, readFile, Moment } from '../../utils/constanst'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'
import DefaultPhoto from '../../static/images/placeholder-profile.jpg'
import Modal from '../../components/Modal/Modal'

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
  const [showModal, setShowModal] = useState({
    visible: false,
    image: '',
    title: '',
  })

  const { token } = useSelector(storage => storage.globalStorage)
  const credentials = {
    headers: {
      'x-auth-token': token,
    },
  }

  const USER_LIST_PAGE = 1
  const BENEFICIARY_PERSON_PAGE = 3

  const TUTOR_TYPE = 1

  // Obtiene el KYC del usuario seleccionado
  const fetchDetail = async _ => {
    try {
      setLoader(true)

      const { data } = await Petition.get(`/admin/kyc/${id}`, credentials)

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
        data.identificationPictureId,
        credentials
      )
      const profilePhoto = await readFile(data.profilePictureId, credentials)

      // SI el usuario tiene KYC actualizamos el estado
      if (Object.keys(data).length > 0) {
        setDataKYC({
          ...data,
          nationality: nationality[0]?.name,
          countryResidence: countryResidence[0]?.name,
          identificationPhoto: data.identificationPictureId
            ? URL.createObjectURL(identificationPhoto)
            : DefaultPhoto,
          profilePhoto: data.profilePictureId
            ? URL.createObjectURL(profilePhoto)
            : DefaultPhoto,
        })
      } else {
        // El usuario no tiene KYC
        console.error(
          `El usuario con ID: ${id}, no tiene KYC, pero si tiene la propiedad TYPE_USERS`
        )
        setDataKYC({})
      }

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

  const handleClickShowBeneficiary = () => {
    //Navegar a la pagina de beneficiario
    onClickChangePage(BENEFICIARY_PERSON_PAGE, dataKYC.beneficiary)
  }

  useEffect(
    _ => {
      if (id !== -1) fetchDetail()
    },
    [id]
  )

  if (!loader && Object.keys(dataKYC).length === 0)
    return (
      <div className="center-element">
        <EmptyIndicator message="Este usuario no cuenta con información KYC" />
        <button
          className="button large mt"
          onClick={() => onClickChangePage(USER_LIST_PAGE)}
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
        <h2>KYC Personal</h2>

        <div className="icon-container">
          <CloseIcon
            className="icon"
            fill="#ffffff"
            onClick={() => onClickChangePage(USER_LIST_PAGE)}
          />
        </div>
      </div>

      <h1 className="person-name">{dataKYC?.fullname}</h1>
      <div className="card-container">
        <div className="card">
          <h3 className="card-title">Información personal</h3>
          <div className="card-body three-columns">
            <div className="column image-container">
              {dataKYC.identificationPictureId && (
                <img
                  className="card-image"
                  src={dataKYC.profilePhoto}
                  alt="Avatar"
                  onClick={() =>
                    setShowModal({
                      visible: true,
                      image: dataKYC.profilePhoto,
                      title: dataKYC.fullname,
                    })
                  }
                />
              )}
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
                {dataKYC.identificationPictureId && (
                  <img
                    onClick={() =>
                      setShowModal({
                        visible: true,
                        image: dataKYC.identificationPhoto,
                        title: dataKYC.identificationNumber,
                      })
                    }
                    className="card-image"
                    src={dataKYC.identificationPhoto}
                    alt="Avatar"
                  />
                )}
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
          <h3 className="card-title">
            {dataKYC?.beneficiary?.tutor === TUTOR_TYPE
              ? 'Tutor'
              : 'Beneficiario'}
          </h3>

          {!dataKYC.beneficiary && (
            <div className="empty-beneficiary">
              <p>Sin beneficiario</p>
            </div>
          )}

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
                <button
                  className="button large secondary"
                  onClick={handleClickShowBeneficiary}
                >
                  Ver más
                </button>
              </div>
            </div>
          )}
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

export default KYCPerson
