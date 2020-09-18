import React, { useState, useEffect } from 'react'
import { useParams, withRouter } from 'react-router-dom'
import './ReportDetail.scss'

// assets
import Logo from '../../static/images/logo.png'
import Astronaut from '../../static/images/astronaut.png'
import {dataBasicInfo, dataCommissions, dataInverstmentPlan} from './data'


const EmptyMessage = ({title}) => (
    <div className="empty-message">
        <img src={Astronaut} alt=""/>
        <h3>{title}</h3>
    </div>
)


// Elemento del la sección de información básica del cliente
const BasicInfoItem = ({title, value}) => (
    <p className='section--item'>
        <span>{title}</span>
        <strong>{value}</strong>
    </p>
)

// Renderiza la sección de la información básica del cliente
const BasicInfo = ({data}) => {
return( 
    <div className='ReportDetail-basicInfo'>
        <div className='ReportDetail-bacicInfo__section'>
            <BasicInfoItem title='nombre' value={data.name}/>
            <BasicInfoItem title='producto' value={data.product}/>
            <BasicInfoItem title='criptomoneda' value={data.coin}/>
            <BasicInfoItem title='billetera' value={data.wallet}/>
        </div>

        <div>
            <BasicInfoItem title='fecha inicial' value={data.startDate}/>
            <BasicInfoItem title='fecha final' value={data.lastDate}/>
            <BasicInfoItem title='precio btc' value={data.priceCoin}/>
            <BasicInfoItem title='rango' value={data.range}/>
        </div>

        <div>
            <BasicInfoItem title='plan de inversión' value={data.inverstmentPlan}/>
            <BasicInfoItem title='total a duplicar' value={data.totalDuplication}/>
            <BasicInfoItem title='saldo final en btc' value={data.lastPriceCoin}/>
            <BasicInfoItem title='no. referidos' value={data.nSponsors}/>
        </div>
    </div>
)}

// Renderizado para cada columna de la tabla de planes de inversión
const inverstmentPlanItem = (item, index) => (
    <div key={index} className='row'>
        <span>{ item.day }</span>
        <span>{ item.date }</span>
        <span>{ item.code }</span>
        <span>{ item.description }</span>
        <span>{ item.rendiment ?? ''  }</span>
        <span>{ item.int ?? '' }</span>
        <span>{ item.debit ?? '' }</span>
        <span>{ item.credit ?? '' }</span>
        <span>{ item.balance }</span>
    </div>
) 

// Renderizado para cada columna de la tabla de comisiones
const commissionItem = (item, index) => (
    <div key={index} className='row'>
        <span>{ item.date }</span>
        <span>{ item.code }</span>
        <span>{ item.sponsoredName }</span>
        <span>{ item.inverstment ?? ''  }</span>
        <span>{ item.bono ?? '' }</span>
        <span>{ item.price ?? '' }</span>
        <span>{ item.amountUSD ?? '' }</span>
    </div>
)

// Renderizado para cada columna de la tabla de resumen
const summaryItem = (item, index) => (
    <div key={index} className="row">
        <span>{item.code}</span>
        <span>{item.moviment}</span>
        <span>{item.count}</span>
        <span>{item.coinAmount}</span>
        <span>$ {item.usdAmount}</span>
    </div>
)


// vista de los reportes
const ReportDetail = ({history}) => {
    const [commissionsBTC, setCommissionsBTC] = useState([])
    const [commissionsETH, setCommissionsETH] = useState([])
    const [summary, setSummary] = useState([])

    // Estado para controlar la pestaña que se muestra dentro de la vista de reportes
    const [tab, setTab] = useState(1)
    const { id } = useParams()

    // Variables para almacenar la lista de los montos para cada tipo de comisión
    const amountCommissionBTC = { coin: [], usd: [] }
    const amountCommissionETH = { coin: [], usd: [] }

    const onClickTab = ({e, tabNumber}) => {
        e.preventDefault()
        setTab(tabNumber)
    }

    useEffect(_ => {
        setCommissionsBTC(dataCommissions.filter(item => item.code === 'CBTC'))
        setCommissionsETH(dataCommissions.filter(item => item.code === 'CETH'))
    }, [])

    useEffect(_ => {
        // Variable donde se almecenará la data del resumen antes de asignarle al estado
        const summaryData = [];

        ['INV', 'NCR', 'INT', 'RET'].forEach(item => {
            // Lista de transacciones que pertencen a la código actual
            const result = dataInverstmentPlan.filter(subitem => (subitem.code === item))

            let coinAmount = 0,
                usdAmount = 0,
                moviment = ''

            switch (item.toLowerCase()) {
                case 'inv':
                case 'ncr':
                    coinAmount = result.map(item => item.credit).reduce((a, b) => (a + b), 0)
                    usdAmount = result.map(item => (item.credit * 1)).reduce((a, b) => (a + b), 0)
                    moviment = (item.toLowerCase() === 'inv') ? 'INVERSIÓN' : 'CRÉDITO DUPLICACIÓN'
                    break

                case 'int':
                    coinAmount = result.map(item => item.int).reduce((a, b) => (a + b), 0)
                    usdAmount = result.map(item => (item.int * dataBasicInfo.priceCoin)).reduce((a, b) => (a + b), 0)
                    moviment = 'INTERÉS DEL DÍA'
                    break

                case 'ret':
                    coinAmount = result.map(item => item.debit).reduce((a, b) => (a + b), 0)
                    usdAmount = result.map(item => (item.debit * dataBasicInfo.priceCoin)).reduce((a, b) => (a + b), 0)
                    moviment = 'RETIRO A WALLET'
                    break

                default:
                    return
                    break
            }

            let response = {
                code: item,
                count: result.length,
                moviment,
                coinAmount,
                usdAmount
            }

            summaryData.push(response)
        })

        // Guradando los datos del resumen en el estado
        setSummary(summaryData)
    }, [])

    return (
        <div className='ReportDetail'>
            <header className='ReportDetail-header'>
                <img src={Logo} alt=""/>

                <nav className="navigation">
                    <span onClick={ e => onClickTab({e, tabNumber: 1}) } className={tab === 1 ? 'active' : ''}>
                        Plan de inversión
                    </span>

                    <span onClick={ e => onClickTab({e, tabNumber: 2}) } className={tab === 2 ? 'active' : ''}>
                        Comisiones referidos
                    </span>

                    <span onClick={ e => onClickTab({e, tabNumber: 3}) } className={tab === 3 ? 'active' : ''}>
                        Resumen transacciones
                    </span>
                </nav>
            </header>

            <BasicInfo data={dataBasicInfo}/>

            {
                tab === 1 &&
                <>
                    <h2 className="title">DETALLE DE PLAN DE INVERSIÓN - DUPLICACIÓN</h2>

                    {
                        dataInverstmentPlan.length > 0 &&
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
                                    dataInverstmentPlan.map(inverstmentPlanItem)
                                }
                            </div>
                            <div className="table-footer">
                                <span>saldo final del mes</span>
                                <span>{dataInverstmentPlan[dataInverstmentPlan.length - 1].balance}</span>
                            </div>
                        </div>
                    }

                    {
                        dataInverstmentPlan.length === 0 &&
                        <EmptyMessage title="Sin comisiones de referidos para mostrar"/>
                    }
                </>
            }

            {
                // Sección del reporte de la comisiones
                tab === 2 &&
                <>
                    <h2 className="title">DETALLE DE PAGO DE COMISIONES POR REFERIDOS</h2>

                    {
                        commissionsBTC.length > 0 &&
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
                                    commissionsBTC.map((item, index) => {
                                        amountCommissionBTC.coin.push(item.bono)
                                        amountCommissionBTC.usd.push(item.amountUSD)

                                        return commissionItem(item, index)
                                    })
                                }
                            </div>
                            <div className="table-footer">
                                <span>total de comisiones por referidos del mes</span>
                                <span>{ amountCommissionBTC.coin.reduce((a,b) => (a + b), 0) }</span>
                                <span></span>
                                <span>{ amountCommissionBTC.usd.reduce((a,b) => (a + b), 0) }</span>
                            </div>
                        </div>
                    }

                    {
                        commissionsETH.length > 0 &&
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
                                        amountCommissionETH.coin.push(item.bono)
                                        amountCommissionETH.usd.push(item.amountUSD)
                                        
                                        return commissionItem(item, index)
                                    })
                                }
                            </div>
                            <div className="table-footer">
                                <span>total de comisiones por referidos del mes</span>
                                <span>{ amountCommissionETH.coin.reduce((a,b) => (a + b), 0) }</span>
                                <span></span>
                                <span>{ amountCommissionETH.usd.reduce((a,b) => (a + b), 0) }</span>
                            </div>
                        </div>
                    }

                    {
                        commissionsBTC.length === 0 && commissionsETH.length === 0 &&
                        <EmptyMessage title="Sin comisiones de referidos para mostrar"/>
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
        </div>
    )
}

export default withRouter(ReportDetail)