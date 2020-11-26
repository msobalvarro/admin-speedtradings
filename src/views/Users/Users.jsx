import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
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
            'x-auth-token': token
        }
    }

    const [allUsers, setAllUsers] = useState([])
    const [activeDetail, setActiveDetail] = useState(-1)
    const [loader, setLoader] = useState(false)

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
            <div className="content">
                <div className="content-list">
                    {
                        loader &&
                        <ActivityIndicator size={64} />
                    }

                    {
                        !loader && allUsers.length === 0 &&
                        <EmptyIndicator message='Sin usuarios para mostrar' />
                    }

                    {
                        !loader && allUsers.length > 0 &&
                        <RecordsList
                            data={allUsers}
                            activeDetail={activeDetail}
                            onDetail={_id => setActiveDetail(_id)} />
                    }
                </div>

                <div className="content-detail">
                    <DetailRecords id={activeDetail} />
                </div>
            </div>
        </div>
    )
}

export default Users