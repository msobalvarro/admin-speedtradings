import React, { useState, useEffect } from 'react'
import { HashRouter, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

// Import Assets

// Redux configurations
import { getStorage } from '../utils/constanst'
import { DELETESTORAGE, SETSTORAGE } from '../store/ActionTypes'

// Import Views
import Login from './Login/Login'
import Records from './Records/Records'
import Report from './Report/Report'
import Logs from './Logs/Logs'

const App = () => {
  const dispatch = useDispatch()
  // useSelector(({ globalStorage }) => console.log(globalStorage))
  const [loged, setLogin] = useState(false)

  useEffect(() => {
    const payload = getStorage()

    // Comprueba si hay datos retornados en el payload
    if (Object.keys(payload).length > 0) {

      // Creamos el dispatch para el storage de redux
      dispatch({
        type: SETSTORAGE,
        payload
      })

      // Le decimos que el usuario esta logueado
      setLogin(true)
    } else {
      setLogin(false)
      // Destruimos el sorage
      dispatch({ type: DELETESTORAGE })
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
          </>
        }
      </Switch>
    </HashRouter>
  )
}

export default App
