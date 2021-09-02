import moment from 'moment'
import React from 'react'
import { useStyle as useMainStyle } from '../../views/Main/useMain.style'
import useFindUsers from './useFindUsers.hook'
import { ReactComponent as EnterpriseImage } from '../../../static/images/enterprise.svg'
import { ReactComponent as UserImage } from '../../../static/images/user.svg'
import KYCPerson from '../../../views/KYCPerson/KYCPerson'
import KYCEnterprise from '../../../views/KYCEnterprise/KYCEnterprise'

const FindUsers = () => {
    const mainStyle = useMainStyle()
    const { users, onRowClick, investments, currencyMap,
        onChangeInvestmentSelect, interest, plan, userIndex,
        user, investment, onKYCClickChangePage, page, showKYC,
        onFindClick, onUserInputChange, usernameInput,
        backPage, nextPage, usernamePage
    } = useFindUsers()

    const buildNameValue = (name, value) => {
        return <div className={mainStyle.detailsRow}>
            <span className={mainStyle.name}>{name}</span>
            <span className={mainStyle.value}>{value}</span>
        </div>
    }

    const loadKycImage = (kycType) => {
        if (kycType == 1)
            return <UserImage fill='#ffcb08' style={{ width: '16px', height: '16px' }} />
        if (kycType == 2)
            return <EnterpriseImage fill='#ffcb08' style={{ width: '16px', height: '16px' }} />
    }

    const showKYCForm = () => {

        let kycForm = <> </>
        console.log(user)
        if (user.kyc_type == 1)
            kycForm = <KYCPerson
                id={user.id}
                onClickChangePage={onKYCClickChangePage}
            />
        else
            kycForm = <KYCEnterprise
                id={user.id}
                onClickChangePage={onKYCClickChangePage}
            />
        return kycForm
    }

    const showListUser = () => {
        return <div className={mainStyle.panelContainer}>
            <div className={mainStyle.panel}>
                <div style={{ display: 'flex', padding: '10px' }}>
                    <div>
                        <span className={mainStyle.name}>Username </span>
                        <input onChange={onUserInputChange} value={usernameInput} className={mainStyle.input} />
                        <button onClick={onFindClick} className={mainStyle.button}>Buscar</button>
                    </div>
                </div>

                <table className={mainStyle.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Inversiones</th>
                            <th>KYC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((item, index) => {
                            return <tr key={index} onClick={() => onRowClick(index)}>
                                <td>{item.username}</td>
                                <td>{item.investments.length}</td>
                                <td>{loadKycImage(item.kyc_type)}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <div style={{textAlign:'center'}}>
                    <button className={mainStyle.button} onClick={backPage}>{'<<'}</button>
                    <span style={{marginLeft:'10px',marginRight:'10px'}} className={mainStyle.name}>{usernamePage + 1}</span>
                    <button className={mainStyle.button} onClick={nextPage}>{'>>'}</button>
                </div>
            </div>
            <div className={mainStyle.panel} style={{ padding: '1rem' }}>
                {user ? <>
                    <div className={mainStyle.detailsContainer}>
                        <div className={mainStyle.detailsColumn}>
                            {buildNameValue('Nombre', `${user.information_user.firstname} ${user.information_user.lastname}`)}
                        </div>
                        <div className={mainStyle.detailsColumn}>
                            {buildNameValue('Correo', `${user.information_user.email}`)}
                        </div>
                    </div>


                    {investments.length === 0 ? <h2>No hay inversiones</h2> : <>
                        <label className={mainStyle.name}>Inversiones</label><br />
                        <select className={mainStyle.select} onChange={onChangeInvestmentSelect}>
                            {investments.map((item, index) => {
                                return <option key={index} value={index} label={moment(item?.start_date).format('YYYY-MM-DD') + ' / ' + item?.amount + currencyMap[item?.id_currency]?.symbol} />
                            })}
                        </select>
                        <div className={mainStyle.detailsContainer}>
                            <div className={mainStyle.detailsColumn}>
                                {buildNameValue('Monto', `${investment.amount} ${currencyMap[investment?.id_currency]?.symbol}`)}
                                {buildNameValue('Fecha', `${moment(investment.start_date).format('YYYY-MM-DD HH:MM:SS')}`)}
                                {buildNameValue('Hash', `${investment.hash}`)}
                            </div>
                            <div className={mainStyle.detailsColumn}>
                                {buildNameValue('Porcentaje', `${investment?.plan?.percentage}`)}
                                {buildNameValue('Meses', `${investment?.plan?.months}`)}
                                {buildNameValue('Wallet', `${investment?.plan?.wallet}`)}
                            </div>
                        </div>

                        <table className={mainStyle.table}>
                            <thead>
                                <tr>
                                    <th>Monto Interes</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interest?.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{item.amount}</td>
                                        <td>{item.date}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </>}
                    <button className={mainStyle.button} onClick={showKYC}>Mostrar KYC</button>
                </> : ''}
            </div>
        </div>
    }

    return (<>
        {
            page == 1 ?
                showListUser()
                :
                showKYCForm()
        }

    </>)
}

export default FindUsers