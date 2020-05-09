import React from "react"
import { useLocation } from "react-router-dom"

// Import styles
import "./404.scss"

// Import constants
import { LogOut } from "../../utils/constanst"

// Import Assets 
import astronaut from "../../static/images/not-found/astronaut.svg"
import earth from "../../static/images/not-found/earth.svg"
import moon from "../../static/images/not-found/moon.svg"
import rocket from "../../static/images/not-found/rocket.svg"

const NotFound = () => {
    const { pathname } = useLocation()

    const goHome = () => {
        window.location.href = window.location.origin
    }

    const isRegisterView = pathname.toLocaleLowerCase().search("/register") !== -1

    return (
        <div className="container-404">
            <div className="content-info">
                <h1>404</h1>

                {
                    isRegisterView
                        ? <p className="info">Para continuar deberas cerrar sesion</p>
                        : <p className="info">Contenido no encontrado</p>
                }

                <div className="buttons">
                    <button className="button secondary" onClick={window.history.back}>Atras</button>

                    {
                        isRegisterView
                            ? <button className="button secondary" onClick={_ => LogOut(pathname)}>Cerrar sesion</button>
                            : <button className="button secondary" onClick={goHome}>Ir a Inicio</button>
                    }
                </div>

            </div>

            <div className="content-astronaut">
                <div className="earth-moon">
                    <img className="object_earth" src={earth} width="100px" />
                    <img className="object_moon" src={moon} width="80px" />
                </div>

                <img className="object_rocket" src={rocket} width="40px" />
                <img className="object_astronaut" src={astronaut} width="140px" />

                <div className="glowing_stars">
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                </div>
            </div>


        </div>
    )
}

export default NotFound