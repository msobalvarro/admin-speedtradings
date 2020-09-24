import React from "react"
import { Link } from "react-router-dom"
import { LogOut } from "../../utils/constanst"

// Import Assets
import Logo from "../../static/images/logo.png"
import "./NavigationBar.scss"


const NavigationBar = () => {
    const location = window.location.hash


    return (
        <nav className="navigation-bar">
            <img src={Logo} className="brand-logo" alt="logo" />

            <div className="content-links">
                <Link to="/" className={(location === '#/') ? 'active' : ''}>Registros</Link>
                <Link to="/comissions" className={(location === '#/comissions') ? 'active' : ''}>Comisiones</Link>
                <Link to="/reports" className={(location === '#/reports') ? 'active' : ''}>Reporte de pago</Link>
                <Link to="/mailing" className={(location === '#/mailing') ? 'active' : ''}>Correo</Link>
                <Link to="/logs" className={(location === '#/logs') ? 'active' : ''}>Consola</Link>
                <a href="/#" onClick={LogOut}>Cerrar sesion</a>
            </div>
        </nav>
    )
}

export default NavigationBar