import React from 'react'
import './Chip.scss'
import { ReactComponent as Warning } from '../../static/images/warning.svg'

const Chip = ({ text = 'Sin datos', required = true }) => {
  if (required)
    return (
      <div className="Chip">
        <Warning className="chip-icon" fill="#c0392b" />
        <span className="chip-text">{text}</span>
      </div>
    )

  return (
    <div>
      <span>{text}</span>
    </div>
  )
}

export default Chip
