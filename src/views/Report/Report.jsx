import React, { useEffect, useState } from "react"
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
    // Contendra todos los hash escrios
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

    /**Token para ejecutar la petition */
    const headers = {
        "x-auth-token": token
    }

    /**Metodo para ejecutar consulta de registros */
    const getAllData = async (_currency = "1") => {
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

                        // Sumamos el total a pagar
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
            console.log(error)

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
                <div className="row" id={"row-" + index} key={index}>
                    <span>{item.name}</span>
                    <span>{item.amount} {currency === "1" ? "BTC" : "ETH"}</span>
                    <span className="copy-element" onClick={_ => copyData(item.wallet)}>{item.wallet}</span>

                    {
                        item.hash === null &&
                        <input type="text" placeholder="Escriba hash de transaccion" className="text-input" onChange={e => hashs[index] = e.target.value} />
                    }

                    {
                        item.hash !== null &&
                        <div onClick={_ => copyData(item.hash)} className="hash-transaction copy-element">
                            {item.hash}
                        </div>
                    }
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
        // Creamos la constante que tendra los datos preparados
        // Para enviar al backend
        const dataSend = []

        // Esta constante almacena el nombre de la clase
        // que da efecto a la fila resaltada cuando hay un error de hash
        const nameEffectResalt = "resalt"

        // debugger


        try {
            for (let index = 0; index < allData.length; index++) {
                // Obtenemos el hash de la fila
                const hash = hashs[index] === undefined ? "" : hashs[index]

                // creamos una contante de la fila del elemento hash
                const row = document.getElementById("row-" + index)

                // Verificamos si la columna mapeada no tiene hash
                if (hash === undefined) {
                    // Haremos un efecto de resaltado en esta misma columna
                    row.classList.add(nameEffectResalt)

                    row.scrollIntoView({ block: "center" })

                    // ejecutamos un focus en el elemento input de la fila
                    // esto servira al usuario como referencia en donde escribira
                    row.lastChild.focus()

                    // throw "Todos los hash son requeridos para esta operacion"

                    return
                } else {
                    // Aca ya validamos si tiene hash
                    // Quitaremoe el efecto `resalt` class
                    row.classList.remove(nameEffectResalt)
                }

                // Obtenemos los datos necesarios a ocupar de la lista actual
                const { id_investment, amount, name, email } = allData[index]

                // Construimos el objeto que necesitara el backend para procesar el retiro
                const dataPush = { id_investment, hash, amount, name, email }

                // Se lo agregamos a la constante que enviaremos al backend
                dataSend.push(dataPush)
            }

            // Ejecutamos la peticion para ejecutar reporte
            Petition.post("/admin/payments/apply", { data: dataSend, id_currency: Number(currency) }, { headers })
                .then(({ data, status }) => {
                    if (data.error) {
                        throw data.message
                    }

                    if (data.response && status === 200) {
                        getAllData()

                        Swal.fire("Reporte ejecutado", "Su reporte de pago ha sido recibido", "success")
                    }
                })
                .catch((reason) => {
                    throw reason
                })

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
                    <input type="text" value={filter} onChange={e => setFilter(e.target.value)} className="text-input" placeholder="Filtrar.." />

                    <div className="selection">
                        <span className="total">
                            Total {total.toString()} {currency === "1" ? "BTC" : "ETH"}
                        </span>

                        <select disabled={loader} className="picker" value={currency} onChange={changeCurrency}>
                            <option value="1">Bitcoin</option>
                            <option value="2">Ethereum</option>
                        </select>

                        <button disabled={loader} className="button" onClick={onReport}>Enviar reporte</button>
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