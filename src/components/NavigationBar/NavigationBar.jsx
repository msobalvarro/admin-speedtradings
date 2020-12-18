import React, { useRef, useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useLocation } from "react-router-dom"
import Lottie from "lottie-react-web"
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

    const [showMore, setShowMore] = useState(false)
    const [showConnected, setShowConnected] = useState(false)
    const showMoreContainerRef = useRef(null)

    // Detect blur for component to hide option list
    const handleBlur = (e) => {
        if (showMoreContainerRef.current) {
            if (!showMoreContainerRef.current.contains(e.target) && showMore) {
                setShowMore(false)
            }
        }
    }

    /**
     * Configura los eventos del socket para actualizar la lista de los usuarios
     * conectados
     */
    useEffect(_ => {
        if (socket !== null && !socket._callbacks[`$${socketEvents.adminCounter}`]) {
            // Se estable el listener para detectar los admins conectados
            socket.on(socketEvents.adminCounter, response => {
                dispatch({ type: SETADMINCONNECTED, payload: response.length })
                dispatch({ type: SETADMINCONNECTEDEMAILS, payload: response })
            })
        }
    }, [socket])

    useEffect(_ => {
        window.addEventListener('click', handleBlur)

        return _ => {
            window.removeEventListener('click', handleBlur)
        }
    })

    // Si se carga la vista de reportes, se oculta el navbar
    if (/^\/reports\/[\d]{1,}$/.test(useLocation().pathname)) {
        return null
    }

    return (
        <nav className="navigation-bar">
            <img src={Logo} className="brand-logo" alt="logo" />

            <div className="content-links">
                <NavLink
                    to="/"
                    exact
                    activeClassName='active'>
                    Registros
                </NavLink>
                <NavLink
                    to="/users"
                    activeClassName='active'>
                    Usuarios
                </NavLink>
                <NavLink
                    to="/comissions"
                    activeClassName='active'>
                    Comisiones
                </NavLink>
                <NavLink
                    to="/reports"
                    activeClassName='active'>
                    Reporte de pago
                </NavLink>
                <NavLink
                    to="/mailing"
                    activeClassName='active'>
                    Correo
                </NavLink>

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
                    <NavLink
                        to="/configuration"
                        activeClassName='active'>
                        Configuración
                    </NavLink>
                    <NavLink
                        to="/logs"
                        activeClassName='active'>
                        Consola
                    </NavLink>
                    <a href="/#" onClick={LogOut}>Cerrar sesion</a>
                </div>
            </div>
        </nav>
    )
}

export default NavigationBar