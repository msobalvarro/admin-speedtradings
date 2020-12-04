import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import './DetailRecords.scss'
import UserIcon from '../UserIcon/UserIcon'

// import utils
import { Petition, copyData } from '../../utils/constanst'

// Import components
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'

const PERSON_TYPE = 1
const ENTERPRISE_TYPE = 2
const USER_ACTIVE = 1

const DetailRecords = ({ id = -1, dateReport = '' }) => {
  const { token } = useSelector(storage => storage.globalStorage)

  const credentials = {
    headers: {
      'x-auth-token': token,
    },
  }

  const [data, setData] = useState({})
  const [loader, setLoader] = useState(false)
  const [userActive, setUserActive] = useState(false)

  const fetchDetail = async _ => {
    try {
      setLoader(true)

      const { data: dataDetail } = await Petition.get(
        `/admin/records/${id}`,
        credentials
      )

      if (dataDetail.error) {
        throw String(dataDetail.message)
      }

      setData(dataDetail)

      //Guardar el status del usuario
      dataDetail.status === USER_ACTIVE
        ? setUserActive(true)
        : setUserActive(false)
    } catch (error) {
      console.error(error)
      Swal.fire('Ha ocurrido un error', error.toString(), 'error')
    } finally {
      setLoader(false)
    }
  }

  const handleClick = () => {
    setUserActive(!userActive)
  }

  useEffect(
    _ => {
      if (id !== -1) {
        fetchDetail()
      }
    },
    [id]
  )

  //Cambiar el estado del usuario
  useEffect(() => {
    const changeStateOfUser = async () => {
      try {
        setLoader(true)

        const user = {
          email: data.email,
          active: userActive,
        }

        const result = await Petition.post(
          '/admin/utils/activate-account',
          user,
          credentials
        )

        if (result.error) {
          throw String(result.message)
        }
      } catch (error) {
        console.error(error)
        Swal.fire('Ha ocurrido un error', error.toString(), 'error')
      } finally {
        setLoader(false)
      }
    }

    changeStateOfUser()
  }, [userActive])

  return (
    <div className="DetailRecords">
      {loader && <ActivityIndicator size={48} />}

      {!loader && id === -1 && (
        <EmptyIndicator message="Sin usuario para mostrar" />
      )}

      {!loader && Object.keys(data).length > 0 && (
        <>
          <div className="container">
            <div className="name-container">
              <span className="name-label">{data.name}</span>

              <span className="type-user label">
                <UserIcon type={PERSON_TYPE} />
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
                <span className="label">Telefono</span>
                <span className="value">{data.phone}</span>
              </div>

              <div>
                <span className="label">Sponsor</span>
                <span>{data.email_sponsor || 'SIN SPONSOR'}</span>
              </div>
              <div>
                <span className="label">Pais</span>
                <span className="value">{data.country}</span>
              </div>
            </div>

            <h3 className="caption">Tipos de planes</h3>

            <div className="plan-container">
              <div className="plan-item">
                <h4 className="plan-title">Plan bitcoin</h4>
                <hr className="divisor" />

                <div className="wallet-container">
                  <div>
                    <span className="label">Wallet</span>
                    <span
                      onClick={_ => copyData(data.wallet_btc)}
                      className="value wallet"
                    >
                      {data.wallet_btc || 'SIN WALLET'}
                    </span>
                  </div>

                  <div className="amount-card">
                    <span className="label">Monto Actual</span>
                    <span className="value">
                      {data.amount_btc ? (
                        data.amount_btc + 'BTC'
                      ) : (
                        <i>SIN MONTO</i>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="plan-item">
                <h4 className="plan-title">Plan bitcoin</h4>
                <hr className="divisor" />

                <div className="wallet-container">
                  <div>
                    <span className="label">Wallet</span>
                    <span
                      onClick={_ => copyData(data.wallet_eth)}
                      className="value wallet"
                    >
                      {data.wallet_eth || 'SIN WALLET'}
                    </span>
                  </div>

                  <div className="amount-card">
                    <span className="label">Monto Actual</span>
                    <span className="value">
                      {data.amount_eth ? (
                        data.amount_eth + 'ETH'
                      ) : (
                        <i>SIN MONTO</i>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <section className="buttons-container">
              <Link
                to={`/reports/${data.id}?date=${dateReport}`}
                target={'_blank'}
                className="btn btn-primary"
              >
                Generar reporte
              </Link>

              <button
                className={`btn ${
                  userActive ? 'desactivate-user' : 'activate-user'
                }`}
                type="button"
                onClick={() => handleClick(data.status)}
              >
                {userActive ? 'Deshabilitar' : 'Habilitar'}
              </button>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

export default DetailRecords
