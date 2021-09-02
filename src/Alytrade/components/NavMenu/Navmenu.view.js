import React from 'react'
import { useStyle } from './Navmenu.style'
//import alytradeLogo from '../../assets/img/Alytrade_Logo.svg'
import alytradeLogo from '../../assets/img/Logo-Business.png'
import { NavLink, useHistory } from 'react-router-dom'
const NavMenu = () => {
    const style = useStyle()
    const history = useHistory()
    return (
        <div className={style.container}>
            <div>
                <img src={alytradeLogo} height={50} width={80}/>
            </div>
            <div className={style.linksContainer}>
                <NavLink exact to='/at/' className={style.link} activeClassName={style.activeLink}>Ultimos Registros</NavLink >
                <NavLink exact to='/at/users/' className={style.link} activeClassName={style.activeLink}>Usuarios</NavLink >
                <NavLink exact to='/' className={style.link} >Regresar a ST</NavLink >
            </div>
        </div>
    )
}

export default NavMenu