import React from 'react'
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom'
import { LastUsers, FindUsers } from '../components'

const AlytradeRouter = () => {
    let { path, url } = useRouteMatch();
    console.log(path, url)
    return (<Switch>        
        <Route exact path={path}>
            <LastUsers />
        </Route>
        <Route exact path={`${path}/users`}>
            <FindUsers />
        </Route>
    </Switch>)
}

export default AlytradeRouter