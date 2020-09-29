import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import "./Comissions.scss"

// Import components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import Swal from "sweetalert2"

// Import utils
import { Petition, randomKey } from "../../utils/constanst"


const Comissions = () => {
    // Credenciales de acceso para realizar las peticiones
    const { token } = useSelector((storage) => storage.globalStorage)
    const header = {
        headers: {
            "x-auth-token": token
        }
    }

    // Estado para almacenar la lista  de comisiones
    const [data, setData] = useState([])

    // Estado para almacenar los datos de un detalle de comision
    const [dataDetail, setDataDetail] = useState({})

    // Estado para indicar sponsor se muestra en el detalle y así cambiar el color de su fila dentro de la tabla
    const [activeDetail, setActiveDetail] = useState(-1)

    // Estado para controlar la visibilidad del indicador de carga
    const [loaderList, setLoaderList] = useState(false)
    const [loaderDetail, setLoaderDetail] = useState(false)

    // Función para obtener los datos de la lista de comisiones
    const getComissionsData = async _ => {
        try {
            setLoaderList(true)

            const { data } = await Petition.get('/admin/comission', header)

            if(data.error) {
                throw String(data.message)
            }

            setData(data)
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error, 'error')
        } finally {
            setLoaderList(false)
        }
    }

    /**
     * Función para obetener los detalles de un sponsor
     * @param {Number} id - Id del sponsor 
     */
    const getComissionDetailData = async (id) => {
        try {
            setLoaderDetail(true)

            const { data } = await Petition.get(`/admin/comission/${id}`, header)

            if(data.error) {
                throw String(data.message)
            }

            setDataDetail(data)
            setActiveDetail(id)
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error, 'error')
        } finally {
            setLoaderDetail(false)
        }
    }

    useEffect(_ => {
        getComissionsData()
    }, [])

    return (
        <div className="Comissions">
            <NavigationBar/>

            <div className="Comissions-content">
                <div className="column Comissions-list">
                    <div className="Comissions-list-header">
                        <h2>Comisiones</h2>

                        <div>
                            <input type="text" placeholder="Escribe para buscar..." className="field-input"/>
                            <p>
                                <span className="pending">Pendiente</span>
                                <span>|</span>
                                <span className="ready">Listo para pagar</span>
                            </p>
                        </div>
                    </div>

                    {
                        loaderList &&
                        <ActivityIndicator size={46}/>
                    }

                    {
                        data.length === 0 && !loaderList &&
                        <p className="empty-detail">No hay comisiones para mostrar</p>
                    }

                    {
                        data.length > 0 && !loaderList &&
                        <div className="table">
                            <div className="header">
                                <span>Nombre</span>
                                <span>Moneda</span>
                                <span>Monto</span>
                                <span>Estado</span>
                            </div>
                            <div className="body">
                                {
                                    data.map(item => (
                                        <div
                                            key={randomKey()}
                                            onClick={_ => getComissionDetailData(item.id)}
                                            className={`row ${item.id === activeDetail ? 'active' : ''}`}>
                                            <span>{item.sponsor}</span>
                                            <span>{item.coin}</span>
                                            <span>{item.amount} {item.symbol}</span>
                                            <span className={item.active ? 'ready' : 'pending'}></span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>

                <div className="column Comissions-detail">
                    <h2>Vista previa de Sponsor</h2>
                    {
                        loaderDetail &&
                        <ActivityIndicator size={46}/>
                    }

                    {
                        Object.keys(dataDetail).length === 0 && !loaderDetail &&
                        <p className="empty-detail">No hay ningún elemento seleccionado</p>
                    }

                    {
                        Object.keys(dataDetail).length > 0 &&
                        <>
                            <div className="detail-item">
                                <span className="label">Nombre</span>
                                <span className="value">{dataDetail.name}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">Correo electrónico</span>
                                <span className="value">{dataDetail.email}</span>
                            </div>

                            <div className="detail-section">
                                <div className="column">
                                    <div className="detail-item">
                                        <span className="label">Monto</span>
                                        <span className="value">{dataDetail.amount} {dataDetail.symbol}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Comissión</span>
                                        <span className="value">
                                            {dataDetail.percertage} % | {dataDetail.comission_amount} {dataDetail.symbol}
                                        </span>
                                    </div>
                                </div>

                                <div className="column">
                                    <div className="detail-item">
                                        <span className="label">Moneda</span>
                                        <span className="value">{dataDetail.coin}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Estado</span>
                                        <span className={`value ${dataDetail.active ? 'ready' : 'pending'}`}>
                                            {
                                                dataDetail.status === 1
                                                ? 'Pagado'
                                                : 'Pendiente'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-item">
                                <span className="label">Wallet en {dataDetail.symbol}</span>
                                <span className="value hash">{dataDetail.wallet}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">Hash de transacción</span>
                                <input type="text" placeholder="Hash de transacción" className="value field-input"/>
                            </div>

                            <div className="detail-buttons">
                                <button className="decline">Rechazar &#10005;</button>
                                <button className="confirm">Aprobar &#10003;</button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Comissions