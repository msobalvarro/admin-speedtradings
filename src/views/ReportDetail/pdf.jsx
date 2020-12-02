import React from 'react'
import moment from 'moment'

import Logo from '../../static/images/logo.png'
import AlyLogo from '../../static/images/alysystem.png'

import { floor, randomKey, formatWallet } from '../../utils/constanst'

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
        padding: '0 1rem',
        marginBottom: '1rem'
    },

    logo: {
        width: '150px',
        objectFit: 'contain'
    },

    infoLabel: {
        textTransform: 'uppercase'
    },

    sectionTitle: {
        backgroundColor: '#D6DCE4',
        textAlign: 'center',
        textTransform: 'uppercase',
        padding: '.25rem 1rem',
        width: '100%',
        marginTop: '1rem'
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
        fontSize: '12px',
        padding: '.35rem .5rem',
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
        padding: '.5rem 0',
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: '2rem'
    },

    basicInfo: {},

    basicInfoItem: {
        ...baseStyle.flexHorizontal,
    }
}

// Elemento del la sección de información básica del cliente
const BasicInfoItem = ({ title, value, styleMain = {}, styleLabel = {}, styleValue = {} }) => (
    <p style={{ ...styleMain, padding: '.25rem 0' }}>
        <span style={{ ...style.infoLabel, ...styleLabel }}>{title}:</span>
        <strong style={{ ...styleValue }}>{value}</strong>
    </p>
)

const PDF = ({ duplicationPlan = [], commissions = [], info = {} }) => (
    <main style={{ backgroundColor: '#fff', color: '#2d2d2d', padding: '4rem 2rem' }}>
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
                    styleLabel={{ display: 'inline-block', width: '140px' }}
                    title='nombre'
                    value={info.name} />
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '140px' }}
                    title='producto'
                    value={info.product} />
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '140px' }}
                    title='criptomoneda'
                    value={info.criptocoin} />
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '140px' }}
                    title='billetera'
                    value={formatWallet(info.wallet)} />
            </div>

            <div style={baseStyle.flexVertical}>
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '120px' }}
                    title='fecha inicial'
                    value={info.startDate} />
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '120px' }}
                    title='fecha final'
                    value={info.cutoffDate} />
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '120px' }}
                    title='precio btc'
                    value={info.priceCoin} />
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '120px' }}
                    title='rango'
                    value={info.ranges} />
            </div>

            <div style={baseStyle.flexVertical}>
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '180px' }}
                    styleValue={{ display: 'inline-block', textAlign: 'right' }}
                    title='plan de inversión'
                    value={info.plan} />
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '180px' }}
                    title='total a duplicar'
                    value={info.duplicate_plan} />
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '180px' }}
                    title='saldo final en btc'
                    value={info.lastBalance} />
                <BasicInfoItem
                    styleLabel={{ display: 'inline-block', width: '180px' }}
                    title='no. referidos'
                    value={info.referred} />
            </div>
        </div>

        <h3 style={style.sectionTitle}>detalle de plan de inversión - duplicación</h3>

        {
            (_ => {
                let balancePrev = 0

                return (
                    <div style={style.table}>
                        <div style={{ ...style.tableRow, ...style.tableHeader }}>
                            <span style={style.tableColumn}>No. DÍA</span>
                            <span style={style.tableColumn}>FECHA</span>
                            <span style={style.tableColumn}>CÓDIGO</span>
                            <span style={style.tableColumn}>DESCRIPCIÓN</span>
                            <span style={style.tableColumn}>% DÍA</span>
                            <span style={style.tableColumn}>INT DIARIO</span>
                            <span style={style.tableColumn}>DÉBITO</span>
                            <span style={style.tableColumn}>CRÉDITO</span>
                            <span style={style.tableColumn}>BALANCE</span>
                        </div>
                        <div className="table-body">
                            {
                                duplicationPlan.map((item, index) => {
                                    if (index === 0) {
                                        balancePrev = item.balance
                                    } else {
                                        balancePrev = (balancePrev - item.debit + item.credit)
                                        item.balance = balancePrev
                                    }

                                    return (
                                        <div key={randomKey()} style={style.tableRow}>
                                            <span style={style.tableColumn}>
                                                {item.day_number}
                                            </span>
                                            <span style={style.tableColumn}>
                                                {moment(item.date).format('DD-MM-YYYY')}
                                            </span>
                                            <span style={style.tableColumn}>
                                                {item.codigo}
                                            </span>
                                            <span style={style.tableColumn}>
                                                {item.description}
                                            </span>
                                            <span style={style.tableColumn}>
                                                {floor(item.percentage, 3) ?? ''}
                                            </span>
                                            <span style={style.tableColumn}>
                                                {floor(item.daily_interest, 8)}
                                            </span>
                                            <span style={style.tableColumn}>
                                                {floor(item.debit, 8) ?? ''}
                                            </span>
                                            <span style={style.tableColumn}>
                                                {floor(item.credit, 8) ?? ''}
                                            </span>
                                            <span style={style.tableColumn}>
                                                {floor(item.balance, 8)}
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div style={style.tableFooter}>
                            <span
                                style={{
                                    textAlign: 'right',
                                    width: '100%',
                                }}>saldo final del mes</span>
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(100% / 9)',
                                    textAlign: 'center',
                                    marginLeft: '2rem'
                                }}>{floor(balancePrev, 8)}</span>
                        </div>
                    </div>
                )
            })()
        }

        <h3 style={style.sectionTitle}>detalle de pago de comisiones por referidos</h3>

        {
            (_ => {
                let sum = 0

                return (
                    <div style={style.table}>
                        <div style={{ ...style.tableHeader, ...style.tableRow }}>
                            <span style={style.tableColumnCommission}>FECHA</span>
                            <span style={style.tableColumnCommission}>CÓDIGO</span>
                            <span style={style.tableColumnCommission}>NOMBRE REFERIDO</span>
                            <span style={style.tableColumnCommission}>INVERSIÓN</span>
                            <span style={style.tableColumnCommission}>BONO BTC</span>
                            <span style={style.tableColumnCommission}>PRECIO BTC</span>
                            <span style={style.tableColumnCommission}>MONTO USD</span>
                        </div>
                        {
                            commissions.map(item => {
                                sum += item.fee_sponsor

                                return (
                                    <div key={randomKey()} style={style.tableRow}>
                                        <span style={style.tableColumnCommission}>{moment(item.registration_date).format('DD-MM-YYYY')}</span>
                                        <span style={style.tableColumnCommission}>{item.code}</span>
                                        <span style={style.tableColumnCommission}>{item.name}</span>
                                        <span style={style.tableColumnCommission}>{item.amount ?? 0}</span>
                                        <span style={style.tableColumnCommission}>{item.fee_sponsor ?? ''}</span>
                                        <span style={style.tableColumnCommission}>{item.price ?? 0}</span>
                                        <span style={style.tableColumnCommission}>{item.amountUSD ?? 0}</span>
                                    </div>
                                )
                            })
                        }
                        <div style={style.tableFooter}>
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
                                }}>$</span>
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(100% / 7)',
                                    textAlign: 'center',
                                }}>$</span>
                        </div>
                    </div>
                )
            })()
        }
    </main >
)

export default PDF