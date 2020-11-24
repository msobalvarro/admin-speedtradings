import {
    DELETESTORAGE,
    SETSTORAGE,
    SETADMINCONNECTED,
    SETADMINCONNECTEDEMAILS,
    SETSOCKETEVENTS
} from "../ActionTypes"

const INITIAL_STATE = {
    adminConnected: 1,
    adminConnectedEmails: []
}

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

        case SETSOCKETEVENTS: {
            return {
                ...state,
                socketEvents: action.payload
            }
        }

        case SETADMINCONNECTED: {
            return {
                ...state,
                adminConnected: action.payload
            }
        }

        case SETADMINCONNECTEDEMAILS: {
            return {
                ...state,
                adminConnectedEmails: action.payload
            }
        }

        default: {
            return state
        }
    }
}