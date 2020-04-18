import React, { useState, useEffect } from 'react'
import { HashRouter, Route, Switch } from "react-router-dom"
import { useDispatch } from "react-redux"
import io from "socket.io-client"

// Import Assets

// Redux configurations
import { getStorage, urlServerSocket } from '../utils/constanst'
import { DELETESTORAGE, SETSTORAGE, DELETSOCKET, SETSOCKET } from '../store/ActionTypes'

// Import Views
import Login from './Login/Login'
import Records from './Records/Records'
import Report from './Report/Report'
import Logs from './Logs/Logs'
import Mailing from './Mail/Mail'

const App = () => {
    const dispatch = useDispatch()
    // useSelector(({ globalStorage }) => console.log(globalStorage))
    const [loged, setLogin] = useState(false)

    // Configura y esta a la esucha del servidor con soket
    const ConfigurateSoket = () => {
        const socket = io(urlServerSocket, {
            transports: ['websocket', 'polling', 'flashsocket']
        })

        dispatch({ type: SETSOCKET, payload: socket })
    }

    useEffect(() => {
        const payload = getStorage()

        // Comprueba si hay datos retornados en el payload
        if (Object.keys(payload).length > 0) {

            // Creamos el dispatch para el storage de redux
            dispatch({
                type: SETSTORAGE,
                payload
            })

            ConfigurateSoket()

            // Le decimos que el usuario esta logueado
            setLogin(true)
        } else {
            setLogin(false)
            
            // Destruimos el storage
            dispatch({ type: DELETESTORAGE })

            // Destruimos la instancia de socket
            dispatch({ type: DELETSOCKET })
        }
    }, [])

    return (
        <HashRouter>
            <Switch>
                {
                    !loged &&
                    <Route component={Login} />
                }

                {
                    loged &&
                    <>
                        <Route path="/" exact component={Records} />
                        <Route path="/reports" exact component={Report} />
                        <Route path="/logs" exact component={Logs} />
                        <Route path="/mailing" exact component={Mailing} />
                    </>
                }
            </Switch>
        </HashRouter>
    )
}

export default App
