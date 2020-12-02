import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import './DetailRecords.scss'

// import utils
import { Petition, copyData } from '../../utils/constanst'

// Import components
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'


const DetailRecords = ({ id = -1, dateReport = '' }) => {
    const { token } = useSelector(storage => storage.globalStorage)
    const credentials = {
        headers: {
            'x-auth-token': token
        }
    }

    const [data, setData] = useState({})
    const [loader, setLoader] = useState(false)

    const fetchDetail = async _ => {
        try {
            setLoader(true)

            const { data: dataDetail } = await Petition.post('/admin/records/id', { id }, credentials)

            if (dataDetail.error) {
                throw String(dataDetail.message)
            }

            setData(dataDetail)
        } catch (error) {
            console.error(error)
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    useEffect(_ => {
        if (id !== -1) {
            fetchDetail()
        }
    }, [id])

    return (
        <div className="DetailRecords">
            {
                loader &&
                <ActivityIndicator size={48} />
            }

            {
                !loader && id === -1 &&
                <EmptyIndicator message='Sin usuario para mostrar' />
            }

            {
                !loader && Object.keys(data).length > 0 &&
                <>
                    <h2>Detalles</h2>
                    <div className="content-col">
                        <div className="container">
                            <div className="col">
                                <div className="row">
                                    <span className="name">Nombre</span>
                                    <span className="value">{data.name}</span>
                                </div>

                                <div className="row">
                                    <span className="name">Correo</span>
                                    <span className="value">{data.email}</span>
                                </div>


                                <div className="row">
                                    <span className="name">Pais</span>
                                    <span className="value">{data.country}</span>
                                </div>

                                <div className="row">
                                    <span className="name">Telefono</span>
                                    <span className="value">{data.phone}</span>
                                </div>

                                <div className="row color">
                                    <span className="name">Sponsor</span>
                                    {
                                        data.email_sponsor !== null &&
                                        < span className="value">{data.email_sponsor}</span>
                                    }

                                    {
                                        data.email_sponsor === null &&
                                        < span className="value">
                                            <i>SIN SPONSOR</i>
                                        </span>
                                    }
                                </div>

                            </div>

                            <div className="col">
                                <div className="rows border-bottom">
                                    <div className="row">
                                        <span className={`status ${data.amount_btc !== null ? 'active' : 'inactive'}`}>
                                            {data.amount_btc !== null ? 'Activo' : 'Inactivo'}
                                        </span>
                                        <h2>Plan en Bitcoin</h2>
                                    </div>

                                    <div className="row">
                                        <span className="name">Monto Actual</span>
                                        {
                                            data.amount_btc !== null
                                                ? <span className="value">{data.amount_btc} BTC</span>
                                                : <span className="value"> <i>SIN MONTO</i> </span>
                                        }
                                    </div>

                                    <div className="row">
                                        <span className="name">Wallet</span>
                                        <span className="value copy" onClick={_ => copyData(data.wallet_btc)}>{data.wallet_btc}</span>
                                    </div>
                                </div>

                                <div className="rows border-bottom">
                                    <div className="row">
                                        <span className={`status ${data.amount_eth !== null ? 'active' : 'inactive'}`}>
                                            {data.amount_eth !== null ? 'Activo' : 'Inactivo'}
                                        </span>
                                        <h2>Plan en Ethereum</h2>
                                    </div>

                                    <div className="row">
                                        <span className="name">Monto Actual</span>
                                        {
                                            data.amount_eth !== null
                                                ? <span className="value">{data.amount_eth} ETH</span>
                                                : <span className="value"> <i>SIN MONTO</i> </span>
                                        }
                                    </div>

                                    <div className="row">
                                        <span className="name">Wallet</span>
                                        <span className="value copy" onClick={_ => copyData(data.wallet_eth)}>{data.wallet_eth}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="buttons">
                        <Link
                            to={`/reports/${data.id}?date=${dateReport}`}
                            target={"_blank"}
                            className="button large secondary">
                            Generar Reporte
                        </Link>
                    </div>
                </>
            }
        </div>
    )
}

export default DetailRecords