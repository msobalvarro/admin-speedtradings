import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
const reducers = combineReducers(reducers)

const store = createStore(reducers, composedEnhancer)

export {
    store
}