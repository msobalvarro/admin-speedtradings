import { combineReducers } from "redux"

// imports reducers
import { globalStorage } from "./globalStorage"
import { socket } from "./socket"

const reducers = combineReducers({
    globalStorage,
    socket
})

export default reducers