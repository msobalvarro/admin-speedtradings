import React, { useState, useEffect } from 'react'
import { HashRouter, Route, Switch } from "react-router-dom"
import { useDispatch } from "react-redux"
import socketIoClient from "socket.io-client"
// Import Assets

// Redux configurations
import { getStorage, urlServerSocket, Petition } from '../utils/constanst'
import {
    DELETESTORAGE,
    SETSTORAGE,
    DELETSOCKET,
    SETSOCKET,
    SETSOCKETEVENTS
} from '../store/ActionTypes'

// Import Views
import Login from './Login/Login'
import Records from './Records/Records'
import Users from './Users/Users'
import Report from './Report/Report'
import Comissions from './Comissions/Comissions'
import ReportDetail from './ReportDetail/ReportDetail'
import Logs from './Logs/Logs'
import Mailing from './Mail/Mail'
import Configuration from './Configuration/Configuration'
import NotFound from './404/404'

const App = () => {
    const dispatch = useDispatch()
    const [loged, setLogin] = useState(false)

    // Configura y esta a la esucha del servidor con soket
    const ConfigurateSoket = async (token = "") => {
        try {
            const { data } = await Petition.get('/admin/utils', {
                headers: {
                    'x-auth-token': token
                }
            })

            const socket = socketIoClient(urlServerSocket, {
                query: {
                    token: token
                },
                forceNew: true,
                transports: ['websocket']
            })

            socket.on('connect', _ => {
                console.log('Socket connected')
            })

            dispatch({ type: SETSOCKETEVENTS, payload: data.eventSocketNames })
            dispatch({ type: SETSOCKET, payload: socket })
        } catch (error) {
            console.log(error)
        }
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

            ConfigurateSoket(payload.token)

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
            {
                !loged &&
                <Switch>
                    <Route component={Login} path="/" exact />
                    <Route path="*" component={NotFound} />
                </Switch>
            }

            {
                loged &&
                <>
                    <Switch>
                        <Route path="/" exact component={Records} />
                        <Route path="/users" exact component={Users} />
                        <Route path="/comissions" component={Comissions} />
                        <Route path="/reports" exact component={Report} />
                        <Route path="/reports/:id" exact component={ReportDetail} />
                        <Route path="/logs" exact component={Logs} />
                        <Route path="/mailing" exact component={Mailing} />
                        <Route path="/configuration" exact component={Configuration} />
                        <Route path="*" component={NotFound} />
                    </Switch>
                </>
            }
        </HashRouter>
    )
}

export default App
