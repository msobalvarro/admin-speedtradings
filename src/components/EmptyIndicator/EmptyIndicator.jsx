import React from "react"

// Import Asset
import Astronaut from '../../static/images/astronaut.png'

const EmptyIndicator = ({ message='' }) => (
    <div className="empty">
        <img src={Astronaut} alt="empty" />
        <h2 className="title">{message}</h2>
    </div>
)

export default EmptyIndicator