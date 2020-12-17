import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
//Import icons
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'

//Import components
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'
import CollapsibleTable from '../../components/CollapsibleTable/CollapsibleTable'
import ModalPhoto from '../../components/ModalPhoto/ModalPhoto'
import ModalPDF from '../../components/ModalPDF/ModalPDF'
import ModalForm from '../../components/ModalForm/ModalForm'
import Chip from '../../components/Chip/Chip'

//Import utils
import { Petition, readFile, Moment, getCountry } from '../../utils/constanst'

import { commercialCategories } from '../../utils/values'
import { useSesionStorage } from '../../utils/hooks/useSesionStorage'

//Import styles
import '../KYCPerson/KYCStyles.scss'

const KYCEnterprise = ({ id = -1, onClickChangePage }) => {
  const KEY = `kyc-enterprise-${id}`
  const USER_LIST_PAGE = 1
  const [loader, setLoader] = useState(false)
  const [dataKYC, setDataKYC] = useSesionStorage(KEY, {})
  const [showModalDeleteKYC, setShowModalDeleteKYC] = useState(false)

  //Declarar estados para el modal de foto y pdf
  const [showPDFModal, setShowPDFModal] = useState({
    visible: false,
    pdf: '',
  })
  const [showPhotoModal, setShowPhotoModal] = useState({
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

  /**
   * Recibe un id y hace una busqueda en el servidor para obtener fotos o documentos pdf
   * y posteriormente mostrarlos en un modal
   * @param {Number} id
   * @param {String} title
   * @param {Boolean} pdf
   */
  const getFile = async ({ id = -1, title = '', pdf = false }) => {
    if (!id) return false

    try {
      setLoader(true)
      //Obtener datos
      const data = await readFile(id, credentials)

      //En el caso que sea pdf mostrar el pdf
      if (pdf)
        return setShowPDFModal({
          visible: true,
          pdf: URL.createObjectURL(data),
        })

      //En el caso de que sea una imagen
      setShowPhotoModal({
        visible: true,
        image: URL.createObjectURL(data),
        title: title,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoader(false)
    }
  }

  // Obtiene el KYC de la empresa seleccionada
  const fetchDetail = async _ => {
    try {
      setLoader(true)

      const { data } = await Petition.get(`/admin/kyc/${id}`, credentials)

      console.log(data)

      // SI la empresa tiene KYC actualizamos el estado
      if (Object.keys(data).length > 0) {
        setDataKYC({
          ...data,
          commercialCategory: commercialCategories[data?.commerceType],
          representativeOriginCountry: getCountry(
            data?.legalRepresentative?.originCountry
          ),
          representativePassportEmission: getCountry(
            data?.legalRepresentative?.passportEmissionCountry
          ),

          permanentCountryName: getCountry(data?.permanentCountry),
        })
      } else {
        // LA EMPRESA no tiene KYC
        console.error(
          `La empresa con ID: ${id}, no tiene KYC, pero si tiene la propiedad TYPE_USERS`
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
        'KYC Eliminado',
        `El KYC de: ${dataKYC.fullname}, ha sido eliminado.`,
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

  useEffect(
    _ => {
      if (id !== -1) {
        //Si este KYC es visto por primera vez hara la petición, en el caso de que encuentre datos en el local storage simplemente los mostrara
        Object.keys(dataKYC).length === 0 && fetchDetail()
      }
    },
    [id]
  )

  if (!loader && !Object.keys(dataKYC).length === 0)
    return (
      <div className="center-element">
        <EmptyIndicator message="Esta empresa no cuenta con información KYC" />
        <button
          className="button large mt"
          onClick={() => onClickChangePage(USER_LIST_PAGE)}
        >
          Regresar
        </button>
      </div>
    )

  return (
    <section className="KYCEnterprise">
      {loader && (
        <div className="center-element">
          <ActivityIndicator size={100} />
        </div>
      )}
      <header className="kyc-header">
        <h2>KYC Empresarial</h2>

        <div className="icon-container">
          <CloseIcon
            className="icon"
            fill="#ffffff"
            onClick={() => onClickChangePage(USER_LIST_PAGE)}
          />
        </div>
      </header>

      <main className="transactions-and-name">
        <div>
          <h1 className="commerce-name">
            {dataKYC?.commerceName || 'Nombre del comercio'}
          </h1>
          <h2 className="commerce-type">
            {dataKYC?.commercialCategory || 'Categoria del comercio'}
          </h2>
        </div>
        <div className="actions-buttons">
          {!dataKYC.reviewed && (
            <button className="button verify-button" onClick={confirmAction}>
              Marcar como verificado
            </button>
          )}

          <button
            className="button delete-button "
            onClick={() => setShowModalDeleteKYC(true)}
          >
            Eliminar KYC
          </button>
        </div>

        <div>
          <h4 className="transactions-title">Transacciones mensuales</h4>
          <div className="results-container">
            <div className="result-card">
              <span className="dimention">Cantidad</span>
              <p className="metric">{dataKYC.commerceEstimateTransactions}</p>
            </div>
            <div className="result-card">
              <span className="dimention">Valor total</span>
              <p className="metric">
                USD$ {dataKYC.commerceEstimateTransactionsAmount}
              </p>
            </div>
          </div>
        </div>
      </main>
      <div className="card-container">
        {/********SECCION INFORMACION EMPRESARIAL********/}
        <article className="card">
          <h3 className="card-title">Información empresarial</h3>
          <div className="card-body three-columns">
            <div>
              <div className="label-group">
                <span className="card-label">Numero de identificación</span>
                <div className="card-value">
                  {dataKYC?.commerceIdentificationNumber || <Chip />}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Fecha de incorporación</span>
                <div className="card-value">
                  <Moment
                    date={dataKYC?.incorporationDate || <Chip />}
                    format="DD-MM-YYYY"
                  />
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Sitio web</span>
                <p className="card-value">
                  {dataKYC?.website || 'Sin website'}
                </p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Correo</span>
                <div className="card-value">{dataKYC?.email || <Chip />}</div>
              </div>
              <div className="label-group">
                <span className="card-label">Numero de telefono</span>
                <div className="card-value">
                  {dataKYC?.commerceTelephone || <Chip />}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Descripción fuente de fondos</span>
                <div className="card-value">{dataKYC?.note || <Chip />}</div>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Documentos</span>

                {dataKYC.commerceIdentificationPicture ? (
                  <p
                    className="card-link"
                    onClick={() =>
                      getFile({
                        id: dataKYC.commerceIdentificationPicture,
                        title: dataKYC?.commerceIdentificationNumber,
                      })
                    }
                  >
                    Identificación del negocio
                  </p>
                ) : (
                  <Chip text="Negocio sin identificación" />
                )}

                {dataKYC.commerceCertificate ? (
                  <p
                    className="card-link"
                    onClick={() =>
                      getFile({ id: dataKYC.commerceCertificate, pdf: true })
                    }
                  >
                    Certificado / incorporación
                  </p>
                ) : (
                  <Chip text="Negocio sin Certificado" />
                )}

                {dataKYC.commerceDirectors ? (
                  <p
                    className="card-link"
                    onClick={() =>
                      getFile({ id: dataKYC.commerceDirectors, pdf: true })
                    }
                  >
                    Lista de directores y accionistas
                  </p>
                ) : (
                  <Chip text="Negocio sin directores ni accionistas" />
                )}

                {dataKYC.commerceDirectorsInfo ? (
                  <p
                    className="card-link"
                    onClick={() =>
                      getFile({ id: dataKYC.commerceDirectorsInfo, pdf: true })
                    }
                  >
                    Directores autorizados a firmar
                  </p>
                ) : (
                  <Chip text="Negocio sin directores autorizados a firmar" />
                )}

                {dataKYC.commerceLegalCertificate ? (
                  <p
                    className="card-link"
                    onClick={() =>
                      getFile({
                        id: dataKYC.commerceLegalCertificate,
                        pdf: true,
                      })
                    }
                  >
                    Certificado legal
                  </p>
                ) : (
                  <Chip text="Negocio sin Certificado legal" />
                )}
              </div>
            </div>
          </div>
        </article>

        {/*******SECCION REPRESENTANTE LEGAL*******/}
        <article className="card two-rows">
          <h3 className="card-title">Representante legal</h3>
          <div className="card-body">
            <div>
              <div className="label-group">
                <span className="card-label">Nombre</span>
                <div className="card-value">
                  {dataKYC?.legalRepresentative?.fullname || <Chip />}
                </div>
              </div>

              <div className="label-group">
                <span className="card-label">Cargo</span>
                <div className="card-value">
                  {dataKYC?.legalRepresentative?.chargeTitle || <Chip />}
                </div>
              </div>

              <div className="label-group">
                <span className="card-label">Identificación</span>
                <div className="card-value">
                  {dataKYC?.legalRepresentative?.identificationNumber || (
                    <Chip />
                  )}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Identificación tributaria</span>
                <div className="card-value">
                  {dataKYC?.legalRepresentative?.identificationTaxNumber}
                </div>
              </div>

              <div className="label-group">
                <span className="card-label">Pasaporte</span>
                <div className="card-value">
                  {dataKYC?.legalRepresentative?.passportNumber}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Correo</span>
                <div className="card-value">
                  {dataKYC?.legalRepresentative?.email || <Chip />}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Teléfono</span>
                <div className="card-value">
                  {dataKYC?.legalRepresentative?.telephoneNumber || <Chip />}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Pais de origen</span>
                <div className="card-value">
                  {dataKYC?.representativeOriginCountry || <Chip />}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Pais de emisión pasaporte</span>
                <p className="card-value">
                  {dataKYC?.representativePassportEmission}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Dirección</span>
                <p className="card-value">
                  {dataKYC?.legalRepresentative?.direction}
                </p>
              </div>
              <div className="button-identifications">
                <span className="value">Identificaciones</span>
                {dataKYC?.legalRepresentative?.identificationPicture && (
                  <button
                    className="button secondary"
                    onClick={() =>
                      getFile({
                        id: dataKYC?.legalRepresentative?.identificationPicture,
                        title:
                          dataKYC?.legalRepresentative?.identificationNumber,
                      })
                    }
                  >
                    Ver identificacion
                  </button>
                )}
                {dataKYC?.legalRepresentative?.passportPicture && (
                  <button
                    className="button secondary"
                    onClick={() =>
                      getFile({
                        id: dataKYC?.legalRepresentative?.passportPicture,
                        title: dataKYC?.legalRepresentative?.passportNumber,
                      })
                    }
                  >
                    Ver pasaporte
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>

        {/*******SECCION REGION DE ACTIVIDAD COMERCIAL*******/}
        <article className="card">
          <h3 className="card-title">Región de actividad comercial</h3>
          <div className="card-body three-columns">
            <div>
              <div className="label-group">
                <span className="card-label">Pais</span>
                <div className="card-value">
                  {dataKYC?.permanentCountryName || <Chip />}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Estado / Provincia / Región</span>
                <div className="card-value">
                  {dataKYC?.permanentProvince || <Chip />}
                </div>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Ciudad</span>
                <div className="card-value">{dataKYC?.city || <Chip />}</div>
              </div>
              <div className="label-group">
                <span className="card-label">Dirección (linea 1)</span>
                <div className="card-value">
                  {dataKYC?.directionOne || <Chip />}
                </div>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Codigo postal</span>
                <div className="card-value">
                  {dataKYC?.postalCode || <Chip />}
                </div>
              </div>
              <div className="label-group">
                <span className="card-label">Dirección (linea 2)</span>
                <p className="card-value">{dataKYC?.directionTwo}</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/*******LISTA DE BENEFICIARIOS*******/}
      <article className="card beneficiaries-table">
        <h3 className="card-title">
          Propietarios beneficiarios y agentes de control
        </h3>
        <div className="card-body">
          {dataKYC.beneficiaries ? (
            <CollapsibleTable
              beneficiaries={dataKYC.beneficiaries}
              showPhoto={getFile}
            />
          ) : (
            <Chip text="Sin beneficiarios" />
          )}
        </div>
      </article>

      {showPDFModal.visible && (
        <ModalPDF
          pdf={showPDFModal.pdf}
          onClose={() => setShowPDFModal({ ...showPDFModal, visible: false })}
        />
      )}

      {showPhotoModal.visible && (
        <ModalPhoto
          image={showPhotoModal.image}
          title={showPhotoModal.title}
          onClose={() =>
            setShowPhotoModal({ ...showPhotoModal, visible: false })
          }
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

export default KYCEnterprise
