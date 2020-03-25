import { DELETESTORAGE, SETSTORAGE } from "../ActionTypes"

const INITIAL_STATE = {}

export const globalStorage = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SETSTORAGE: {
            return {
                ...state,
                ...action.payload
            }
        }
        case DELETESTORAGE: {
            return INITIAL_STATE
        }

        default: {
            return state
        }
    }
}