import React from 'react'
import { useStyle } from './useMain.style'
import AlytradeRouter from '../../routes'
import { Navmenu } from '../../components'
const Main = () => {
    const style = useStyle()
    return (<div className={style.container}>
        <div>
            <Navmenu/>
        </div>
        <div>
            <AlytradeRouter/>
        </div>
    </div>)
}

export default Main