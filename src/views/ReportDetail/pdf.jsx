import React from 'react'
import moment from 'moment'

// Import assets
import AlyLogo from '../../static/images/alysystem.png'
import IconLogo from '../../static/images/speedtradings-icon.png'
import Logo from '../../static/images/logo.png'

import {
    floor,
    randomKey,
    formatWallet,
    WithDecimals
} from '../../utils/constanst'

// Estilos de los elementos
const baseStyle = {
    flexHorizontal: {
        display: 'flex',
        flexDirection: 'row'
    },

    flexVertical: {
        display: 'flex',
        flexDirection: 'column'
    },
}

const style = {
    header: {
        ...baseStyle.flexHorizontal,
        justifyContent: 'space-between',
        backgroundColor: '#203764',
        padding: '0 4mm',
        marginBottom: '4mm'
    },

    logo: {
        width: '3cm',
        objectFit: 'contain'
    },

    infoLabel: {
        textTransform: 'uppercase',
        fontSize: '9pt'
    },

    sectionTitle: {
        backgroundColor: '#D6DCE4',
        textAlign: 'center',
        textTransform: 'uppercase',
        padding: '1mm 0',
        width: '100%',
        marginTop: '4mm',
        fontSize: '10pt'
    },

    table: {
        ...baseStyle.flexVertical,
        width: '100%'
    },

    tableHeader: {
        backgroundColor: '#7B7B7B',
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },

    tableRow: {
        ...baseStyle.flexHorizontal,
        justifyContent: 'space-evenly',
        flexGrow: 1,
        borderTop: '1px solid #2d2d2d',
        borderLeft: '1px solid #2d2d2d'
    },

    tableColumn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        width: 'calc(100% / 9)',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: '9pt',
        padding: '1mm 2mm',
        borderRight: '1px solid #2d2d2d'
    },

    get tableColumnCommission() {
        return {
            ...this.tableColumn,
            width: 'calc(100% / 7)'
        }
    },

    tableFooter: {
        ...baseStyle.flexHorizontal,
        justifyContent: 'space-evenly',
        backgroundColor: '#7B7B7B',
        padding: '2mm 0',
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: '8mm',
        width: '100%'
    },

    basicInfoItem: {
        ...baseStyle.flexHorizontal,
    },

    summarySection: {
        ...baseStyle.flexHorizontal,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },

    summaryTable: {
        width: 'calc(calc(210mm - 16mm) - 16mm - 19mm)'
    },

    summaryImage: {
        width: '100px',
        height: '100px',
        borderRadius: '100px',
        objectFit: 'contain',
        margin: '4mm'
    }
}

// Elemento del la sección de información básica del cliente
const BasicInfoItem = ({ title, value, styleMain = {}, styleLabel = {}, styleValue = {} }) => (
    <p style={{ ...styleMain, padding: '0' }}>
        <span style={{ ...style.infoLabel, ...styleLabel }}>{title}:</span>
        <strong style={{ ...styleValue, fontSize: '9pt' }}>{value}</strong>
    </p>
)

const PDF = ({
    duplicationPlan = [],
    commissions = [],
    summary = [],
    info = {}
}) => (
        <main style={{ backgroundColor: '#fff', color: '#2d2d2d', padding: '12px 6px', width: '210mm' }}>

            {/**
             * Cabecera con los datos generales del reporte
             */}
            <header style={style.header}>
                <img src={Logo} alt='' style={style.logo} />

                <img src={AlyLogo} alt='' style={style.logo} />
            </header>

            <div
                style={{
                    ...baseStyle.flexHorizontal,
                    justifyContent: 'space-between'
                }}>
                <div style={baseStyle.flexVertical}>
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '27mm' }}
                        title='nombre'
                        value={info.name} />
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '27mm' }}
                        title='producto'
                        value={info.product} />
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '27mm' }}
                        title='criptomoneda'
                        value={info.criptocoin} />
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '27mm' }}
                        title='billetera'
                        value={formatWallet(info.wallet)} />
                </div>

                <div style={baseStyle.flexVertical}>
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '25mm' }}
                        title='fecha inicial'
                        value={moment(info.startDate).format('DD MMMM YYYY')} />
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '25mm' }}
                        title='fecha final'
                        value={moment(info.cutoffDate).format('DD MMMM YYYY')} />
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '25mm' }}
                        title='precio btc'
                        value={`$ ${WithDecimals(floor(info.price, 8))}`} />
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '25mm' }}
                        title='rango'
                        value={info.ranges} />
                </div>

                <div style={baseStyle.flexVertical}>
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '35mm' }}
                        styleValue={{ display: 'inline-block', textAlign: 'right' }}
                        title='plan de inversión'
                        value={info.plan} />
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '35mm' }}
                        title='total a duplicar'
                        value={floor(info.duplicate_plan, 8)} />
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '35mm' }}
                        title='saldo final en btc'
                        value={info.lastBalance} />
                    <BasicInfoItem
                        styleLabel={{ display: 'inline-block', width: '35mm' }}
                        title='no. referidos'
                        value={info.referred} />
                </div>
            </div>

            <h3 style={style.sectionTitle}>detalle de plan de inversión - duplicación</h3>

            {
                (_ => {
                    let balancePrev = 0

                    /**
                     * Tabla con los planes de duplicación
                     */
                    return (
                        <table className='table' style={style.table}>
                            <thead >
                                <tr className='table-row' style={{
                                    ...style.tableRow,
                                    ...style.tableHeader
                                }}>
                                    <td
                                        style={{
                                            ...style.tableColumn,
                                            width: '65px'
                                        }}>No. DÍA</td>
                                    <td style={{
                                        ...style.tableColumn,
                                        width: '120px'
                                    }}>FECHA</td>
                                    <td style={{
                                        ...style.tableColumn,
                                        width: '65px'
                                    }}>CÓDIGO</td>
                                    <td style={{
                                        ...style.tableColumn,
                                        width: '150px'
                                    }}>DESCRIPCIÓN</td>
                                    <td style={style.tableColumn}>% DÍA</td>
                                    <td style={style.tableColumn}>INT DIARIO</td>
                                    <td style={style.tableColumn}>DÉBITO</td>
                                    <td style={style.tableColumn}>CRÉDITO</td>
                                    <td style={style.tableColumn}>BALANCE</td>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {
                                    duplicationPlan.map((item, index) => {
                                        if (index === 0) {
                                            balancePrev = item.balance
                                        } else {
                                            balancePrev = (balancePrev - item.debit + item.credit)
                                            item.balance = balancePrev
                                        }

                                        return (
                                            <tr className={index % 25 === 0 ? 'page-break' : ''} key={randomKey()} style={style.tableRow}>
                                                <td style={{
                                                    ...style.tableColumn,
                                                    width: '65px'
                                                }}>
                                                    {item.day_number}
                                                </td>
                                                <td style={{
                                                    ...style.tableColumn,
                                                    width: '120px'
                                                }}>
                                                    {moment(item.date).format('DD-MM-YYYY')}
                                                </td>
                                                <td style={{
                                                    ...style.tableColumn,
                                                    width: '65px'
                                                }}>
                                                    {item.codigo}
                                                </td>
                                                <td style={{
                                                    ...style.tableColumn,
                                                    width: '150px'
                                                }}>
                                                    {item.description}
                                                </td>
                                                <td style={style.tableColumn}>
                                                    {floor(item.percentage, 3) ?? ''}
                                                </td>
                                                <td style={style.tableColumn}>
                                                    {floor(item.daily_interest, 8)}
                                                </td>
                                                <td style={style.tableColumn}>
                                                    {floor(item.debit, 8) ?? ''}
                                                </td>
                                                <td style={style.tableColumn}>
                                                    {floor(item.credit, 8) ?? ''}
                                                </td>
                                                <td style={style.tableColumn}>
                                                    {floor(item.balance, 8)}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                            <tfoot style={{ width: '100%' }}>
                                <tr style={{ display: 'block', width: '100%' }}>
                                    <td style={style.tableFooter}>
                                        <span
                                            style={{
                                                textAlign: 'right',
                                                paddingRight: '2rem',
                                                width: 'calc(calc(100% / 9) * 8)',
                                            }}>saldo final del mes</span>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: 'calc(100% / 9)',
                                                textAlign: 'center'
                                            }}>{floor(balancePrev, 8)}</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    )
                })()
            }

            <h3 style={style.sectionTitle}>detalle de pago de comisiones por referidos</h3>

            {
                (_ => {
                    let sum = 0
                    let sumUsd = 0

                    /**
                     * Tabla con los pagos de las comisiones
                     */
                    return (
                        <table className='table' style={style.table}>
                            <thead>
                                <tr className='table-row' style={{
                                    ...style.tableHeader,
                                    ...style.tableRow,
                                    backgroundColor: ' #C0392B'
                                }}>
                                    <td style={style.tableColumnCommission}>FECHA</td>
                                    <td style={style.tableColumnCommission}>CÓDIGO</td>
                                    <td style={style.tableColumnCommission}>NOMBRE REFERIDO</td>
                                    <td style={style.tableColumnCommission}>INVERSIÓN</td>
                                    <td style={style.tableColumnCommission}>BONO BTC</td>
                                    <td style={style.tableColumnCommission}>PRECIO BTC</td>
                                    <td style={style.tableColumnCommission}>MONTO USD</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    commissions.map((item, index) => {
                                        const sponsorAmount = (item.fee_sponsor * item.amount)

                                        const sponsorAmountUsd = (sponsorAmount * item.price_coin)

                                        sum += sponsorAmount
                                        sumUsd += sponsorAmountUsd

                                        return (
                                            <tr key={randomKey()} className={index % 25 === 0 ? 'page-break' : ''} style={style.tableRow}>
                                                <td style={style.tableColumnCommission}>{moment(item.registration_date).format('DD-MM-YYYY')}</td>

                                                <td style={style.tableColumnCommission}>{item.code}</td>

                                                <td style={style.tableColumnCommission}>{item.name}</td>

                                                <td style={style.tableColumnCommission}>{floor(item.amount, 8) ?? 0}</td>

                                                <td style={style.tableColumnCommission}>{floor(sponsorAmount, 8) ?? ''}</td>

                                                <td style={style.tableColumnCommission}>$ {floor(item.price_coin, 8) ?? 0}</td>

                                                <td style={style.tableColumnCommission}>$ {floor(sponsorAmountUsd, 8) ?? 0}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                            <tfoot style={{ width: '100%' }}>
                                <tr style={{ display: 'block', width: '100%' }}>
                                    <td style={{
                                        ...style.tableFooter,
                                        backgroundColor: '#C0392B'
                                    }}>
                                        <span
                                            style={{
                                                textAlign: 'right',
                                                width: 'calc(calc(100% / 7) * 4)',
                                                paddingRight: '2rem'
                                            }}>saldo final del mes</span>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: 'calc(100% / 7)',
                                                textAlign: 'center',
                                            }}>{floor(sum, 8)}</span>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: 'calc(100% / 7)',
                                                textAlign: 'center',
                                            }}></span>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: 'calc(100% / 7)',
                                                textAlign: 'center',
                                            }}>$ {floor(sumUsd, 8)}</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    )
                })()
            }

            <section style={style.summarySection}>
                <article style={style.summaryTable}>
                    <h3 style={{ ...style.sectionTitle, width: 'calc(calc(210mm - 16mm) - 16mm - 19mm)' }}>resumen de transacciones</h3>

                    <table className='table' style={{ ...style.table, borderBottom: '1px solid #000', width: 'calc(calc(210mm - 16mm) - 16mm - 19mm)' }}>
                        <thead>
                            <tr className='table-row' style={{
                                ...style.tableRow,
                                ...style.tableHeader,
                                backgroundColor: '#2E8B12'
                            }}>
                                <td style={style.tableColumn}>CÓDIGO</td>
                                <td style={style.tableColumn}>MOVIMIENTO</td>
                                <td style={style.tableColumn}>CANT</td>
                                <td style={style.tableColumn}>MONTO BTC</td>
                                <td style={style.tableColumn}>MONTO USD</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                summary.map((item, index) => {
                                    return (
                                        <tr key={randomKey()} className={index % 25 === 0 ? 'page-break' : ''} style={style.tableRow}>
                                            <td style={style.tableColumn}>
                                                {item.code}
                                            </td>
                                            <td style={style.tableColumn}>
                                                {item.moviment}
                                            </td>
                                            <td style={style.tableColumn}>
                                                {item.count}
                                            </td>
                                            <td style={style.tableColumn}>
                                                {floor(item.amount, 8)}
                                            </td>
                                            <td style={style.tableColumn}>
                                                $ {floor(item.amount * item.price, 8)}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </article>

                <img style={style.summaryImage} src={IconLogo} alt="" />
            </section>

            <section style={{
                ...baseStyle.flexHorizontal,
                justifyContent: 'space-evenly',
                marginTop: '2rem'
            }}>
                <p>
                    <span style={{ marginRight: '2mm' }}>Visítanos</span>
                    <a href="https://www.alysystem.com/">www.alysystem.com</a>
                </p>
                <p>
                    <span style={{ marginRight: '2mm' }}>Correo Soporte</span>
                    <a href="dashboard@speedtradings-bank.com">dashboard@speedtradings-bank.com</a>
                </p>
            </section>
        </main >
    )

export default React.memo(PDF)