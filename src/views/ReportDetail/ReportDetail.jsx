import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import moment from 'moment'
import jsPDF from 'jspdf'
import './ReportDetail.scss'

// import constants
import {
    useQueryParams,
    Petition,
    floor,
    randomKey,
    formatWallet,
    WithDecimals
} from '../../utils/constanst'

// import components
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'
import Modal from '../../components/Modal/Modal'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import PDF from './pdf'
import { ReactComponent as PdfIcon } from '../../static/images/pdf.svg'


// Elemento del la sección de información básica del cliente
const BasicInfoItem = ({ title, value }) => (
    <p className='section--item'>
        <span>{title}</span>
        <strong>{value}</strong>
    </p>
)

// Renderiza la sección de la información básica del cliente
const BasicInfo = ({ data, coinType = 1 }) => {
    return (
        <div className='ReportDetail-basicInfo'>
            <div className='ReportDetail-bacicInfo__section'>
                <BasicInfoItem title='nombre' value={data.name} />
                <BasicInfoItem title='producto' value={data.product} />
                <BasicInfoItem title='criptomoneda' value={data.criptocoin} />
                <BasicInfoItem title='billetera' value={formatWallet(data.wallet)} />
            </div>

            <div>
                <BasicInfoItem
                    title='fecha inicial'
                    value={moment(data.startDate).format('DD MMMM YYYY')} />
                <BasicInfoItem
                    title='fecha final'
                    value={moment(data.cutoffDate).format('DD MMMM YYYY')} />
                <BasicInfoItem
                    title={`precio ${coinType === 1 ? 'btc' : 'eth'}`}
                    value={`$ ${WithDecimals(floor(data.price, 8))}`} />
                <BasicInfoItem title='rango' value={data.ranges} />
            </div>

            <div>
                <BasicInfoItem title='plan de inversión' value={floor(data.plan, 8)} />
                <BasicInfoItem title='total a duplicar' value={floor(data.duplicate_plan, 8)} />
                <BasicInfoItem
                    title={`saldo final en ${coinType === 1 ? 'btc' : 'eth'}`}
                    value={data.lastBalance} />
                <BasicInfoItem title='no. referidos' value={data.referred} />
            </div>
        </div>
    )
}

// Renderizado para cada columna de la tabla de planes de inversión
const inverstmentPlanItem = (item) => (
    <div key={randomKey()} className='row'>
        <span>{item.day_number}</span>
        <span>{moment(item.date).format('DD-MM-YYYY')}</span>
        <span>{item.codigo}</span>
        <span>{item.description}</span>
        <span>{floor(item.percentage, 3) ?? ''}</span>
        <span>{floor(item.daily_interest, 8)}</span>
        <span>{floor(item.debit, 8) ?? ''}</span>
        <span>{floor(item.credit, 8) ?? ''}</span>
        <span>{floor(item.balance, 8)}</span>
    </div>
)

// Renderizado para cada columna de la tabla de comisiones
const commissionItem = (item) => {
    const sponsorAmount = item.fee_sponsor * item.amount
    const sponsorAmountUsd = sponsorAmount * item.price_coin

    return (
        <div key={randomKey()} className='row'>
            <span>{moment(item.registration_date).format('DD-MM-YYYY')}</span>
            <span>{item.code}</span>
            <span>{item.name}</span>
            <span>{floor(item.amount, 8) ?? 0}</span>
            <span>{floor(sponsorAmount, 8) ?? ''}</span>
            <span>$ {floor(item.price_coin, 8) ?? 0}</span>
            <span>$ {floor(sponsorAmountUsd, 8) ?? 0}</span>
        </div>
    )
}

// Renderizado para cada columna de la tabla de resumen
const summaryItem = (item) => (
    <div key={randomKey()} className="row">
        <span>{item.code}</span>
        <span>{item.moviment}</span>
        <span>{item.count}</span>
        <span>{floor(item.amount, 8)}</span>
        <span>$ {floor(item.amount * item.price, 8)}</span>
    </div>
)


// vista de los reportes
const ReportDetail = () => {
    const { token } = useSelector(storage => storage.globalStorage)
    const credentials = {
        headers: {
            'x-auth-token': token
        }
    }

    const { id } = useParams()
    const QueryParams = useQueryParams()
    const [loader, setLoader] = useState(false)

    // Estados para los datos del reporte
    const [headerInfoBTC, setHeaderInfoBTC] = useState({})
    const [headerInfoETH, setHeaderInfoETH] = useState({})

    const [duplicationPlanBTC, setDuplicationPlanBTC] = useState([])
    const [duplicationPlanETH, setDuplicationPlanETH] = useState([])

    const [commissionsBTC, setCommissionsBTC] = useState([])
    const [commissionsETH, setCommissionsETH] = useState([])

    const [summary, setSummary] = useState([])

    // Estado para controlar la pestaña que se muestra dentro de la vista de reportes
    const [tab, setTab] = useState(1)
    const [coinType, setCoinType] = useState(1)

    // Variables para almacenar la lista de los montos para cada tipo de comisión
    const amountCommissionBTC = { coin: [], usd: [] }
    const amountCommissionETH = { coin: [], usd: [] }

    const pdfRef = useRef(null)

    // Obtiene los datos del reporte
    const fetchData = async _ => {
        try {
            setLoader(true)

            // Calcula la fecha de reporte a enviar al servidor 
            const dateReport = moment(QueryParams.get('date')).format('YYYY-MM-DD')

            const dataSend = {
                id,
                date: dateReport
            }

            const { data } = await Petition.post('/admin/reports-users', dataSend, credentials)

            if (data.error) {
                throw String(data.message)
            }

            // Se extraen los planes del usuario
            const { bitcoin, ethereum } = data

            // Se carga la información general de cada plan
            setHeaderInfoBTC({
                ...bitcoin.info,
                product: 'Plan de inversión - Duplicación',
                lastBalance: 0
            })

            setHeaderInfoETH({
                ...ethereum.info,
                product: 'Plan de inversión - Duplicación',
                lastBalance: 0
            })

            // Se cargan los planes de cuplicación para las monedas
            setDuplicationPlanBTC(bitcoin.duplicationPlan)
            setDuplicationPlanETH(ethereum.duplicationPlan)

            // Se cargan los pagos de comisiones realizados
            setCommissionsBTC(bitcoin.commissionPayment)
            setCommissionsETH(ethereum.commissionPayment)
        } catch (error) {
            console.error(error)
        } finally {
            setLoader(false)
        }
    }

    // Cambia la entre las pestañas de los reportes
    const onClickTab = ({ e, tabNumber }) => {
        e.preventDefault()
        setTab(tabNumber)
    }

    // Obtiene el contenido del reporte 
    const onPrintReport = _ => {
        const content = pdfRef.current
        const reportContent = `
        <html>
            <head>
                <style>
                    @media print {
                        html, body {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 795px !important;
                            max-width: 795px !important;
                        }
                        main {
                            -webkit-print-color-adjust: exact !important;
                        }

                        table {
                            page-break-before: auto;
                        }
                    }

                    @page:first {
                        padding-bottom: 10mm
                    }
                </style>
            </head>
            <body>${content.innerHTML}</body>
        </html>`

        // Abre una ventana en modo impresión para almacenar el pdf
        const printWindow = window.open('', '', 'height=400,width=800')
        printWindow.document.write(reportContent)
        printWindow.document.close()
        printWindow.print()
        printWindow.close()
    }

    // Obtiene el headerInfo según la moneda seleccionada
    const getCurrentHeaderInfo = _ => (coinType === 1)
        ? headerInfoBTC
        : headerInfoETH

    // Obtiene el duplicationPlan según la moneda seleccionada
    const getCurrentDuplicationPlan = _ => (coinType === 1)
        ? duplicationPlanBTC
        : duplicationPlanETH

    // Obtiene los pagos de la comisiones según la moneda seleccionada
    const getCurrentCommissions = _ => (coinType === 1)
        ? commissionsBTC
        : commissionsETH

    // Invoca la petición al server
    useEffect(_ => {
        fetchData()
    }, [id, QueryParams.get('date')])

    /**
     * Calcula la info del resumen según la moneda seleccionada
     */
    useEffect(_ => {
        const _data = getCurrentDuplicationPlan()
        const { price } = getCurrentHeaderInfo()

        // Extrae los intereses de los datos obtenidos
        const summaryInt = _data.filter(item => item.codigo === 'INT')
        const summaryRet = _data.filter(item => item.codigo === 'RET')
        const summaryInv = _data.filter(item => item.codigo === 'INV')
        const summaryNcr = _data.filter(item => item.codigo === 'NCR')

        setSummary([
            {
                code: "INT",
                moviment: "interes del dia",
                count: summaryInt.length,
                amount: summaryInt.reduce((prev, item) => prev + item.daily_interest, 0),
                price
            },
            {
                code: "RET",
                moviment: "retiro a wallet",
                count: summaryRet.length,
                amount: summaryRet.reduce((prev, item) => prev + item.debit, 0),
                price
            },
            {
                code: "INV",
                moviment: "inversion",
                count: summaryInv.length,
                amount: summaryInv.reduce((prev, item) => prev + item.credit, 0),
                price
            },
            {
                code: "NCR",
                moviment: "credito duplicaciom",
                count: summaryNcr.length,
                amount: summaryNcr.reduce((prev, item) => prev + item.credit, 0),
                price
            },
        ])
    }, [coinType, duplicationPlanETH, duplicationPlanBTC])

    return (
        <div className='ReportDetail'>
            <button className="btn-pdf" onClick={_ => onPrintReport()}>
                <PdfIcon />
            </button>

            <header className='ReportDetail-header'>
                <nav className="navigation">
                    <span onClick={e => onClickTab({ e, tabNumber: 1 })} className={tab === 1 ? 'active' : ''}>
                        Plan de inversión
                    </span>

                    <span onClick={e => onClickTab({ e, tabNumber: 2 })} className={tab === 2 ? 'active' : ''}>
                        Comisiones referidos
                    </span>

                    <span onClick={e => onClickTab({ e, tabNumber: 3 })} className={tab === 3 ? 'active' : ''}>
                        Resumen transacciones
                    </span>
                </nav>

                <div className="row">
                    <span className="label">Moneda</span>
                    <select
                        value={coinType}
                        onChange={e => setCoinType(parseInt(e.target.value))}
                        className="picker">
                        <option value="1">Bitcoin</option>
                        <option value="2">Ethereum</option>
                    </select>
                </div>
            </header>

            <BasicInfo data={getCurrentHeaderInfo()} coinType={coinType} />

            {
                tab === 1 &&
                <>
                    <h2 className="title">DETALLE DE PLAN DE INVERSIÓN - DUPLICACIÓN</h2>

                    {
                        getCurrentDuplicationPlan().length > 0 &&
                        <>
                            {
                                (_ => {
                                    let balancePrev = 0

                                    return (
                                        <div className="table">
                                            <div className="table-head">
                                                <span>No. DÍA</span>
                                                <span>FECHA</span>
                                                <span>CÓDIGO</span>
                                                <span>DESCRIPCIÓN</span>
                                                <span>% DÍA</span>
                                                <span>INT DIARIO</span>
                                                <span>DÉBITO</span>
                                                <span>CRÉDITO</span>
                                                <span>BALANCE</span>
                                            </div>
                                            <div className="table-body">
                                                {
                                                    getCurrentDuplicationPlan().map((item, index) => {
                                                        /**
                                                         * Sí es el primer elemento, se
                                                         * registra valor del balance
                                                         * inicial
                                                         */
                                                        if (index === 0) {
                                                            balancePrev = item.balance
                                                        } else {
                                                            /**
                                                             * Se calcula el nuevo valor
                                                             * del balance, luego de los
                                                             * movimientos del día
                                                             */
                                                            balancePrev = (balancePrev - item.debit + item.credit)

                                                            /**
                                                             * Se actualiza el monto del
                                                             * balance según los calculos
                                                             * previos
                                                             */
                                                            item.balance = balancePrev
                                                        }

                                                        return inverstmentPlanItem(item)
                                                    })
                                                }
                                            </div>
                                            <div className="table-footer">
                                                <span>saldo final del mes</span>
                                                <span>{floor(balancePrev, 8)}</span>
                                            </div>
                                        </div>
                                    )
                                })()
                            }
                        </>
                    }
                </>
            }

            {
                // Sección del reporte de la comisiones
                tab === 2 &&
                <>
                    <h2 className="title">DETALLE DE PAGO DE COMISIONES POR REFERIDOS</h2>

                    {
                        commissionsBTC.length > 0 && coinType === 1 &&
                        <div className="table commissions">
                            <div className="table-head">
                                <span>FECHA</span>
                                <span>CÓDIGO</span>
                                <span>NOMBRE REFERIDO</span>
                                <span>INVERSIÓN</span>
                                <span>BONO BTC</span>
                                <span>PRECIO BTC</span>
                                <span>MONTO USD</span>
                            </div>
                            <div className="table-body">
                                {
                                    commissionsBTC.map((item) => {
                                        const sponsorAmount = item.fee_sponsor * item.amount

                                        const sponsorAmountUsd = sponsorAmount * item.price_coin

                                        amountCommissionBTC.coin.push(sponsorAmount)
                                        amountCommissionBTC.usd.push(sponsorAmountUsd)

                                        return commissionItem(item)
                                    })
                                }
                            </div>
                            <div className="table-footer">
                                <span>total de comisiones por referidos del mes</span>
                                <span>{floor(amountCommissionBTC.coin.reduce((a, b) => (a + b), 0), 8)}</span>
                                <span></span>
                                <span>$ {floor(amountCommissionBTC.usd.reduce((a, b) => (a + b), 0), 8)}</span>
                            </div>
                        </div>
                    }

                    {
                        commissionsETH.length > 0 && coinType === 2 &&
                        <div className="table commissions">
                            <div className="table-head">
                                <span>FECHA</span>
                                <span>CÓDIGO</span>
                                <span>NOMBRE REFERIDO</span>
                                <span>INVERSIÓN</span>
                                <span>BONO ETH</span>
                                <span>PRECIO ETH</span>
                                <span>MONTO USD</span>
                            </div>
                            <div className="table-body">
                                {
                                    commissionsETH.map((item, index) => {
                                        const sponsorAmount = item.fee_sponsor * item.amount

                                        const sponsorAmountUsd = sponsorAmount * item.price_coin

                                        amountCommissionETH.coin.push(sponsorAmount)
                                        amountCommissionETH.usd.push(sponsorAmountUsd)

                                        return commissionItem(item, index)
                                    })
                                }
                            </div>
                            <div className="table-footer">
                                <span>total de comisiones por referidos del mes</span>
                                <span>{floor(amountCommissionETH.coin.reduce((a, b) => (a + b), 0), 8)}</span>
                                <span></span>
                                <span>$ {floor(amountCommissionETH.usd.reduce((a, b) => (a + b), 0), 8)}</span>
                            </div>
                        </div>
                    }
                </>
            }

            {
                tab === 3 &&
                <>
                    <h2 className="title">RESUMEN DE TRANSACCIONES</h2>

                    <div className="table summary">
                        <div className="table-head">
                            <span>CÓDIGO</span>
                            <span>MOVIMIENTO</span>
                            <span>CANT</span>
                            <span>MONTO BTC</span>
                            <span>MONTO USD</span>
                        </div>
                        <div className="table-body">
                            {
                                summary.map(summaryItem)
                            }
                        </div>
                    </div>
                </>
            }

            {
                loader &&
                <Modal persist={true} onlyChildren>
                    <ActivityIndicator size={64} />
                </Modal>
            }

            <div ref={pdfRef} style={{ display: 'none' }}>
                <PDF
                    duplicationPlan={getCurrentDuplicationPlan()}
                    commissions={getCurrentCommissions()}
                    summary={summary}
                    info={getCurrentHeaderInfo()} />
            </div>
        </div>
    )
}

export default React.memo(ReportDetail)

export {
    inverstmentPlanItem
}