import React, { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { LogOut } from "../../utils/constanst"

// Import Assets
import Logo from "../../static/images/logo.png"
import { ReactComponent as ArrowIcon } from "../../static/images/arrow-back.svg"
import "./NavigationBar.scss"


const NavigationBar = () => {
    const location = window.location.hash

    const [showMore, setShowMore] = useState(false)
    const showMoreContainerRef = useRef(null)

    // Detect blur for component to hide option list
    const handleBlur = (e) => {
        if (!showMoreContainerRef.current.contains(e.target) && showMore) {
            setShowMore(false)
        }
    }

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
                    onClick={_ => setShowMore(!showMore)}
                    className={`dropdown ${showMore ? 'active' : ''}`}>
                    <span>Ver más</span>
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