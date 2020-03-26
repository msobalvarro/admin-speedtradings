import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { Petition } from "../../utils/constanst"

// Import styles and assets
import "./Records.scss"

// Import components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Swal from "sweetalert2"
import moment from "moment"


const Records = () => {
    const { token } = useSelector(({ globalStorage }) => globalStorage)

    const [allRequest, setRequests] = useState([])
    const [allRecord, setRecords] = useState([])

    const [loader, setLoader] = useState(true)

    const ConfigurateComponent = async () => {

        try {
            await Petition.get('/admin/request/', {
                headers: {
                    "x-auth-token": token
                }
            }).then(({ data }) => {
                if (data.error) {
                    throw data.message
                } else {
                    setRequests(data)
                }
            })


            await Petition.get('/admin/records/', {
                headers: {
                    "x-auth-token": token
                }
            }).then(({ data }) => {
                if (data.error) {
                    throw data.message
                } else {
                    console.log(data)
                    setRecords(data)
                }
            })

        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }

    }

    useEffect(() => {
        ConfigurateComponent()
    }, [])

    const itemRequest = (item, index) => {
        return (
            <div className="row" key={index}>
                <span className="name">{item.name}</span>
                <span>{item.amount} {item.id_currency === 1 && 'BTC'} {item.id_currency === 2 && 'ETH'}</span>
                <span>
                    {
                        item.sponsor_email !== null
                            ? item.sponsor_email
                            : <i>Sin sponsor</i>
                    }
                </span>
            </div>
        )
    }

    const itemRecord = (item, index) => {
        return (
            <div className="row" key={index}>
                <span>{moment(item.start_date).format('MMM. D, YYYY')}</span>
                <span className="name">{item.name}</span>
                <span>{item.country}</span>
                <span>
                    {
                        item.sponsor_email !== null
                            ? item.sponsor_email
                            : <i>Sin sponsor</i>
                    }
                </span>
            </div>
        )
    }


    return (
        <div className="container-records">
            <NavigationBar />
            <div className="content">
                <div className="collection">
                    <h2 className="title">Solicitudes de registros</h2>

                    <div className="table request">
                        <div className="header">
                            <span>Nombre</span>
                            <span>Monto</span>
                            <span>Sponsor</span>
                        </div>

                        {
                            allRequest.map(itemRequest)
                        }
                    </div>
                </div>

                <div className="collection">
                    <h2 className="title">Registros</h2>

                    <div className="table records">
                        <div className="header">
                            <span>Fecha</span>
                            <span>Nombre</span>
                            <span>Pais</span>
                            <span>Sponsor</span>
                        </div>

                        {
                            allRecord.map(itemRecord)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Records