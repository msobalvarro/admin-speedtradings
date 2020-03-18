import React from 'react'
import { HashRouter, Route, Switch } from "react-router-dom"

// Import Assets
import Login from './Login/Login'

// Import Views

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </HashRouter>
  )
}

export default App
