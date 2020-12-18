import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import './DetailRecords.scss'
import UserIcon from '../UserIcon/UserIcon'

// import utils
import { Petition, copyData, Moment } from '../../utils/constanst'

// Import components
import Modal from '../../components/Modal/Modal'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'

const PERSON_TYPE = 1
const ENTERPRISE_TYPE = 2

/**
 * Visualiza el detalle de un usuario
 * @param {Number} id - id del usuario
 * @param {String} dateReport - mes en el que se generarán los reportes
 * @param {Function} showKYC - Especificar KYC  a mostrar
 */
const DetailRecords = ({ id = -1, dateReport = '', showKYC }) => {
  //Constantes para abortar las peticiones AXIOS
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const { token } = useSelector(storage => storage.globalStorage)
  const credentials = {
    headers: {
      'x-auth-token': token,
    },
  }

  const [data, setData] = useState({})
  const [loader, setLoader] = useState(false)
  const [loaderFullScreen, setLoaderFullScreen] = useState(false)

  // Obtiene el detalle de un usuario
  const fetchDetail = async _ => {
    try {
      setLoader(true)

      const { data: dataDetail } = await Petition.get(
        `/admin/records/${id}`,
        credentials,
        {
          cancelToken: source.token,
        }
      )

      if (dataDetail.error) {
        throw String(dataDetail.message)
      }

      setData(dataDetail)
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message)
      } else {
        // handle error
        console.error(error)
        Swal.fire('Ha ocurrido un error', error.toString(), 'error')
      }
    } finally {
      setLoader(false)
    }
  }

  /**
   * Cambia el estado de un usuario (activado/desactivado)
   */

  const toDisableUser = async _ => {
    try {
      setLoaderFullScreen(true)

      const user = {
        email: data.email,
        active: !data.status,
      }

      const result = await Petition.post(
        '/admin/utils/activate-account',
        user,
        credentials
      )

      if (result.error) {
        throw String(result.message)
      }

      setData({ ...data, status: !data.status })
    } catch (error) {
      console.error(error)
      Swal.fire('Ha ocurrido un error', error.toString(), 'error')
    } finally {
      setLoaderFullScreen(false)
    }
  }

  const onChangeUserStatus = () => {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'De querer cambiar el estado de este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e8b12',
      cancelButtonColor: '#c0392b',
      confirmButtonText: 'Sí, cambiar!',
    }).then(result => {
      if (result.value) {
        toDisableUser()
        Swal.fire(
          'Deshabilitado!',
          'El estado del usuario ha sido modificado',
          'success'
        )
      }
    })
  }

  useEffect(
    _ => {
      if (id !== -1) {
        fetchDetail()

        // Devolvemos una función para abortar la petición AXIOS
        return () => {
          source.cancel('Operation canceled by the user.')
        }
      }
    },
    [id]
  )

  return (
    <div className="DetailRecords">
      {loader && (
        <div className="center-element">
          <ActivityIndicator size={48} />
        </div>
      )}

      {!loader && id === -1 && (
        <div className="center-element">
          <EmptyIndicator message="Sin usuario para mostrar" />
        </div>
      )}

      {!loader && Object.keys(data).length > 0 && (
        <>
          <div className="container">
            <div className="name-container">
              <span className="name-label">{data.name}</span>

              <span className="type-user label">
                <UserIcon type={data.type_users} />
                {data.type_users === PERSON_TYPE && 'Persona'}
                {data.type_users === ENTERPRISE_TYPE && 'Empresa'}
              </span>
            </div>

            <div className="general-info">
              <div>
                <span className="label">Correo</span>
                <span className="value">{data.email}</span>
              </div>

              <div>
                <span className="label">Teléfono</span>
                <span className="value">{data.phone}</span>
              </div>

              <div>
                <span className="label">Sponsor</span>
                <span>{data.email_sponsor || 'SIN SPONSOR'}</span>
              </div>
              <div>
                <span className="label">País</span>
                <span className="value">{data.country}</span>
              </div>
            </div>

            <h3 className="caption">Tipos de planes</h3>

            <div className="plan-container">
              <div className="plan-item">
                <div className="name-and-date">
                  <h4 className="plan-title">Plan bitcoin</h4>
                  {data.date_plan_btc && (
                    <h5 className="plan-title">
                      <Moment date={data.date_plan_btc} format="DD-MM-YYYY" />
                    </h5>
                  )}
                </div>
                <hr className="divisor" />

                <div className="results">
                  <div className="result-card">
                    <span className="label">Monto Actual</span>
                    <span className="value">
                      {data.amount_btc ? (
                        data.amount_btc.toFixed(8) + 'BTC'
                      ) : (
                        <i>SIN MONTO</i>
                      )}
                    </span>
                  </div>
                  <div className="result-card">
                    <span className="label">Monto a duplicar</span>
                    <span className="value">
                      {data.amount_duplicate_btc ? (
                        data.amount_duplicate_btc.toFixed(8) + 'BTC'
                      ) : (
                        <i>SIN MONTO</i>
                      )}
                    </span>
                  </div>
                  <div className="result-card">
                    <span className="label">Porcentaje</span>
                    <span className="value">
                      {data.percentage_btc ? (
                        data.percentage_btc + '%'
                      ) : (
                        <i>SIN DATOS</i>
                      )}
                    </span>
                  </div>
                </div>

                <div className="wallet-container">
                  <div>
                    <span className="label">Retiros</span>
                    <span className="value">
                      {data.withdrawals_btc || 'SIN DATOS'}
                    </span>
                  </div>
                  <div>
                    <span className="label">Wallet</span>
                    <span
                      onClick={_ => copyData(data.wallet_btc)}
                      className="value wallet"
                    >
                      {data.wallet_btc || 'SIN WALLET'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="plan-item">
                <div className="name-and-date">
                  <h4 className="plan-title">Plan ethereum</h4>
                  {data.date_plan_eth && (
                    <h5 className="plan-title">
                      <Moment date={data.date_plan_eth} format="DD-MM-YYYY" />
                    </h5>
                  )}
                </div>
                <hr className="divisor" />

                <div className="results">
                  <div className="result-card">
                    <span className="label">Monto Actual</span>
                    <span className="value">
                      {data.amount_eth ? (
                        data.amount_eth.toFixed(8) + 'ETC'
                      ) : (
                        <i>SIN MONTO</i>
                      )}
                    </span>
                  </div>
                  <div className="result-card">
                    <span className="label">Monto a duplicar</span>
                    <span className="value">
                      {data.amount_duplicate_eth ? (
                        data.amount_duplicate_eth.toFixed(8) + 'ETC'
                      ) : (
                        <i>SIN MONTO</i>
                      )}
                    </span>
                  </div>
                  <div className="result-card">
                    <span className="label">Porcentaje</span>
                    <span className="value">
                      {data.percentage_eth ? (
                        data.percentage_eth + '%'
                      ) : (
                        <i>SIN DATOS</i>
                      )}
                    </span>
                  </div>
                </div>

                <div className="wallet-container">
                  <div>
                    <span className="label">Retiros</span>
                    <span className="value">
                      {data.withdrawals_eth || 'SIN DATOS'}
                    </span>
                  </div>
                  <div>
                    <span className="label">Wallet</span>
                    <span
                      onClick={_ => copyData(data.wallet_eth)}
                      className="value wallet"
                    >
                      {data.wallet_eth || 'SIN WALLET'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <section className="buttons-container">
              {data.type_users && (
                <button
                  type="button"
                  className="button large"
                  onClick={() => showKYC(data.type_users)}
                >
                  Ver KYC
                </button>
              )}

              <div>
                <Link
                  to={`/reports/${data.id}?date=${dateReport}`}
                  target={'_blank'}
                  className="button secondary"
                >
                  Generar reporte
                </Link>

                <button
                  className={`button ${
                    data.status ? 'desactivate-user' : 'activate-user'
                  }`}
                  type="button"
                  onClick={onChangeUserStatus}
                >
                  {data.status ? 'Deshabilitar' : 'Habilitar'}
                </button>
              </div>
            </section>
          </div>
        </>
      )}

      {loaderFullScreen && (
        <Modal persist={true} onlyChildren>
          <ActivityIndicator size={64} />
        </Modal>
      )}
    </div>
  )
}

export default DetailRecords
