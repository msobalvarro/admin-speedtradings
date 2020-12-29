import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import moment from 'moment'
import axios from 'axios'

import './Users.scss'

// Import components
import ConfirmPassword from '../../components/ConfirmPassword/ConfirmPassword'
import RecordsList from '../../components/RecordsList/RecordsList'
import DetailRecords from '../../components/DetailRecords/DetailRecords'
import KYCPerson from '../../views/KYCPerson/KYCPerson'
import KYCBeneficiary from '../../views/KYCBeneficiary/KYCBeneficiary'
import KYCEnterprise from '../../views/KYCEnterprise/KYCEnterprise'

// Import constants
import { Petition } from '../../utils/constanst'

const Users = () => {
  //Constantes para abortar las peticiones AXIOS
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  // Estado que almacena la lista de los usuarios
  const [allUsers, setAllUsers] = useState([])
  // Estado que almacena el id del usuario a mostrar en detalle
  const [activeDetail, setActiveDetail] = useState(-1)
  // Estado que almacena la fecha con la que generarán los reportes
  const [dateReport, setDateReport] = useState(
    window.sessionStorage.getItem('date_report') ||
    moment(new Date()).format('YYYY-MM')
  )
  // Estado que almacena el status del indicador de carga
  const [loader, setLoader] = useState(false)
  // Estado que indica sí se visualiza o no el modal de confirmar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const USER_LIST_PAGE = 1
  const KYC_PERSON_PAGE = 2
  const BENEFICIARY_PERSON_PAGE = 3
  const KYC_ENTERPRISE_PAGE = 4

  // Estado para controlar la pestaña activa
  const [page, setPage] = useState(USER_LIST_PAGE)

  // Estado para guardar la informacion que se comparte entre paginas
  const [sharedInformation, setSharedInformation] = useState({})

  // Se obtiene la lista de los usuarios
  const fetchData = async _ => {
    try {
      setLoader(true)

      const { data } = await Petition.get('/admin/records/', {
        cancelToken: source.token,
      })

      if (data.error) {
        throw String(data.message)
      }

      setAllUsers(data)
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
   * Invoca el controlador para enviar a los usuarios los reportes 
   * @param {String} password - contraseña root admin 
   */
  const sendReportsUser = async password => {
    try {
      const dataSend = {
        password,
        date: dateReport
      }

      const { data } = await Petition.post('/admin/reports-users/delivery', dataSend)

      if (data.error) {
        throw String(data.message)
      }

      Swal.fire(
        'Envío de reportes procesado',
        'Todos los reportes de estado de cuenta fueron envíados',
        'success'
      )
    } catch (error) {
      console.error(error)
      Swal.fire('Ha ocurrido un error', error.toString(), 'error')
    } finally {
      setShowConfirmPassword(false)
    }
  }

  useEffect(_ => {
    fetchData()

    // Devolvemos una función para abortar la petición AXIOS
    return () => {
      source.cancel('Operation canceled by the user.')
    }
  }, [])

  /**
   * Función que realiza las validaciones para mostrar pagina correspondiente(Lista de usuarios/ KYC persona / KYC empresa)
   * @param {Number} pageIndex - Número de la pagina a verificar
   */

  const checkActivePage = pageIndex => {
    switch (pageIndex) {
      // Verificaciones para la pagina de LISTA DE USUARIOS
      case USER_LIST_PAGE:
        return page === USER_LIST_PAGE

      // Verificaciones para la pagina de KYC PERSON
      case KYC_PERSON_PAGE:
        return page === KYC_PERSON_PAGE

      // Verificaciones para la pagina de BENEFICIARIO del usuario tipo persona
      case BENEFICIARY_PERSON_PAGE:
        return page === BENEFICIARY_PERSON_PAGE

      // Verificaciones para la pagina de KYC EMPRESAS
      case KYC_ENTERPRISE_PAGE:
        return page === KYC_ENTERPRISE_PAGE

      default:
        return false
    }
  }

  /**
   * Función que cambia el estado para cambiar de pagina
   * @param {Number} pageNumber - Número de la pagina a la que se movera
   * @param {Object} data - Datos que se comparten de la pagina anterior a la pagina nueva
   */

  const onClickChangePage = (pageNumber, data) => {
    //Guardar datos que recibe de la pagina anterior
    setSharedInformation(data)

    //Cambiar de pagina
    setPage(pageNumber)
  }

  const showKYC = typeUser => {
    const PERSON_TYPE = 1
    const ENTERPRISE_TYPE = 2

    //El usuario es de tipo persona, mostrar el KYC PERSONAL
    typeUser === PERSON_TYPE && setPage(KYC_PERSON_PAGE)
    //El usuario es de tipo empresarial, mostrar el KYC EMPRESARIAL
    typeUser === ENTERPRISE_TYPE && setPage(KYC_ENTERPRISE_PAGE)
  }

  return (
    <div className="Users">
      {checkActivePage(USER_LIST_PAGE) && (
        <section className="users-list">
          <header className="header">
            <div className="row">
              <span className="label">Fecha Reporte</span>
              <input
                type="month"
                className="text-input"
                value={dateReport}
                onChange={e => {
                  const { value } = e.target

                  if (value) {
                    const _reportDate = moment(value).format('YYYY-MM-DD')

                    setDateReport(_reportDate)
                    window.sessionStorage.setItem('date_report', value)
                  }
                }}
              />

              <button
                onClick={_ => setShowConfirmPassword(true)}
                style={{ marginLeft: '1rem', height: '2.35rem' }}
                className='button'>
                Enviar estados de cuenta
              </button>
            </div>
          </header>

          <div className="content">
            <div className="content-list">
              <RecordsList
                loader={loader}
                data={allUsers}
                activeDetail={activeDetail}
                onDetail={_id => setActiveDetail(_id)}
              />
            </div>

            <div className="content-detail">
              <DetailRecords
                id={activeDetail}
                dateReport={dateReport}
                showKYC={showKYC}
              />
            </div>
          </div>
        </section>
      )}
      {checkActivePage(KYC_PERSON_PAGE) && (
        <KYCPerson id={activeDetail} onClickChangePage={onClickChangePage} />
      )}

      {checkActivePage(BENEFICIARY_PERSON_PAGE) && (
        <KYCBeneficiary
          data={sharedInformation}
          onClickChangePage={onClickChangePage}
        />
      )}

      {checkActivePage(KYC_ENTERPRISE_PAGE) && (
        <KYCEnterprise
          id={activeDetail}
          onClickChangePage={onClickChangePage}
        />
      )}

      {
        showConfirmPassword &&
        <ConfirmPassword
          onSubmit={_password => sendReportsUser(_password)}
          onCancel={_ => setShowConfirmPassword(false)} />
      }
    </div>
  )
}

export default Users
