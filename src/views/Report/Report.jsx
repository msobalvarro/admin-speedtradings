import React, { useEffect, useState, useReducer } from "react"
import { useSelector } from "react-redux"

// import constants and functions
import { Petition, copyData, reducer } from "../../utils/constanst"

// Imports styles and assets
import "./Report.scss"
import astronaut from "../../static/images/astronaut.png"

// Import Components
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Swal from "sweetalert2"

const initialState = {
    // filtro de busqueda
    filter: "",


    // Estado para guardar el valor de la criptomoneda seleccionada
    currency: 1,

    // Estado que representara la suma de total a pagar
    total: 0,

    // estado que renderiza el loader
    loader: false,

    // Lista que guarda los datos renderizados
    allData: [],
}

const Report = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // Contendra todos los hash escritos
    const hashs = []

    const { token } = useSelector(({ globalStorage }) => globalStorage)

    /**Token para ejecutar la petition */
    const headers = {
        "x-auth-token": token
    }

    /**Metodo para ejecutar consulta de registros */
    const getAllData = async (_currency = 1) => {
        try {
            dispatch({ type: "loader", payload: true })

            // 
            const { data, status } = await Petition.get(`/admin/payments/${_currency}`, { headers })

            console.log(data)

            if (data.error) {
                throw data.message
            }

            if (status === 200) {
                /**Alamacenara temporalmente la suma de total a pagar */
                let newTotal = 0

                dispatch({ type: "allData", payload: data })

                // Sumamos el total a pagar
                for (let index = 0; index < data.length; index++) {
                    const element = data[index]

                    newTotal += element.amount
                }

                dispatch({ type: "total", payload: newTotal })
            }

        } catch (error) {
            Swal.fire(
                "Ha ocurrido un error",
                error.toString(),
                "error"
            )
        } finally {
            dispatch({ type: "loader", payload: false })
        }
    }

    /**Componente para renderizar los datos */
    const ItemComponent = (item, index) => {
        if (
            item.name.length > 0 && item.name.toLowerCase().search(state.filter) > -1 ||
            item.wallet.length > 0 && item.wallet.toLowerCase().search(state.filter) > -1 ||
            item.amount.length > 0 && item.amount.toLowerCase().search(state.filter) > -1
        ) {
            return (
                <div className="row" id={"row-" + index} key={index}>
                    <span>{item.name}</span>
                    <span className="copy-element" onClick={_ => copyData(item.amount)}>{item.amount} {state.currency === 1 ? "BTC" : "ETH"}</span>
                    {/* {
                        item.user_coinbase !== null
                            ? <span className="copy-element" onClick={_ => copyData(item.user_coinbase)}>{item.user_coinbase}</span>
                        } */}

                    <span className="copy-element" onClick={_ => copyData(item.wallet)}>{item.wallet}</span>

                    {

                        // verificamos la wallet no es de alypay
                        item.alypay !== 1 &&
                        <>
                            {
                                item.hash === null
                                    ? <input type="text" placeholder="Escriba hash de transaccion" className="text-input" onChange={e => hashs[index] = e.target.value} />
                                    : <div onClick={_ => copyData(item.hash)} className="hash-transaction copy-element">{item.hash}</div>

                            }
                        </>
                    }


                    {
                        // verificamos si la wallet le pertenece a alypay
                        item.alypay === 1 &&
                        <>
                            <span className="alypay-verified">AlyPay Verified</span>
                        </>
                    }

                </div>
            )
        }
    }

    /**Cambia de moneda al reporte */
    const changeCurrency = ({ target }) => {

        const payload = parseInt(target.value)

        dispatch({ type: "currency", payload })

        getAllData(payload)
    }

    /**Ejecuta el reporte de pago */
    const onReport = async () => {
        // Creamos la constante que tendra los datos preparados
        // Para enviar al backend
        const dataSend = []

        try {
            for (let index = 0; index < state.allData.length; index++) {
                // Obtenemos el hash de la fila
                const hash = hashs[index] === undefined ? "" : hashs[index]

                // Construimos el objeto que necesitara el backend para procesar el retiro
                const dataPush = { hash, ...state.allData[index] }

                // Se lo agregamos a la constante que enviaremos al backend
                dataSend.push(dataPush)
            }

            // Ejecutamos la peticion para ejecutar reporte
            const { data, status } = await Petition.post("/admin/payments/apply", { data: dataSend, id_currency: state.currency }, { headers })

            if (data.error) {
                throw String(data.message)
            }

            if (data.response && status === 200) {
                getAllData()

                Swal.fire("Reporte ejecutado", "Su reporte de pago ha sido recibido", "success")
            }

        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "warning")
        }
    }

    useEffect(() => {
        getAllData()
    }, [])

    return (
        <div className="container-report">
            <NavigationBar />

            <div className="content">
                <div className="header">
                    <input type="text" value={state.filter} onChange={e => dispatch({ type: "filter", payload: e.target.value })} className="text-input" placeholder="Filtrar.." />

                    <div className="selection">
                        <span className="total">
                            Total {state.total.toString()} {state.currency === 1 ? "BTC" : "ETH"}
                        </span>

                        <select disabled={state.loader} className="picker" value={state.currency} onChange={changeCurrency}>
                            <option value={1}>Bitcoin</option>
                            <option value={2}>Ethereum</option>
                        </select>

                        <button disabled={state.loader} className="button" onClick={onReport}>Enviar reporte</button>
                    </div>
                </div>

                {
                    state.loader &&
                    <ActivityIndicator size={64} />
                }

                {
                    (!state.loader && state.allData.length > 0) &&
                    <>

                        <div className="table">
                            <div className="header">
                                <span>Nombre</span>
                                <span>Monto</span>
                                <span>Wallet</span>
                                <span>hash</span>
                            </div>

                            {state.allData.map(ItemComponent)}
                        </div>
                    </>
                }


                {
                    (!state.loader && state.allData.length === 0) &&
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