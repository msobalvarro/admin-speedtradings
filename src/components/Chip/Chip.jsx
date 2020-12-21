import React from 'react'
import './Chip.scss'
import { ReactComponent as Warning } from '../../static/images/warning.svg'

const Chip = ({ text = 'Sin datos' }) => {
  return (
    <div className="Chip">
      <Warning className="chip-icon" fill="#c0392b" />
      <span className="chip-text">{text}</span>
    </div>
  )
}

export default Chip
