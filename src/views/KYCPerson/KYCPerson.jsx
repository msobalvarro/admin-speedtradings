import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

//Import icons
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'
import DefaultPhoto from '../../static/images/placeholder-profile.jpg'

//Import components
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'
import ModalPhoto from '../../components/ModalPhoto/ModalPhoto'
import Chip from '../../components/Chip/Chip'
import ModalForm from '../../components/ModalForm/ModalForm'

//Import utils
import { Petition, readFile, Moment, getCountry } from '../../utils/constanst'
import {
  identificationType,
  foundsOrigin,
  relationship,
} from '../../utils/values'

import { useSesionStorage } from '../../utils/hooks/useSesionStorage'

//Import styles
import './KYCStyles.scss'

const KYCPerson = ({ id = -1, onClickChangePage }) => {
  const KEY = `kyc-person-${id}`
  const [loader, setLoader] = useState(false)
  const [dataKYC, setDataKYC] = useSesionStorage(KEY, {})
  const [showModalDeleteKYC, setShowModalDeleteKYC] = useState(false)

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
  const fetchDetail = async () => {
    try {
      setLoader(true)

      const { data } = await Petition.get(`/admin/kyc/${id}`, credentials)
      console.log(data)

      if (Object.keys(data).length > 0) {
        //Obtener fotos
        const identificationPhoto = await readFile(
          data.identificationPictureId,
          credentials
        )
        const profilePhoto = await readFile(data.profilePictureId, credentials)

        setDataKYC({
          ...data,
          nationality: getCountry(data.nationality),
          countryResidence: getCountry(data.residence),
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

  //Funcion para marcar como verificado un kyc de usuario
  const verifyKYC = async _ => {
    try {
      setLoader(true)

      const { data } = await Petition.get(
        `/admin/kyc/${id}/verify`,
        credentials
      )

      setDataKYC({
        ...dataKYC,
        reviewed: true,
      })

      Swal.fire(
        'Verificación completa!',
        `El KYC del usuario: ${dataKYC.fullname}, ha sido verificado.`,
        'success'
      )

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

  //Funcion para eliminar un kyc del usuario
  const deleteKYC = async (password, reason) => {
    try {
      setLoader(true)

      const params = {
        password: password,
        reason: reason,
        fullname: dataKYC.fullname,
        email: dataKYC.email,
      }

      const { data } = await Petition.post(
        `/admin/kyc/${id}/disable`,
        params,
        credentials
      )

      if (data.error) {
        throw String(data.message)
      }

      Swal.fire(
        'KYC deshabilitado',
        `El KYC de: ${dataKYC.fullname}, ha sido deshabilitado.`,
        'success'
      )
      //Cerrar modal
      setShowModalDeleteKYC(false)

      //Ir a la lista de usuarios
      onClickChangePage(USER_LIST_PAGE)
    } catch (error) {
      console.error(error)
      Swal.fire('Ha ocurrido un error', error.toString(), 'error')
    } finally {
      setLoader(false)
    }
  }

  const confirmAction = ({ description = '¡No podrás revertir esto!' }) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: description,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e8b12',
      cancelButtonColor: '#c0392b',
      confirmButtonText: 'Sí, verificar!',
    }).then(result => {
      if (result.value) {
        verifyKYC()
      }
    })
  }

  const handleClickShowBeneficiary = _ => {
    //Navegar a la pagina de beneficiario y pasarla la informacion correspondiente
    onClickChangePage(BENEFICIARY_PERSON_PAGE, dataKYC.beneficiary)
  }

  useEffect(
    _ => {
      if (id !== -1) {
        //Si este KYC es visto por primera vez hara la petición, en el caso de que encuentre datos en el local storage simplemente los mostrara
        Object.keys(dataKYC).length === 0 && fetchDetail()
      }
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

      <div className="title-and-actions">
        <h1 className="person-name">
          {dataKYC?.fullname || 'Nombre de la persona'}
        </h1>
        {!dataKYC.reviewed && (
          <button className="button verify-button" onClick={confirmAction}>
            Marcar como verificado
          </button>
        )}

        <button
          className="button delete-button"
          onClick={() => setShowModalDeleteKYC(true)}
        >
          Eliminar KYC
        </button>
      </div>

      <div className="card-container">
        <div className="card">
          <h3 className="card-title">Información personal</h3>
          <div className="card-body three-columns">
            <div className="column image-container">
              {dataKYC.profilePictureId && (
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
                <div className="card-value">{dataKYC?.email || <Chip />}</div>
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
              <div className="label-group">
                <span className="card-label">Estado</span>
                <p className="card-value">
                  {dataKYC.reviewed < 1 ? 'Sin verificar' : 'Verificado'}
                </p>
              </div>
            </div>

            <div className="identity-container">
              <div className="image-container">
                {dataKYC.identificationPhoto && (
                  <img
                    className="card-image"
                    src={dataKYC.identificationPhoto}
                    alt="Identificación"
                    onClick={() =>
                      setShowModal({
                        visible: true,
                        image: dataKYC.identificationPhoto,
                        title: dataKYC.identificationNumber,
                      })
                    }
                  />
                )}
              </div>

              <div className="identity">
                <span className="card-label">
                  {dataKYC?.identificationNumber ? (
                    dataKYC?.identificationNumber
                  ) : (
                    <Chip text="Sin identificación" />
                  )}
                </span>
                <p className="card-value">
                  {identificationType[dataKYC?.identificationType] ||
                    'Tipo de identificación'}
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
              <div className="card-value">
                {foundsOrigin[dataKYC?.foundsOrigin] || <Chip />}
              </div>
            </div>
            <div className="label-group">
              <span className="card-label">Monto estimado al mes</span>
              <p className="card-value">
                USD$ {dataKYC?.estimateMonthlyAmount}
              </p>
            </div>
            <div className="label-group">
              <span className="card-label">Profesión</span>
              <div className="card-value">
                {dataKYC?.profession || <Chip />}
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
                <div className="card-value">
                  {dataKYC.nationality || <Chip />}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">País de residencia</span>
                <div className="card-value">
                  {dataKYC.countryResidence || <Chip />}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Estado / Provincia / Región</span>
                <div className="card-value">{dataKYC.province || <Chip />}</div>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Ciudad</span>
                <div className="card-value">{dataKYC.city || <Chip />}</div>
              </div>
              <div className="label-group">
                <span className="card-label">Dirección (linea 1)</span>
                <div className="card-value">
                  {dataKYC.direction1 || <Chip />}
                </div>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Código postal</span>
                <div className="card-value">
                  {dataKYC.postalCode || <Chip />}
                </div>
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
                  onClick={() =>
                    handleClickShowBeneficiary(dataKYC?.beneficiary)
                  }
                >
                  Ver más
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal.visible && (
        <ModalPhoto
          image={showModal.image}
          title={showModal.title}
          onClose={() => setShowModal({ ...showModal, visible: false })}
        />
      )}

      {showModalDeleteKYC && (
        <ModalForm
          onClose={() => setShowModalDeleteKYC(false)}
          deleteKYC={deleteKYC}
        />
      )}
    </section>
  )
}

export default KYCPerson