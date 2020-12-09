import React, { useState, useEffect } from 'react'
import './PercentageLoader.scss'

// Import components
import Modal from '../Modal/Modal'


const PercentageLoader = ({ percentage = 0, data = 'namename', title = '' }) => {
    const [dotted, setDotted] = useState(0)

    useEffect(_ => {
        window.setTimeout(_ => setDotted((dotted === 3 ? 0 : (dotted + 1))), 1000)
    }, [dotted])
    return null
    return (
        <Modal persist={true} onlyChildren>
            <div className="PercentageLoader">
                <h2>{title}{".".repeat(dotted)}</h2>

                <div className="list-content">
                    {data}
                </div>

                <div className="percentage">
                    <div className="value" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        </Modal>
    )
}

export default PercentageLoader