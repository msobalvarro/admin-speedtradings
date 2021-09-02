import Axios from "axios"

const AlytradeBackofficeService = () => {

    const Petition = Axios.create({
        baseURL: `${process.env.REACT_APP_BEHOST}/backoffice/alytrade`
    })

    const getLastUsers = async () => {
        try {
            const response = await Petition.get('/users')
            const { data } = response
            return data
        } catch (err) {
            console.log(err)
            throw err.message
        }
        
    }

    const findUsers = async ({ username='', page=0, pageSize = 50 }={}) => {
        try {
            const response = await Petition.post('/findusers', {
                username,
                page,
                pageSize
            })
            const { data } = response
            return data
        } catch (err) {
            console.log(err)
            throw err.message
        }
    }

    return {
        getLastUsers,
        findUsers
    }
}

export { AlytradeBackofficeService }