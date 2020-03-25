import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

// Improt styles and assets
import './index.scss'

// Import components
import App from './views/App'
import * as serviceWorker from './serviceWorker'

// Redux storage / storage from localstorage
import store from './store/store'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
