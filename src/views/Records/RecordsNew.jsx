import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import './RecordsNew.scss'

// Import utils
import { Petition, keySecret, setTittleDOM, downloadReport } from "../../utils/constanst"

// Import middlewares and validators
import jwt from "jwt-simple"
import moment from "moment"
import Validator from "validator"

// Import styles and assets
import "./Records.scss"
import sounNotification from "../../static/sound/notification.mp3"

// Import components
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import EmptyIndicator from "../../components/EmptyIndicator/EmptyIndicator"
import NavigationBar from "../../components/NavigationBar/NavigationBar"

import MoneyChangerList from "../../components/MoneyChangerList/MoneyChangerList"
import ExchangeList from "../../components/ExchangeList/ExchangeList"
import UpgradeList from "../../components/UpgradeList/UpgradeList"
import RequestList from "../../components/RequestList/RequestList"

import DetailRequest from "../../components/DetailRequest/DetailRequest"


const Records = () => {
    const { token } = useSelector((storage) => storage.globalStorage)
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

    // Estados para los componentes de ejecutar trading
    const [percentage, setPercentage] = useState('')
    const [cryptoCurrency, setCrypto] = useState('default')

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

    // Reproduce el sonido de notificación
    const dispatchNotification = _ => {
        const audioNotification = new Audio(sounNotification)

        audioNotification.muted = false
        audioNotification.play()
    }

    // Ejecuta peticiones al servidor para obtener todos los datos de las tablas
    const ConfigureComponent = async () => {
        try {
            setLoaderDataList(true)

            await getAllRequest()
            await getAllUpgrades()
            await getAllExchange()
            await getAllMoneyChanger()

            if (socket !== null) {
                socket.addEventListener("message", async (response) => {
                    const { data: typeEvent } = response

                    // esperamos respuesta de una nueva solicitud atravez del socket
                    if (typeEvent === "newRequest") {
                        await getAllRequest()
                    }

                    // Esperamos una nueva solictud de upgrade
                    if (typeEvent === "newUpgrade") {
                        await getAllUpgrades()
                    }

                    // Esperamos una nueva solictud de Exchange
                    if (typeEvent === "newExchange") {
                        await getAllExchange()
                    }

                    // Esperamos una nueva solictud de Exchange
                    if (typeEvent === "newMoneyChanger") {
                        await getAllMoneyChanger()
                    }

                    await window.focus()

                    dispatchNotification()
                })
            }
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoaderDataList(false)
        }
    }

    useEffect(_ => {
        ConfigureComponent()
    }, [])

    return (
        <div className="Records">
            <NavigationBar />

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
                                onDetail={requestId => {
                                    console.log(requestId)
                                    setDetailRequest(requestId)
                                }}
                                data={allRequest} />
                        }

                        {
                            // Listado de upgrades
                            checkActiveTab(2) &&
                            <UpgradeList
                                data={allUpgrades} />
                        }

                        {
                            // Listado de exchanges
                            checkActiveTab(3) &&
                            <ExchangeList
                                data={allExchange} />
                        }

                        {
                            // Listado de money changer
                            checkActiveTab(4) &&
                            <MoneyChangerList
                                data={allMoneyChanger} />
                        }
                    </div>
                </div>

                <div className="column detail">
                    {
                        tab === 1 &&
                        <DetailRequest id={detailRequest} />
                    }
                </div>
            </div>
        </div>
    )
}

export default Records