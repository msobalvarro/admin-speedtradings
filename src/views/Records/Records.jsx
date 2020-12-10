import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import './Records.scss'

// Import utils
import {
    Petition,
    keySecret,
    setTittleDOM,
    downloadReport,
    dispatchNotification
} from "../../utils/constanst"

// Import middlewares and validators
import jwt from "jwt-simple"
import moment from "moment"
import Validator from "validator"

// Import styles and assets
import "./Records.scss"

// Import components
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import EmptyIndicator from "../../components/EmptyIndicator/EmptyIndicator"
import ConfirmPassword from "../../components/ConfirmPassword/ConfirmPassword"
import Modal from '../../components/Modal/Modal'

import MoneyChangerList from "../../components/MoneyChangerList/MoneyChangerList"
import ExchangeList from "../../components/ExchangeList/ExchangeList"
import UpgradeList from "../../components/UpgradeList/UpgradeList"
import RequestList from "../../components/RequestList/RequestList"

import DetailRequest from "../../components/DetailRequest/DetailRequest"
import DetailUpgrade from "../../components/DetailUpgrade/DetailUpgrade"
import DetailExchangeRequest from "../../components/DetailExchangeRequest/DetailExhangeRequest"
import DetailMoneyChanger from "../../components/DetailMoneyChanger/DetailMoneyChanger"


const Records = () => {
    const { token, socketEvents } = useSelector((storage) => storage.globalStorage)
    const header = {
        headers: {
            "x-auth-token": token
        }
    }

    const socket = useSelector(storage => storage.socket)

    /**
     * Constantes para configurar el endpoint y el nombre del archivo a generar según la 
     * pestaña que esté activa
     */
    const ReportsSource = [
        { url: '/admin/reports/upgrades', filename: 'upgradesReport' },
        { url: '/admin/reports/upgrades', filename: 'exchangeReport' },
        { url: '/admin/reports/upgrades', filename: 'moneyChangerReport' },
    ]

    // Estado para controlar la pestaña activa
    const [tab, setTab] = useState(1)

    // Estado que guarda la coleccion para renderizar las listas de registros y solicitudes
    const [allUpgrades, setUpgrades] = useState([])
    const [allRequest, setRequests] = useState([])
    const [allExchange, setExchange] = useState([])
    const [allMoneyChanger, setMoneyChanger] = useState([])

    const [detailRequest, setDetailRequest] = useState(-1)
    const [detailUpgrade, setDetailUpgrade] = useState(-1)
    const [detailExchange, setDetailExchange] = useState({})
    const [detailMoneyChanger, setDetailMoneyChanger] = useState({})

    const [removeRequest, setRemoveRequest] = useState(-1)
    const [removeUpgrade, setRemoveUpgrade] = useState(-1)
    const [removeExchange, setRemoveExchange] = useState(-1)
    const [removeMoneyChanger, setRemoveMoneyChanger] = useState(-1)

    // Estados para los componentes de ejecutar trading
    const [percentage, setPercentage] = useState('')
    const [cryptoCurrency, setCrypto] = useState('default')
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    // Estado que guarda la configuracion diaria del trading
    const [dataTrading, setDataTrading] = useState({ crypto: [], day: 0 })

    // Estado para controlar la visibilidad del indicador de carga
    const [loaderDataList, setLoaderDataList] = useState(false)

    // Estado para almacenar las fechas de inicio/fin con las cual se generará el reporte
    const [reportFromDate, setReportFromDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [reportToDate, setReportToDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [loaderReportDownload, setLoaderReportDownload] = useState(false)

    const badget = (_count) => (_count > 0) ? { "data-counter": _count } : {}

    /**
     * Función que realiza las validaciones para determinar si se muestra o no
     * el listado de solicitudes según la pestaña activa
     * @param {Number} tabIndex - Número de la pestaña a verificar 
     */
    const checkActiveTab = (tabIndex) => {
        switch (tabIndex) {
            // Verificaciones para la pestaña de registros
            case 1:
                return (allRequest.length > 0 && !loaderDataList && tab === 1)

            // Verificaciones para la pestaña de upgrades
            case 2:
                return (allUpgrades.length > 0 && !loaderDataList && tab === 2)

            // Verificaciones para la pestaña de Exchange
            case 3:
                return (allExchange.length > 0 && !loaderDataList && tab === 3)

            // Verificaciones para la pestaña de MoneyChanger
            case 4:
                return (allMoneyChanger.length > 0 && !loaderDataList && tab === 4)

            default:
                return false
        }
    }

    // Obtiene todas las solicitudes `allExchange` para obtener
    const getAllRequest = async () => {
        const { data } = await Petition.get('/admin/request/', header)

        if (data.error) {
            Swal.fire('Ha ocurrido un error', data.message, 'error')
        }

        setRequests(data)
    }

    // Obtiene todas las solicitudes de Upgrades
    const getAllUpgrades = async () => {
        const { data } = await Petition.get('/admin/upgrades', header)

        if (data.error) {
            Swal.fire('Ha ocurrido un error', data.message, 'error')
        }

        setUpgrades(data)
    }

    // Obtiene todas las solcitudes de intercambio exchange
    const getAllExchange = async () => {
        const { data } = await Petition.get('/exchange', header)

        if (data.error) {
            Swal.fire('Ha ocurrido un error', data.message, 'error')
        }

        setExchange(data)
    }

    // Obtiene todas las solcitudes de compra y venta en Money Changer
    const getAllMoneyChanger = async () => {
        const { data } = await Petition.get('/money-changer', header)

        if (data.error) {
            Swal.fire('Ha ocurrido un error', data.message, 'error')
        }

        setMoneyChanger(data)
    }

    // Ejecuta peticiones al servidor para obtener todos los datos de las tablas
    const ConfigureComponent = async () => {
        try {
            setLoaderDataList(true)

            await getAllRequest()
            await getAllUpgrades()
            await getAllExchange()
            await getAllMoneyChanger()
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoaderDataList(false)
        }
    }

    // Configura los eventos del socket para las notificaciones de nuevas solicitudes
    const ConfigureSocket = _ => {
        try {
            if (socket !== null) {
                // Se obtiene la lista de los eventos disponibles para el socket
                const {
                    newRegister,
                    removeRegister,
                    newUpgrade,
                    removeUpgrade,
                    newExchange,
                    removeExchange,
                    newMoneyChanger,
                    removeMoneyChanger,
                } = socketEvents

                if (!socket._callbacks[`$${newRegister}`]) {
                    // Evento para los nuevos registros
                    socket.on(newRegister, async _ => {
                        console.log('new register')
                        dispatchNotification()
                        await getAllRequest()
                    })

                    // Evento para remover una solicitud de registro de la lista
                    socket.on(removeRegister, _idRegister => {
                        console.log('removing register', _idRegister)
                        setRemoveRequest(_idRegister)
                    })

                    // Evento para los nuevos upgrades
                    socket.on(newUpgrade, async _ => {
                        console.log('new upgrade')
                        dispatchNotification()
                        await getAllUpgrades()
                    })

                    // Evento para remover una solicitud de upgrade de la lista+
                    socket.on(removeUpgrade, _idUpgrade => {
                        console.log('removing upgrade', _idUpgrade)
                        setRemoveUpgrade(_idUpgrade)
                    })

                    // Evento para los nuevos exchange
                    socket.on(newExchange, async _ => {
                        console.log('new exchange')
                        dispatchNotification()
                        await getAllExchange()
                    })

                    // Evento para remover un exchange
                    socket.on(removeExchange, _idExchange => {
                        console.log('removing exchange', _idExchange)
                        setRemoveExchange(_idExchange)
                    })

                    // Evento para los nuevos money changer
                    socket.on(newMoneyChanger, async _ => {
                        console.log('new money changer')
                        dispatchNotification()
                        await getAllMoneyChanger()
                    })

                    // Evento para remover un money changer de la lista
                    socket.on(removeMoneyChanger, _idMoneyChanger => {
                        console.log('removing money changer', _idMoneyChanger)
                        setRemoveMoneyChanger(_idMoneyChanger)
                    })
                }
            }
        } catch (error) {
            console.error(error)
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        }
    }

    // Remueve en elemento de la lista de solicitudes pendientes
    const RemoveItemList = _ => {
        // Remueve un elemento de la lista de registros pendientes
        if (removeRequest !== -1) {
            setRequests(allRequest.filter(item => item.id !== removeRequest))
            setDetailRequest(-1)
            window.setTimeout(_ => setRemoveRequest(-1), 1000)
        }

        // Remueve un elemento de la lista de upgrades disponibles
        if (removeUpgrade !== -1) {
            setUpgrades(allUpgrades.filter(item => item.id !== removeUpgrade))
            setDetailUpgrade(-1)
            window.setTimeout(_ => setRemoveUpgrade(-1), 1000)
        }

        // Remueve un elemento de la lista de exchanges disponibles
        if (removeExchange !== -1) {
            setExchange(allExchange.filter(item => item.id !== removeExchange))
            setDetailExchange({})
            window.setTimeout(_ => setRemoveExchange(-1), 1000)
        }

        // Remueve un elemento de la lista de moneyChanger disponibles
        if (removeMoneyChanger !== -1) {
            setMoneyChanger(allMoneyChanger.filter(item => item.id !== removeMoneyChanger))
            setDetailMoneyChanger({})
            window.setTimeout(_ => setRemoveMoneyChanger(-1), 1000)
        }
    }

    // Metodo para aplicar trading
    const applyTrading = async (password) => {
        try {
            if (!Validator.isNumeric(percentage)) {
                throw String("El porcentaje del trading no es valido")
            }

            if (cryptoCurrency === "default") {
                throw String("Seleccione una moneda")
            }

            // Verificamos si el trading en esa moneda ya se hizo
            if (!dataTrading.crypto.includes(cryptoCurrency)) {

                const dataSend = {
                    percentage,
                    id_currency: Number(cryptoCurrency),
                    password
                }
                console.log('petition apply trading')
                const { data: result, status } = await Petition.post('/admin/trading', dataSend, header)

                if (result.error) {
                    throw String(result.message)
                }

                if (status === 200 && result.response === 'success') {
                    // Copiamos el arreglo de las cryptos procesadas
                    const arr = dataTrading.crypto
                    arr.push(cryptoCurrency)

                    // creamos un objeto exacto al que esta en el estado
                    const data = {
                        crypto: arr,
                        day: moment().get('day')
                    }

                    // Modificamos con los nuevos datos
                    setDataTrading(data)

                    // lo agregamos al localstorare codificado
                    localStorage.setItem('@trading', jwt.encode(data, keySecret))


                    Swal.fire(
                        `Trading procesado`,
                        `
                    Todos los planes de inversion en 
                    ${cryptoCurrency === "1" ? 'BTC' : ''}
                    ${cryptoCurrency === "2" ? 'ETH' : ''}
                    fueron reportados
                    `,
                        "success"
                    )

                    setPercentage('')
                }
            } else {
                Swal.fire(
                    `${cryptoCurrency === '1' ? 'Bitcoin' : ''} ${cryptoCurrency === '2' ? 'Ethereum' : ''}`,
                    "Esta moneda ya se proceso, elija una diferente",
                    "warning"
                )
            }


        } catch (error) {
            console.error(error)
            Swal.fire("Ha ocurrido un error", error.toString(), 'warning')
        } finally {
            setShowPasswordModal(false)
        }
    }

    /**
     * Función para obtener el archivo .xls que será el reporte
     */
    const getReport = async _ => {
        try {
            setLoaderReportDownload(true)

            const { url, filename } = ReportsSource[tab - 2]

            const { data } = await Petition.get(`${url}?from=${reportFromDate}&to=${reportToDate}`, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Disposition': "attachment; filename=template.xlsx",
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    "x-auth-token": token
                }
            })

            if (data.error) {
                throw String(data.message)
            }

            downloadReport(data, `${filename}-${reportFromDate}_${reportToDate}.xlsx`)
        } catch (error) {
            Swal.fire("AlyExchange", error.toString(), "error")
        } finally {
            setLoaderReportDownload(false)
        }
    }

    useEffect(_ => {
        ConfigureComponent()
    }, [])

    // Configura el websocket
    useEffect(_ => {
        ConfigureSocket()
    }, [socket])

    useEffect(_ => {
        RemoveItemList()
    }, [removeRequest, removeUpgrade, removeExchange, removeMoneyChanger])

    useEffect(() => {
        setTittleDOM()

        // Verificamos si hay solicitudes de registro
        if (allRequest.length > 0) {
            setTittleDOM(`Solictudes (${allRequest.length})`)
        }

        // Verificamos si hay upgrades
        if (allUpgrades.length > 0) {
            setTittleDOM(`Upgrades (${allUpgrades.length})`)
        }

        // Verificamos si hay solicitudes de intercambios
        if (allExchange.length > 0) {
            setTittleDOM(`Exchange Request (${allExchange.length})`)
        }

        // Verificamos si hay solicitudes de Money Changer
        if (allMoneyChanger.length > 0) {
            setTittleDOM(`Money Changer Request (${allMoneyChanger.length})`)
        }

    }, [allRequest, allUpgrades, allExchange, allMoneyChanger])

    return (
        <div className="Records">
            <header className="header-content">
                {/**
                     * Sección para generar los reportes
                     */
                    [2, 3, 4].indexOf(tab) !== -1 &&
                    <div className="reports">
                        <div className="row">
                            <span>Desde</span>
                            <input
                                value={reportFromDate}
                                onChange={e => {
                                    setReportFromDate(e.target.value)
                                }}
                                type="date"
                                className="text-input" />
                        </div>

                        <div className="row">
                            <span>Hasta</span>
                            <input
                                value={reportToDate}
                                onChange={e => {
                                    setReportToDate(e.target.value)
                                }}
                                type="date"
                                className="text-input" />
                        </div>

                        <button onClick={getReport} className="button">Obtener reporte</button>
                    </div>
                }

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

                    <button
                        className="button secondary"
                        disabled={dataTrading.crypto.length === 2 || false}
                        onClick={_ => setShowPasswordModal(true)}>
                        {
                            false
                                ?
                                <>
                                    <ActivityIndicator size={16} />
                                    <span>Cargando..</span>
                                </>
                                : <span>Aplicar Trading</span>
                        }
                    </button>
                </div>


            </header>

            <div className="container">
                <div className="column list">
                    <div className="tabs-container">
                        <span
                            {...badget(allRequest.length)}
                            onClick={_ => setTab(1)}
                            className={`tab ${tab === 1 ? 'active' : ''}`}>
                            Registros
                        </span>
                        <span
                            {...badget(allUpgrades.length)}
                            onClick={_ => setTab(2)}
                            className={`tab ${tab === 2 ? 'active' : ''}`}>
                            Upgrades
                        </span>
                        <span
                            {...badget(allExchange.length)}
                            onClick={_ => setTab(3)}
                            className={`tab ${tab === 3 ? 'active' : ''}`}>
                            Exchange
                        </span>
                        <span
                            {...badget(allMoneyChanger.length)}
                            onClick={_ => setTab(4)}
                            className={`tab ${tab === 4 ? 'active' : ''}`}>
                            Money Changer
                        </span>
                    </div>

                    <div className="list-content">
                        {
                            loaderDataList &&
                            <ActivityIndicator size={100} />
                        }

                        {
                            // Indicador se solicitudes vacías
                            (
                                (allRequest.length === 0 && tab === 1) ||
                                (allUpgrades.length === 0 && tab === 2) ||
                                (allExchange.length === 0 && tab === 3) ||
                                (allMoneyChanger.length === 0 && tab === 4)
                            ) && !loaderDataList &&
                            <EmptyIndicator message={"No hay Solicitudes"} />
                        }

                        {
                            // Listado de registros
                            checkActiveTab(1) &&
                            <RequestList
                                activeDetail={detailRequest}
                                onDetail={requestId => setDetailRequest(requestId)}
                                data={allRequest} />
                        }

                        {
                            // Listado de upgrades
                            checkActiveTab(2) &&
                            <UpgradeList
                                activeDetail={detailUpgrade}
                                onDetail={upgradeId => setDetailUpgrade(upgradeId)}
                                data={allUpgrades} />
                        }

                        {
                            // Listado de exchanges
                            checkActiveTab(3) &&
                            <ExchangeList
                                activeDetail={detailExchange}
                                onDetail={_exchange => setDetailExchange(_exchange)}
                                data={allExchange} />
                        }

                        {
                            // Listado de money changer
                            checkActiveTab(4) &&
                            <MoneyChangerList
                                activeDetail={detailMoneyChanger}
                                onDetail={_moneyChanger => setDetailMoneyChanger(_moneyChanger)}
                                data={allMoneyChanger} />
                        }
                    </div>
                </div>

                <div className="column detail">
                    {
                        tab === 1 &&
                        <DetailRequest
                            id={detailRequest}
                            onRemove={_id => {
                                setRequests(allRequest.filter(item => item.id !== _id))
                                setDetailRequest(-1)
                            }} />
                    }

                    {
                        tab === 2 &&
                        <DetailUpgrade
                            id={detailUpgrade}
                            onRemove={_id => {
                                setUpgrades(allUpgrades.filter(item => item.id !== _id))
                                setDetailUpgrade(-1)
                            }} />
                    }

                    {
                        tab === 3 &&
                        <DetailExchangeRequest
                            data={detailExchange}
                            onRemove={_id => {
                                setExchange(allExchange.filter(item => item.id !== _id))
                                setDetailExchange({})
                            }} />
                    }

                    {
                        tab === 4 &&
                        <DetailMoneyChanger
                            data={detailMoneyChanger}
                            onRemove={_id => {
                                setMoneyChanger(allMoneyChanger.filter(item => item.id !== _id))
                                setDetailMoneyChanger({})
                            }} />
                    }
                </div>
            </div>

            {
                showPasswordModal &&
                <ConfirmPassword
                    onSubmit={_password => applyTrading(_password)}
                    onCancel={_ => setShowPasswordModal(false)} />
            }

            {
                loaderReportDownload &&
                <Modal persist={true} onlyChildren>
                    <ActivityIndicator size={64} />
                </Modal>
            }
        </div>
    )
}

export default Records