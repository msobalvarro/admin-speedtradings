import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Petition } from "../../utils/constanst"

// Imports styles and assets
import "./Report.scss"
import astronaut from "../../static/images/astronaut.png"

// Import Components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Swal from "sweetalert2"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"

const Report = () => {
    const { token } = useSelector(({ globalStorage }) => globalStorage)

    const [filter, setFilter] = useState('')

    // Estado para guardar el valor de la criptomoneda seleccionada
    const [currency, setCurrency] = useState('1')

    // Lista que guarda los datos renderizados
    const [allData, setData] = useState([])

    // Estado para renderizar loader
    const [loader, setLoader] = useState(true)

    /**Monto total a pagar */
    const total = []

    /**Metodo para ejecutar consulta de registros */
    const getAllData = async (_currency = "1") => {
        const headers = {
            "x-auth-token": token
        }

        try {
            setLoader(true)

            // 
            await Petition.post('/admin/payments', { id_currency: Number(_currency) }, { headers })
                .then(({ data, status }) => {
                    console.log(data)

                    if (data.error) {
                        throw data.message
                    }

                    if (status === 200) {
                        setData(data)
                    }
                })
                .catch(reason => {
                    throw reason
                })

        } catch (error) {
            Swal.fire(
                "Ha ocurrido un error",
                error.toString(),
                "error"
            )
        } finally {
            setLoader(false)
        }
    }

    /**Componente para renderizar los datos */
    const ItemComponent = (item, index) => {
        total.push(item.amount)

        if (
            item.name.length > 0 && item.name.toLowerCase().search(filter) > -1 ||
            item.wallet.length > 0 && item.wallet.toLowerCase().search(filter) > -1 ||
            item.amount.length > 0 && item.amount.toLowerCase().search(filter) > -1
            // allRecord.id_user
        ) {
            return (
                <div className="row" key={index}>
                    <span>{item.name}</span>
                    <span>{item.wallet}</span>
                    <span>{item.amount}</span>
                </div>
            )
        }
    }

    const changeCurrency = ({ target }) => {
        setCurrency(target.value)

        getAllData(target.value)
    }

    useEffect(() => {
        getAllData()
    }, [])


    return (
        <div className="container-report">
            <NavigationBar />

            <div className="content">
                <div className="header">
                    <input type="text" value={filter} onChange={e => setFilter(e.target.value)} className="text-input" placeholder="Filtrar.." />

                    <select disabled={loader} className="picker" value={currency} onChange={changeCurrency}>
                        <option value="1">Bitcoin</option>
                        <option value="2">Ethereum</option>
                    </select>
                </div>

                {
                    loader &&
                    <ActivityIndicator size={64} />
                }

                {
                    (!loader && allData.length > 0) &&
                    <>

                        <div className="table">
                            <div className="header">
                                <span>Nombre</span>
                                <span>Wallet</span>
                                <span>Monto</span>
                            </div>

                            {allData.map(ItemComponent)}

                            <div className="footer">
                                <span>
                                    Total {total.reduce((a, b) => a + b, 0)} {currency === "1" ? "BTC" : "ETH"}
                                </span>
                            </div>
                        </div>
                    </>
                }


                {
                    (!loader && allData.length === 0) &&
                    <div className="empty">
                        <img src={astronaut} alt="empty" />
                        <h2>No hay reportes todavia</h2>
                    </div>
                }
            </div>
        </div>
    )
}

export default Report