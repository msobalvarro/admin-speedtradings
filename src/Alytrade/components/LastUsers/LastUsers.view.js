import React from 'react'
import { useStyle as useMainStyle } from '../../views/Main/useMain.style'
import useLastUsers from './useLastUsers.hook'

const LastUsers = () => {
    const mainStyle = useMainStyle()
    const { users, onRowClick, selected, currencyMap } = useLastUsers()

    const buildNameValue = (name, value) => {
        return <div className={mainStyle.detailsRow}>
            <span className={mainStyle.name}>{name}</span>
            <span className={mainStyle.value}>{value}</span>
        </div>
    }

    return (<div className={mainStyle.panelContainer}>
        <div className={mainStyle.panel}>
            <table className={mainStyle.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Monto Inversion</th>
                        <th>Sponsor</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((item, index) => {
                        return <tr key={index} onClick={() => onRowClick(index)}>
                            <td>{item.firstname}</td>
                            <td>{`${item.amount} ${currencyMap[item.id_currency]?.symbol || ''}`}</td>
                            <td>{item.sponsor || <i>Sin Sponsor</i>}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
        <div className={mainStyle.panel} style={{ padding: '1rem' }}>
            {selected ? <> <h2 style={{marginBottom:'2rem'}}>Detalles de Registro</h2>
                <div className={mainStyle.detailsContainer}>
                    <div className={mainStyle.detailsColumn}>
                        {buildNameValue('Nombre', `${selected.firstname} ${selected.lastname}`)}
                        {buildNameValue('Correo', `${selected.email}`)}
                        {buildNameValue('Hash', `${selected.hash}`)}
                    </div>
                    <div className={mainStyle.detailsColumn}>
                        {buildNameValue('Monto', `${selected.amount} ${currencyMap[selected.id_currency]?.symbol || ''}`)}
                    </div>
                </div> </> : ''}
        </div>
    </div>)
}

export default LastUsers