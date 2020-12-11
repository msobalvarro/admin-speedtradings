import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

//Import icons
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'

//Import components
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'
import CollapsibleTable from '../../components/CollapsibleTable/CollapsibleTable'

//Import utils
import { Petition, readFile, Moment, getCountry } from '../../utils/constanst'

import { commercialCategories } from '../../utils/values'

//Import styles
import '../KYCPerson/KYCStyles.scss'

const KYCEnterprise = ({ id = -1, onClickChangePage }) => {
  const [loader, setLoader] = useState(false)
  const [dataKYC, setDataKYC] = useState({})
  const [objectPdf, setObjectPdf] = useState('')

  const showPdf = async _ => {
    try {
      const data = await readFile(944, credentials)
      setObjectPdf(URL.createObjectURL(data))
    } catch (error) {
      console.error(error)
    }
  }

  const { token } = useSelector(storage => storage.globalStorage)
  const credentials = {
    headers: {
      'x-auth-token': token,
    },
  }

  const USER_LIST_PAGE = 1

  // Obtiene el KYC de la empresa seleccionada
  const fetchDetail = async _ => {
    try {
      setLoader(true)

      const { data } = await Petition.get(`/admin/kyc/${id}`, credentials)

      if (data.error) {
        throw String(data.message)
      }

      setDataKYC(data)
      console.log(data)
      showPdf()
    } catch (error) {
      console.error(error)
      Swal.fire('Ha ocurrido un error', error.toString(), 'error')
    } finally {
      setLoader(false)
    }
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
          <h1 className="commerce-name">{dataKYC?.commerceName}</h1>
          <h2 className="commerce-type">
            {commercialCategories[dataKYC?.commerceType]}
          </h2>
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
                <p className="card-value">
                  {dataKYC?.commerceIdentificationNumber}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Fecha de incorporación</span>
                <p className="card-value">
                  <Moment
                    date={dataKYC?.incorporationDate}
                    format="DD-MM-YYYY"
                  />
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Sitio web</span>
                <p className="card-value">{dataKYC?.website}</p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Correo</span>
                <p className="card-value">{dataKYC?.email}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Numero de telefono</span>
                <p className="card-value">{dataKYC?.commerceTelephone}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Descripción fuente de fondos</span>
                <p className="card-value">{dataKYC?.note}</p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Documentos</span>
                <p className="card-link">Identificación del negocio</p>
                <p className="card-link">Certificado / incorporación</p>
                <p className="card-link">Lista de directores y accionistas</p>
                <p className="card-link">Directores autorizados a firmar</p>
                <p className="card-link">Certificado legal</p>
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
                <span className="card-label">
                  {dataKYC?.legalRepresentative?.fullname}
                </span>
                <p className="card-value">
                  {dataKYC?.legalRepresentative?.chargeTitle}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Identificación</span>
                <p className="card-value">
                  {dataKYC?.legalRepresentative?.identificationNumber}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Identificación tributaria</span>
                <p className="card-value">
                  {dataKYC?.legalRepresentative?.identificationTaxNumber}
                </p>
              </div>

              <div className="label-group">
                <span className="card-label">Pasaporte</span>
                <p className="card-value">
                  {dataKYC?.legalRepresentative?.passportNumber}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Correo</span>
                <p className="card-value">
                  {dataKYC?.legalRepresentative?.email}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Teléfono</span>
                <p className="card-value">
                  {dataKYC?.legalRepresentative?.telephoneNumber}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Pais de origen</span>
                <p className="card-value">
                  {getCountry(dataKYC?.legalRepresentative?.originCountry)}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Pais de emisión pasaporte</span>
                <p className="card-value">
                  {getCountry(
                    dataKYC?.legalRepresentative?.passportEmissionCountry
                  )}
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

                <button className="button secondary">Ver identificacion</button>
                <button className="button secondary">Ver pasaporte</button>
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
                <p className="card-value">
                  {getCountry(dataKYC?.permanentCountry)}
                </p>
              </div>
              <div className="label-group">
                <span className="card-label">Estado / Provincia / Región</span>
                <p className="card-value">{dataKYC?.permanentProvince}</p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Ciudad</span>
                <p className="card-value">{dataKYC?.city}</p>
              </div>
              <div className="label-group">
                <span className="card-label">Dirección (linea 1)</span>
                <p className="card-value">{dataKYC?.directionOne}</p>
              </div>
            </div>

            <div>
              <div className="label-group">
                <span className="card-label">Codigo postal</span>
                <p className="card-value">{dataKYC?.postalCode}</p>
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
          {dataKYC.beneficiaries && (
            <CollapsibleTable beneficiaries={dataKYC.beneficiaries} />
          )}
        </div>
      </article>

      <object data={objectPdf} type="application/pdf" alt="">
        <embed src={objectPdf} type="application/pdf" />
      </object>
    </section>
  )
}

export default KYCEnterprise
