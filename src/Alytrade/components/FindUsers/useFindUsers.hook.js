import { useMemo, useReducer, useState } from 'react'
import ConfirmPassword from '../../../components/ConfirmPassword/ConfirmPassword'
import { AlytradeBackofficeService } from '../../services'
import { currencyMap } from '../../utils'

const initialState = {
    users: [],
    investments: [],
    plan: {},
    interest: [],
    userIndex: -1,
    investmentIndex: 0
}

const TYPES = {
    SET_USERS: 'SET_USERS',
    SET_USER_INDEX: 'SET_USER_INDEX',
    SET_INVESTMENTS: 'SET_INVESTMENTS',
    SET_INVESTMENT_INDEX: 'SET_INVESTMENT_INDEX',
    SET_PLAN: 'SET_PLAN',
    SET_INTEREST: 'SET_INTEREST',
}

const reducer = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case TYPES.SET_USERS: {
            return {
                ...state,
                users: payload
            }
        }
        case TYPES.SET_USER_INDEX: {
            return {
                ...state,
                userIndex: payload
            }
        }
        case TYPES.SET_INVESTMENTS: {
            return {
                ...state,
                investments: payload
            }
        }
        case TYPES.SET_PLAN: {
            return {
                ...state,
                plan: payload
            }
        }
        case TYPES.SET_INTEREST: {
            return {
                ...state,
                interest: payload
            }
        }
        case TYPES.SET_INVESTMENT_INDEX: {
            return {
                ...state,
                investmentIndex: payload
            }
        }
        default:
            return state
    }
}
const USER_LIST_PAGE = 1
const KYC_FORM = 2
const PAGE_SIZE = 10

const useFindUsers = () => {
    
    const service = AlytradeBackofficeService()
    const [state, dispatch] = useReducer(reducer, initialState)
    const [usernameInput, setUsernameInput] = useState('')
    const [usernamePage, setUsernamePage] = useState(0)
    const [usernameMaxPage, setUsernameMaxPage] = useState(-1)
    // Estado para controlar la pestaña activa
    const [page, setPage] = useState(1)
    // Estado para guardar la informacion que se comparte entre paginas
    const [sharedInformation, setSharedInformation] = useState({})

    /**
    * Función que cambia el estado para cambiar de pagina
    * @param {Number} pageNumber - Número de la pagina a la que se movera
    * @param {Object} data - Datos que se comparten de la pagina anterior a la pagina nueva
    */

    const onKYCClickChangePage = (pageNumber, data) => {
        //Guardar datos que recibe de la pagina anterior
        setSharedInformation(data)

        //Cambiar de pagina
        setPage(pageNumber)
    }

    useMemo(async () => {
        const usrs = await service.findUsers({pageSize:PAGE_SIZE})
        dispatch({ type: TYPES.SET_USERS, payload: usrs.data })
        setUsernameMaxPage(usrs.totalPages - 1)
        console.log(usrs.totalPages)
        //setUsers(usrs)
    }, [])

    const onRowClick = (index) => {
        dispatch({ type: TYPES.SET_INVESTMENTS, payload: state.users[index].investments })
        //setInvestments(users[index].investments)
        dispatch({ type: TYPES.SET_USER_INDEX, payload: index })
        dispatch({ type: TYPES.SET_INTEREST, payload: state?.users[index]?.investments[0]?.interests })
        dispatch({ type: TYPES.SET_INVESTMENT_INDEX, payload: 0 })
    }

    const onChangeInvestmentSelect = (e) => {
        console.log('investmentIndex', e.currentTarget.value)
        const index = Number(e.currentTarget.value)
        //setInvestmentIndex(Number(e.currentTarget.value))
        dispatch({ type: TYPES.SET_INVESTMENT_INDEX, payload: index })
        dispatch({ type: TYPES.SET_INTEREST, payload: state?.users[state.userIndex]?.investments[index]?.interests })
    }

    const onFindClick = async () => {
        const usrs = await service.findUsers({ username:usernameInput, page:0, pageSize:PAGE_SIZE })
        dispatch({ type: TYPES.SET_USERS, payload: usrs.data })
    }

    const changePage = async (page) =>{
        const usrs = await service.findUsers({ username:usernameInput, page, pageSize:PAGE_SIZE })
        dispatch({ type: TYPES.SET_USERS, payload: usrs.data })
    }

    const backPage = () =>{
        if(usernamePage > 0){
            changePage(usernamePage-1)
            setUsernamePage(usernamePage-1)
        }
    }

    const nextPage =  () =>{
        if(usernamePage < usernameMaxPage){
            changePage(usernamePage+1)
            setUsernamePage(usernamePage+1)
        }
    }

    const onUserInputChange = (e) => {
        setUsernameInput(e.target.value)
    }

    return {
        users: state.users,
        onRowClick,
        investments: state.investments,
        currencyMap,
        onChangeInvestmentSelect,
        interest: state.interest,
        plan: state.plan,
        userIndex: state.userIndex,
        user: state.users[state.userIndex],
        investment: state.investments[state.investmentIndex],
        onKYCClickChangePage,
        page,
        showKYC: () => setPage(2),
        usernameInput,
        onUserInputChange,
        onFindClick,
        backPage,
        nextPage,
        usernamePage
    }
}

export default useFindUsers