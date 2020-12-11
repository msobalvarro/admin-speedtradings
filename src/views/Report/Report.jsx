import React, { useEffect, useState, useReducer, useCallback } from "react"
import moment from "moment"
import { useSelector } from "react-redux"

// import constants and functions
import { Petition, copyData, reducer, downloadReport } from "../../utils/constanst"
import toastr from "toastr"
import _ from "lodash"

// Imports styles and assets
import "./Report.scss"
import astronaut from "../../static/images/astronaut.png"
import iconExcel from "../../static/images/excel.png"

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
    total: 0.00,

    // estado que renderiza el loader
    loader: false,

    loaderPayment: false,

    // estado que indica si el proceso de descarga exce
    loaderExcel: false,

    // Lista que guarda los datos renderizados
    allData: [],
}

const Report = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // Estado para almacenar las fechas de inicio/fin con las cual se generará el reporte
    const [reportFromDate, setReportFromDate] = useState(moment().format("YYYY-MM-DD"))
    const [reportToDate, setReportToDate] = useState(moment().format("YYYY-MM-DD"))
    const [creditAlyPay, setCreditAlypay] = useState({ btc: 0, eth: 0 })

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

            // obtenemos el reporte de pago
            const { data } = await Petition.get(`/admin/payments/${_currency}`, { headers })

            // verificamos si hay un error
            if (data.error) {
                throw data.message
            }

            /**Alamacenara temporalmente la suma de total a pagar */
            const sum = []

            // asignamos el reporte al estado
            dispatch({ type: "allData", payload: data })

            // Sumamos el total a pagar
            for (let index = 0; index < data.length; index++) {
                const element = data[index]

                sum.push(element.amount)
            }

            // sumamos el arreglo de monto con lodash
            const total = _.sum(sum)

            dispatch({ type: "total", payload: _.floor(total, 8) })

            // // obtenemos el saldo de alypay
            const { data: dataCredit } = await Petition.get("/admin/payments/credit-alypay", { headers })

            // verificamos si hay un error en la peticion
            if (dataCredit.error) {
                throw String(dataCredit.message)
            }

            setCreditAlypay(dataCredit)

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
                    <span className="copy-element" onClick={_ => copyData(item.amount)}>
                        {item.amount} {state.currency === 1 ? "BTC" : "ETH"}
                    </span>

                    {
                        item.comission === null
                            ? <span style={{ opacity: 0.5 }}>Sin Comisión</span>
                            : <span className="copy-element" onClick={_ => copyData(item.comission)}>{item.comission} {state.currency === 1 ? "BTC" : "ETH"}</span>
                    }

                    <span className="copy-element" onClick={_ => copyData(item.wallet)}>{item.wallet}</span>


                    {
                        item.hash !== null &&
                        <div onClick={_ => copyData(item.hash)} className="hash-transaction copy-element">{item.hash}</div>
                    }

                    {
                        item.hash === null &&
                        <>
                            {
                                // verificamos la wallet no es de alypay
                                item.alypay !== 1 &&
                                <input type="text" placeholder="Escriba hash de transaccion" className="text-input" onChange={e => hashs[index] = e.target.value} />
                            }


                            {
                                // verificamos si la wallet le pertenece a alypay
                                item.alypay === 1 &&
                                <span className="alypay-verified">AlyPay Verified</span>
                            }
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
    const onReport = useCallback(async (_password) => {
        // Creamos la constante que tendra los datos preparados
        // Para enviar al backend
        const dataSend = []

        try {
            dispatch({ type: "loaderPayment", payload: false })

            for (let index = 0; index < state.allData.length; index++) {
                const elementData = state.allData[index]

                if (hashs[index] === undefined) {
                    hashs[index] = ""
                }

                // Obtenemos el hash de la fila
                const hash = hashs[index] === undefined ? "" : hashs[index]

                // Construimos el objeto que necesitara el backend para procesar el retiro
                const dataPush = {
                    ...elementData,
                    paymented: elementData.hash !== null,
                    hash: (elementData.hash === null ? hash : elementData.hash)
                }

                // Se lo agregamos a la constante que enviaremos al backend
                dataSend.push(dataPush)
            }

            // Ejecutamos la peticion para ejecutar reporte
            const { data } = await Petition.post("/admin/payments/apply", { data: dataSend, id_currency: state.currency }, { headers })

            if (data.error) {
                throw String(data.message)
            }

            if (data.response === "success") {
                // Swal.fire("Reporte ejecutado", "Su reporte de pago ha sido recibido", "success")

                toastr.info("El reporte ha sido ejecutado", "Reporte", { positionClass: "toast-bottom-right" })


                // refrescamos los datos
                getAllData()
            }

        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "warning")
        } finally {
            dispatch({ type: "loaderPayment", payload: false })

        }
    }, [hashs])

    /**
     * Función para obtener el archivo .xls que será el reporte
     */
    const getReport = async _ => {
        try {
            const { data } = await Petition.get(`/admin/reports/payments?from=${reportFromDate}&to=${reportToDate}`, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Disposition': "attachment; filename=template.xlsx",
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    "x-auth-token": token
                }
            })

            if (data.error) {
                throw String(data.message)
            }

            downloadReport(data, `report-${reportFromDate}_${reportToDate}.xlsx`)
        } catch (error) {
            Swal.fire("Reporte de pagos", error.toString(), "error")
        }
    }

    /**
     * Metodo que descarga el reporte de pago de la semana en excel 
     */
    const downloadExcel = async _ => {
        try {
            dispatch({ type: "loaderExcel", payload: true })


            const { data } = await Petition.get("/admin/reports/payments/excel", {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Disposition': "attachment; filename=template.xlsx",
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    "x-auth-token": token
                }
            })

            // verificamos si hay algun error
            if (data.error) {
                throw String(data.message)
            }

            // procesamos el archivo a descargar
            downloadReport(data, `Reporte de pago.xlsx`)

            // notificamos
            toastr.info("Reporte generado", "", { positionClass: "toast-bottom-left" })

        } catch (error) {
            toastr.error(error.toString(), "Error al descargar")
        } finally {
            dispatch({ type: "loaderExcel", payload: false })
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

                    {/**
                    * Sección para generar los reportes
                    */}
                    <div className="reports">
                        <div className="row">
                            <span>Fecha de inicio</span>
                            <input
                                value={reportFromDate}
                                onChange={e => {
                                    setReportFromDate(e.target.value)
                                }}
                                type="date"
                                className="text-input" />
                        </div>

                        <div className="row">
                            <span>Fecha de final</span>
                            <input
                                value={reportToDate}
                                onChange={e => {
                                    setReportToDate(e.target.value)
                                }}
                                type="date"
                                className="text-input" />
                        </div>

                        <button onClick={getReport} className="button">Obtener reporte</button>
                    </div>

                    {
                        state.allData.length !== 0 &&
                        <div className="selection">
                            <div className="total-content">
                                <span className="total">
                                    Total {state.total.toString()} {state.currency === 1 ? "BTC" : "ETH"}
                                </span>

                                <span className="total-alypay">
                                    Saldo AlyPay {state.currency === 1 ? creditAlyPay.btc : creditAlyPay.eth} {state.currency === 1 ? "BTC" : "ETH"}
                                </span>
                            </div>


                            <select disabled={state.loaderPayment} className="picker" value={state.currency} onChange={changeCurrency}>
                                <option value={1}>Bitcoin</option>
                                <option value={2}>Ethereum</option>
                            </select>

                            {
                                !state.loaderPayment &&
                                <button disabled={state.loaderPayment} className="button" onClick={onReport}>Enviar reporte</button>
                            }


                            {
                                state.loaderPayment &&
                                <ActivityIndicator size={36} />
                            }
                        </div>
                    }

                </div>

                {
                    state.loader &&
                    <ActivityIndicator size={64} />
                }

                {
                    (!state.loader && state.allData.length > 0) &&
                    <div className="table">
                        <div className="header">
                            <span>Nombre</span>
                            <span>Monto Bruto</span>
                            <span>Monto con comisión</span>
                            <span>Wallet</span>
                            <span>hash</span>
                        </div>

                        {state.allData.map(ItemComponent)}

                        <span className="download-report" style={{ opacity: state.loaderExcel ? 0.6 : 1 }} onClick={state.loaderExcel ? false : downloadExcel}>
                            {
                                state.loaderExcel &&
                                <ActivityIndicator fill="#000" />
                            }

                            {
                                !state.loaderExcel &&
                                <img src={iconExcel} alt="Descargar reporte" title="Descargar reporte" />
                            }
                        </span>
                    </div>
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