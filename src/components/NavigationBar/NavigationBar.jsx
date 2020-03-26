import React from "react"
import { Link } from "react-router-dom"
import { LogOut } from "../../utils/constanst"

// Import Assets
import Logo from "../../static/images/logo.png"
import "./NavigationBar.scss"
import { useSelector } from "react-redux"


const NavigationBar = () => {
    // const { globalStorage } = useSelector(storage => storage)
    // const location = window.location.hash


    return (
        <nav className="navigation-bar">
            <img src={Logo} className="brand-logo" alt="logo" />

            <div className="content-links">
                {/* <Link to="/" className={(location === '#/') ? 'active' : ''}>Inicio</Link>
                <Link to="/sponsors" className={(location === '#/sponsors') ? 'active' : ''}>Cerr</Link>
                <Link to="/profile" className={(location === '#/profile') ? 'active' : ''}>{globalStorage.username}</Link> */}
                <a href="#" onClick={LogOut}>Cerrar sesion</a>
            </div>
        </nav>
    )
}

export default NavigationBar