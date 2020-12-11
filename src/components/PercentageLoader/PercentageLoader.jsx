import React, { useState, useEffect } from 'react'
import './PercentageLoader.scss'

// Import components
import Modal from '../Modal/Modal'


const PercentageLoader = ({ percentage = 0, data = 'namename', title = '' }) => {
    const [dotted, setDotted] = useState(0)

    useEffect(_ => {
        setDotted((dotted === 3 ? 0 : (dotted + 1)))
    }, [percentage])

    return (
        <Modal persist={true} onlyChildren>
            <div className="PercentageLoader">
                <h2>{title}{".".repeat(dotted)}</h2>

                <h3 className="list-content">{data}</h3>

                <div className="percentage">
                    <div className="value" style={{ width: `${percentage}%` }}></div>
                    <span className='percentage-label'>{percentage} %</span>
                </div>
            </div>
        </Modal>
    )
}

export default PercentageLoader