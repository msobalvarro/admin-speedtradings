import { isNumber } from "lodash"
import { useMemo, useState } from "react"
import { AlytradeBackofficeService } from '../../services'
import { currencyMap } from '../../utils'

const useLastUsers = () => {
    const service = AlytradeBackofficeService()
    const [users, setUsers] = useState([])
    const [selectedIndex, setSelectedIndex] = useState()
    //carga de usuarios
    useMemo(async () => {
        const usr = await service.getLastUsers()
        console.log(usr)
        setUsers(usr || [])
    }, [])
    const onRowClick = (index) => {
        setSelectedIndex(index)
        console.log(index, users)
    }
    return {
        users,
        onRowClick,
        selected: isNumber(selectedIndex) ? users[selectedIndex] : undefined,
        currencyMap
    }
}

export default useLastUsers