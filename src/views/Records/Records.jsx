import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Validator from "validator"

import { Petition } from "../../utils/constanst"

// Import styles and assets
import "./Records.scss"
import Astronaut from '../../static/images/astronaut.png'

// Import components
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import Modal from "../../components/Modal/Modal"
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Swal from "sweetalert2"
import moment from "moment"

const Records = () => {
    const { token } = useSelector(({ globalStorage }) => globalStorage)

    // Estado que guarda el texto para filtrar en la coleccion de solicitudes y registros
    const [filter, setFilter] = useState('')

    // Estado que guarda la coleccion para renderizar las listas de registros y solicitudes
    const [allRequest, setRequests] = useState([])
    const [allRecord, setRecords] = useState([])

    // Estado que guarda el detalle de los registros
    const [dataRequest, setDataRequest] = useState({})
    const [dataRecord, setDataRecord] = useState({})

    // Estados que manejan el renderizado de las ventanas modales
    // para ver los detalles de cada registro:
    const [showRequest, setShowRequest] = useState(false)
    const [showRecord, setShowRecord] = useState(false)

    // Estado para renderizar los preloader/loader al hacer una peticion
    const [loader, setLoader] = useState(true)
    const [loaderPetition, setLoaderPetition] = useState(false)

    // Estados para los componentes de ejecutar trading
    const [percentage, setPercentage] = useState('')
    const [cryptoCurrency, setCrypto] = useState('default')

    // Estado que guarda la configuracion diaria del trading
    const [dataTrading, setDataTrading] = useState({ crypto: [], day: 0 })

    // Ejecuta peticiones al servidor para obtener todos los datos de las tablas
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

    // Comprueba el trading del dia de hoy
    const configurateTrading = async () => {
        const _data = localStorage.getItem('@trading')

        if (_data) {
            const jsonTrading = JSON.parse(_data)

            setDataTrading(jsonTrading)

            console.log(jsonTrading)
        }
    }

    useEffect(() => {
        ConfigurateComponent()

        configurateTrading()
    }, [])

    // Componente que representa un articulo de la lista
    // de solicitudes de registro
    const itemRequest = (item, index) => {
        if (
            item.name.length > 0 && item.name.toLowerCase().search(filter) > -1 ||
            item.amount.length > 0 && item.amount.toLowerCase().search(filter) > -1 ||
            item.sponsor_email !== null && item.sponsor_email.toLowerCase().search(filter) > -1
        ) {
            return (
                <div className="row" key={index} onClick={_ => openDetailsRequest(item.id)}>
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
    }

    // Componente que representa un articulo de la lista
    // Registos
    const itemRecord = (item, index) => {

        if (
            item.name.length > 0 && item.name.toLowerCase().search(filter) > -1 ||
            item.country.length > 0 && item.country.toLowerCase().search(filter) > -1
        ) {
            return (
                <div className="row" key={index} onClick={e => openDetailsRecord(item.id_user)}>
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
    }

    // Funcion que abre detalles al hacer la peticion de
    // detalles de solitud
    const openDetailsRequest = async (id = 0) => {
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
            setShowRequest(false)
        } finally {
            setLoaderPetition(false)
        }
    }

    // Funciion que abre ventana de detalles de registros aceptados
    // Ejecuta una peticion para obtener los datos por id
    const openDetailsRecord = async (id = 0) => {
        // Open modal
        setShowRecord(true)

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
                    console.log(data)

                    if (data.error) {
                        throw data.message
                    } else {
                        setDataRecord(data)
                    }
                })
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
            setShowRecord(false)
        } finally {
            setLoaderPetition(false)
        }
    }

    // Abre modal para confirmar rechazo de solicitud de registro
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
                                icon: 'error',
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

    // Abre modal para confirmar rechazo de solicitud de registro
    const AcceptRequest = async (id = 0) => {
        setLoaderPetition(true)

        await Petition.post('/admin/request/accept', { id }, {
            headers: {
                "x-auth-token": token
            }
        }).then(({ status, data }) => {
            console.log(data)

            if (data.error) {
                Swal.fire('Se ha producido un error', data.message, 'error')
            } else {
                if (status === 200) {
                    setShowRequest(false)

                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Solicitud Aceptada',
                        showConfirmButton: false,
                        timer: 1500
                    })

                    ConfigurateComponent()
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
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

    const applyTrading = () => {
        try {
            if (!Validator.isNumeric(percentage)) {
                throw "El porcentaje del trading no es valido"
            }

            const data = {
                crypto: [cryptoCurrency],
                day: moment().get('day')
            }

            localStorage.setItem('@trading', JSON.stringify(data))

        } catch (error) {
            Swal.fire("Un momento", error, 'warning')
        }


    }

    return (
        <div className="container-records">
            <NavigationBar />

            <div className="header-content">
                <div className="row">
                    <span>Filtrar datos</span>
                    <input
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        placeholder="Escribe para buscar.."
                        type="text"
                        className="text-input" />
                </div>

                <div className="trading">
                    {
                        (percentage !== "" && (Number(percentage) > 1 || Number(percentage) < 0.5)) &&
                        <span className="message">
                            <b>Nota:</b> El porcentaje del trading es entre 0.5% a 1%
                        </span>
                    }

                    <input
                        value={percentage}
                        onChange={e => setPercentage(e.target.value)}
                        type="number"
                        placeholder="1%"
                        className="text-input" />

                    <select value={cryptoCurrency} onChange={e => setCrypto(e.target.value)} className="picker">
                        <option value="default" disabled>Selecciona una Moneda</option>

                        <optgroup label="Monedas disponibles">
                            <option value="1" disabled={dataTrading.crypto.includes('1')}>Bitcoin</option>
                            <option value="2" disabled={dataTrading.crypto.includes('2')}>Ethereum</option>
                        </optgroup>

                    </select>

                    <button className="button secondary" onClick={applyTrading}>Aplicar Trading</button>
                </div>


            </div>

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
                                    <button className="button large" onClick={_ => confirmDecline(dataRequest.id)}>
                                        Rechazar
                                </button>

                                    <button className="button large secondary" onClick={_ => AcceptRequest(dataRequest.id)}>
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
                                        <h2>Detalles</h2>
                                        <div className="row">
                                            <span className="name">Nombre</span>
                                            <span className="value">{dataRecord.name}</span>
                                        </div>

                                        <div className="row">
                                            <span className="name">Correo</span>
                                            <span className="value">{dataRecord.email}</span>
                                        </div>


                                        <div className="row">
                                            <span className="name">Pais</span>
                                            <span className="value">{dataRecord.country}</span>
                                        </div>

                                        <div className="row">
                                            <span className="name">Telefono</span>
                                            <span className="value">{dataRecord.phone}</span>
                                        </div>

                                        <div className="row color">
                                            <span className="name">Sponsor</span>
                                            {
                                                dataRecord.email_sponsor !== null &&
                                                < span className="value">{dataRecord.email_sponsor}</span>
                                            }

                                            {
                                                dataRecord.email_sponsor === null &&
                                                < span className="value">
                                                    <i>SIN SPONSOR</i>
                                                </span>
                                            }
                                        </div>

                                    </div>

                                    <div className="col">
                                        <div className="rows border-bottom">
                                            <div className="header">
                                                <span className={`status ${dataRecord.amount_btc !== null ? 'active' : 'inactive'}`}>
                                                    {dataRecord.amount_btc !== null ? 'Activo' : 'Inactivo'}
                                                </span>
                                                <h2>Plan en Bitcoin</h2>
                                            </div>

                                            <div className="row">
                                                <span className="name">Monto Actual</span>
                                                {
                                                    dataRecord.amount_btc !== null
                                                        ? <span className="value">{dataRecord.amount_btc} BTC</span>
                                                        : <span className="value"> <i>SIN MONTO</i> </span>
                                                }
                                            </div>

                                            <div className="row">
                                                <span className="name">Wallet</span>
                                                <span className="value">{dataRecord.wallet_btc}</span>
                                            </div>
                                        </div>

                                        <div className="rows border-bottom">
                                            <div className="header">
                                                <span className={`status ${dataRecord.amount_eth !== null ? 'active' : 'inactive'}`}>
                                                    {dataRecord.amount_eth !== null ? 'Activo' : 'Inactivo'}
                                                </span>
                                                <h2>Plan en Ethereum</h2>
                                            </div>

                                            <div className="row">
                                                <span className="name">Monto Actual</span>
                                                {
                                                    dataRecord.amount_eth !== null
                                                        ? <span className="value">{dataRecord.amount_eth}</span>
                                                        : <span className="value"> <i>SIN MONTO</i> </span>
                                                }
                                            </div>

                                            <div className="row">
                                                <span className="name">Wallet</span>
                                                <span className="value">{dataRecord.wallet_eth}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="buttons">
                                    <button className="button large" onClick={e => setShowRecord(false)}>
                                        cerrar
                                    </button>

                                    <button className="button large secondary">
                                        Generar Reporte
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </Modal>
            }
        </div >
    )
}

export default Records