import { combineReducers } from "redux"

// imports reducers
import { globalStorage } from "./globalStorage"

const reducers = combineReducers({
    globalStorage,
})

export default reducers