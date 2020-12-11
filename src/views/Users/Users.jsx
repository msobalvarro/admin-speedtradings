import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import moment from 'moment'
import './Users.scss'

// Import components
import RecordsList from '../../components/RecordsList/RecordsList'
import DetailRecords from '../../components/DetailRecords/DetailRecords'
import KYCPerson from '../../views/KYCPerson/KYCPerson'
import KYCBeneficiary from '../../views/KYCBeneficiary/KYCBeneficiary'
import KYCEnterprise from '../../views/KYCEnterprise/KYCEnterprise'

// Import constants
import { Petition } from '../../utils/constanst'

const Users = () => {
  const { token } = useSelector(storage => storage.globalStorage)
  const credentials = {
    headers: {
      'x-auth-token': token,
    },
  }

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

      const { data } = await Petition.get('/admin/records/', credentials)

      if (data.error) {
        throw String(data.message)
      }

      setAllUsers(data)
    } catch (error) {
      console.error(error)
      Swal.fire('Ha ocurrido un error', error.toString(), 'error')
    } finally {
      setLoader(false)
    }
  }

  useEffect(_ => {
    fetchData()
  }, [])

  /**
   * Función que realiza las validaciones para mostrar pagina correspondiente(Lista de usuarios/ KYC persona / KYC empresa)
   * @param {Number} pageIndex - Número de la pagina a verificar
   */

  const checkActivePage = pageIndex => {
    switch (pageIndex) {
      // Verificaciones para la pagina de LISTA DE USUARIOS
      case USER_LIST_PAGE:
        return !loader && page === USER_LIST_PAGE

      // Verificaciones para la pagina de KYC PERSON
      case KYC_PERSON_PAGE:
        return !loader && page === KYC_PERSON_PAGE

      // Verificaciones para la pagina de BENEFICIARIO del usuario tipo persona
      case BENEFICIARY_PERSON_PAGE:
        return !loader && page === BENEFICIARY_PERSON_PAGE

      // Verificaciones para la pagina de KYC EMPRESAS
      case KYC_ENTERPRISE_PAGE:
        return !loader && page === KYC_ENTERPRISE_PAGE

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
                    setDateReport(value)
                    window.sessionStorage.setItem('date_report', value)
                  }
                }}
              />
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
    </div>
  )
}

export default Users
