import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { Petition } from "../../utils/constanst"

// Import styles and assets
import "./Records.scss"
import Astronaut from '../../static/images/astronaut.png'

// Import components
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import Modal from "../../components/Modal/Modal"
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Swal from "sweetalert2/src/sweetalert2.js"
import moment from "moment"

const Records = () => {
    const { token } = useSelector(({ globalStorage }) => globalStorage)

    const [allRequest, setRequests] = useState([])
    const [allRecord, setRecords] = useState([])

    const [dataRequest, setDataRequest] = useState({})
    const [dataRecord, setDataRecord] = useState({})

    const [showRequest, setShowRequest] = useState(false)
    const [showRecord, setShowRecord] = useState(false)

    const [loader, setLoader] = useState(true)
    const [loaderPetition, setLoaderPetition] = useState(false)

    const ConfigurateComponent = async () => {
        setLoader(true)
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
            <div className="row" key={index} onClick={e => openDetailsRequest(item.id)}>
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

    const openDetailsRequest = async (id = 0) => {
        console.log(id)

        // Open modal
        setShowRequest(true)

        try {
            // Show loader
            setLoaderPetition(true)

            // get data for petition
            await Petition.post('/admin/request/id', { id }, {
                headers: {
                    "x-auth-token": token
                }
            })
                .then(({ data }) => {
                    console.log(data)

                    if (data.error) {
                        throw data.message
                    } else {
                        // console.log(data)
                        setDataRequest(data)
                    }
                })
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoaderPetition(false)
        }
    }

    const openDetailsRecord = async (id = 0) => {
        // Open modal
        setShowRequest(true)

        try {
            // Show loader
            setLoaderPetition(true)

            // get data for petition
            await Petition.post('/admin/records/id', { id }, {
                headers: {
                    "x-auth-token": token
                }
            })
                .then(({ data }) => {
                    if (data.error) {
                        throw data.message
                    } else {
                        setDataRecord(data)
                    }
                })
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoaderPetition(false)
        }
    }

    const confirmDecline = (id = 0) => {
        Swal.fire({
            title: 'Rechazar',
            text: "¿Esta seguro que quiere ejecutar esta Accion? No se podra revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, Rechazar!'
        }).then(async (result) => {
            if (result.value) {
                setLoaderPetition(true)

                await Petition.delete('/admin/request/decline', {
                    data: { id },
                    headers: {
                        "x-auth-token": token
                    }
                }).then(({ status, data }) => {
                    if (data.error) {
                        Swal.fire('Se ha producido un error', data.message, 'error')
                    } else {
                        if (status === 200) {
                            setShowRequest(false)

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'Solicitud Rechazada',
                                showConfirmButton: false,
                                timer: 1500
                            })

                            ConfigurateComponent()
                        } else {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'Se ha producido un error',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }

                }).catch(reason => {
                    Swal.fire('Se ha producido un error', reason.toString(), 'error')
                })


                setLoaderPetition(false)
            }
        })
    }

    return (
        <div className="container-records">
            <NavigationBar />
            <div className="content">
                <div className={`collection${allRequest.length === 0 ? ' empty' : ''}`}>
                    {
                        loader &&
                        <ActivityIndicator size={64} />
                    }

                    {
                        (allRequest.length === 0 && !loader) &&
                        <>
                            <img src={Astronaut} alt="empty" />
                            <h2 className="title">No hay Solicitudes</h2>
                        </>
                    }

                    {
                        allRequest.length > 0 &&
                        <>
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
                        </>
                    }
                </div>

                <div className={`collection${allRecord.length === 0 ? ' empty' : ''}`}>
                    {
                        loader &&
                        <ActivityIndicator size={64} />
                    }

                    {
                        (allRecord.length === 0 && !loader) &&
                        <>
                            <img src={Astronaut} alt="empty" />
                            <h2 className="title">No hay Registros</h2>
                        </>
                    }

                    {
                        allRecord.length > 0 &&
                        <>
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
                        </>
                    }

                </div>
            </div>

            {
                showRequest &&
                <Modal onClose={e => setShowRequest(false)}>
                    <div className="content-modal request">
                        {
                            loaderPetition &&
                            <ActivityIndicator size={48} />
                        }
                        {
                            !loaderPetition &&
                            <>
                                <div className="content-col">
                                    <div className="col">
                                        <h2>Detalles de solicitud</h2>

                                        <div className="row">
                                            <span className="name">Nombre</span>
                                            <span className="value">{dataRequest.name}</span>
                                        </div>

                                        <div className="row">
                                            <span className="name">Correo</span>
                                            <span className="value">{dataRequest.email}</span>
                                        </div>

                                        <div className="row">
                                            <span className="name">Hash de transaccion</span>
                                            <span className="value">{dataRequest.hash}</span>
                                        </div>

                                        <div className="row">
                                            <span className="name">Monto</span>
                                            <span className="value">
                                                {dataRequest.amount} {dataRequest.id_currency === 1 && 'BTC'} {dataRequest.id_currency === 2 && 'ETH'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`col${dataRequest.sponsor_username === null ? ' empty' : ''}`}>
                                        {
                                            dataRequest.sponsor_username === null &&
                                            <>
                                                <h2>
                                                    Sin Sponsor
                                            </h2>
                                            </>
                                        }

                                        {
                                            dataRequest.sponsor_username !== null &&
                                            <>
                                                <h2>Sponsor</h2>

                                                <div className="row">
                                                    <span className="name">Nombre</span>
                                                    <span className="value">{dataRequest.sponsor_name}</span>
                                                </div>

                                                <div className="row">
                                                    <span className="name">Correo Electronico</span>
                                                    <span className="value">{dataRequest.sponsor_email}</span>
                                                </div>

                                                <div className="row">
                                                    <span className="name">Correo Electronico</span>
                                                    <span className="value">{dataRequest.sponsor_email}</span>
                                                </div>

                                                <div className="row">
                                                    <span className="name">
                                                        Wallet en {dataRequest.id_currency === 1 && 'BTC'} {dataRequest.id_currency === 2 && 'ETH'}
                                                    </span>

                                                    <span className="value">
                                                        {dataRequest.id_currency === 1 && dataRequest.sponsor_wallet_btc}
                                                        {dataRequest.id_currency === 2 && dataRequest.sponsor_wallet_eth}
                                                    </span>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>


                                <div className="buttons">
                                    <button className="button large" onClick={e => confirmDecline(dataRequest.id)}>
                                        Rechazar
                                </button>

                                    <button className="button large secondary">
                                        Aprobar
                                </button>
                                </div>
                            </>
                        }

                    </div>
                </Modal>
            }

            {
                showRecord &&
                <Modal onClose={e => setShowRecord(false)}>
                    {
                        loaderPetition &&
                        <ActivityIndicator size={48} />
                    }
                    <h2>Detalles</h2>
                </Modal>
            }
        </div>
    )
}

export default Records