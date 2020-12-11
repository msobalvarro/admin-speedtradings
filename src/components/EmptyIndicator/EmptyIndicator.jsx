import React from "react"

// Import Asset
import Cactus from '../../static/images/cactus.png'

const EmptyIndicator = ({ message = '' }) => (
    <div className="empty">
        <img src={Cactus} alt="empty" />
        <h2 className="title">{message}</h2>
    </div>
)

export default EmptyIndicator