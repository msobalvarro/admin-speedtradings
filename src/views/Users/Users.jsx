import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import moment from 'moment'
import './Users.scss'

// Import components
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'
import RecordsList from '../../components/RecordsList/RecordsList'
import DetailRecords from '../../components/DetailRecords/DetailRecords'

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

  return (
    <div className="Users">
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
          {loader && <ActivityIndicator size={64} />}

          {!loader && allUsers.length === 0 && (
            <EmptyIndicator message="Sin usuarios para mostrar" />
          )}

          {!loader && allUsers.length > 0 && (
            <RecordsList
              data={allUsers}
              activeDetail={activeDetail}
              onDetail={_id => setActiveDetail(_id)}
            />
          )}
        </div>

        <div className="content-detail">
          <DetailRecords id={activeDetail} dateReport={dateReport} />
        </div>
      </div>
    </div>
  )
}

export default Users
