import React, { useRef, useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"
import { LogOut } from "../../utils/constanst"

// Import Assets
import Logo from "../../static/images/logo.png"
import { ReactComponent as ArrowIcon } from "../../static/images/arrow-back.svg"
import "./NavigationBar.scss"

import { SETADMINCONNECTED, SETADMINCONNECTEDEMAILS } from '../../store/ActionTypes'

import { randomKey } from '../../utils/constanst'


const NavigationBar = () => {
    const socket = useSelector(storage => storage.socket)
    const {
        adminConnected,
        adminConnectedEmails,
        socketEvents
    } = useSelector(storage => storage.globalStorage)
    const dispatch = useDispatch()

    const location = window.location.hash

    const [showMore, setShowMore] = useState(false)
    const [showConnected, setShowConnected] = useState(false)
    const showMoreContainerRef = useRef(null)

    // Detect blur for component to hide option list
    const handleBlur = (e) => {
        if (!showMoreContainerRef.current.contains(e.target) && showMore) {
            setShowMore(false)
        }
    }

    useEffect(_ => {
        if (socket !== null) {
            // Se estable el listener para detectar los admins conectados
            socket.on(socketEvents.adminCounter, response => {
                dispatch({ type: SETADMINCONNECTED, payload: response.length })
                dispatch({ type: SETADMINCONNECTEDEMAILS, payload: response })
            })
        }
    })

    useEffect(_ => {
        window.addEventListener('click', handleBlur)

        return _ => {
            window.removeEventListener('click', handleBlur)
        }
    })


    return (
        <nav className="navigation-bar">
            <img src={Logo} className="brand-logo" alt="logo" />

            <div className="content-links">
                <Link
                    to="/"
                    className={(location === '#/') ? 'active' : ''}>
                    Registros
                </Link>
                <Link
                    to="/users"
                    className={(location === '#/users') ? 'active' : ''}>
                    Usuarios
                </Link>
                <Link
                    to="/comissions"
                    className={(location === '#/comissions') ? 'active' : ''}>
                    Comisiones
                </Link>
                <Link
                    to="/reports"
                    className={(location === '#/reports') ? 'active' : ''}>
                    Reporte de pago
                </Link>
                <Link
                    to="/mailing"
                    className={(location === '#/mailing') ? 'active' : ''}>
                    Correo
                </Link>

                <button
                    onMouseEnter={_ => setShowConnected(true)}
                    onMouseLeave={_ => setShowConnected(false)}
                    className={`dropdown admin-connect`}>
                    <span>Conectados <strong>{adminConnected}</strong></span>
                </button>

                {
                    adminConnectedEmails.length > 0 &&
                    <div className={`dropdown-content admin-connect ${showConnected ? 'active' : ''}`}>
                        {
                            adminConnectedEmails.map(email => (
                                <span key={randomKey()}>{email}</span>
                            ))
                        }
                    </div>
                }

                <button
                    onClick={_ => setShowMore(!showMore)}
                    className={`dropdown ${showMore ? 'active' : ''}`}>
                    <ArrowIcon className="arrow" />
                </button>

                <div
                    ref={showMoreContainerRef}
                    className={`dropdown-content ${showMore ? 'active' : ''}`}>
                    <Link
                        to="/configuration"
                        className={(location === '#/configuration') ? 'active' : ''}>
                        Configuración
                </Link>
                    <Link
                        to="/logs"
                        className={(location === '#/logs') ? 'active' : ''}>
                        Consola
                </Link>
                    <a href="/#" onClick={LogOut}>Cerrar sesion</a>
                </div>
            </div>
        </nav>
    )
}

export default NavigationBar