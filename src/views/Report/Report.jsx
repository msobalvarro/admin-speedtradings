import React, { useEffect, useState, useReducer } from "react"
import { useSelector } from "react-redux"
import { Petition, copyData } from "../../utils/constanst"

// Imports styles and assets
import "./Report.scss"
import astronaut from "../../static/images/astronaut.png"

// Import Components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Swal from "sweetalert2"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"

const Report = () => {
    const hashs = []

    const { token } = useSelector(({ globalStorage }) => globalStorage)

    const [filter, setFilter] = useState('')

    // Estado para guardar el valor de la criptomoneda seleccionada
    const [currency, setCurrency] = useState('1')

    // Lista que guarda los datos renderizados
    const [allData, setData] = useState([])

    // Estado para renderizar loader
    const [loader, setLoader] = useState(true)

    const [total, setTotal] = useState(0)

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

                    if (data.error) {
                        throw data.message
                    }

                    if (status === 200) {
                        /**Alamacenara temporalmente la suma de total a pagar */
                        let newTotal = 0

                        setData(data)

                        for (let index = 0; index < data.length; index++) {
                            const element = data[index]

                            newTotal += element.amount
                        }

                        setTotal(newTotal)
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
        if (
            item.name.length > 0 && item.name.toLowerCase().search(filter) > -1 ||
            item.wallet.length > 0 && item.wallet.toLowerCase().search(filter) > -1 ||
            item.amount.length > 0 && item.amount.toLowerCase().search(filter) > -1
        ) {
            return (
                <div className={`row ${hashs[index] !== "" ? "opacity" : ""}`} key={index}>
                    <span>{item.name}</span>
                    <span>{item.amount} {currency === "1" ? "BTC" : "ETH"}</span>
                    <span onClick={_ => copyData(item.wallet)}>{item.wallet}</span>
                    <input type="text" className="text-input" onChange={e => hashs[index] = e.target.value} />
                </div>
            )
        }
    }

    /**Cambia de moneda al reporte */
    const changeCurrency = ({ target }) => {
        setCurrency(target.value)

        getAllData(target.value)
    }

    /**Ejecuta el reporte de pago */
    const onReport = () => {
        console.log(hashs)
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

                    <div className="selection">
                        <span className="total">
                            Total {total.toString()} {currency === "1" ? "BTC" : "ETH"}
                        </span>

                        <select disabled={loader} className="picker" value={currency} onChange={changeCurrency}>
                            <option value="1">Bitcoin</option>
                            <option value="2">Ethereum</option>
                        </select>

                        <button className="button" onClick={onReport}>Enviar reporte</button>
                    </div>
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
                                <span>Monto</span>
                                <span>Wallet</span>
                                <span>hash</span>
                            </div>

                            {allData.map(ItemComponent)}
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