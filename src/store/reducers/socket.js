import { SETSOCKET, DELETSOCKET } from "../ActionTypes"

const INITIAL_STATE = null

export const socket = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SETSOCKET: {
            return action.payload
        }
        case DELETSOCKET: {
            return INITIAL_STATE
        }

        default: {
            return state
        }
    }
}