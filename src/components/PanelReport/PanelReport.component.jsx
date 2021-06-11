import React, { useState } from "react"

// import components
import { Link } from "react-router-dom"

// import styles and statics
import "./PanelReport.style.scss"

// Lista de rutas
const MenuList = [
    { label: "Reportes de Registro" },
    { label: "Reportes de Upgrades" },
    { label: "Reportes de Exchange" },
    { label: "Reportes de Money Changer" },
    { label: "Reportes de Comisiones" },
    { label: "Reportes de Transacciones" }
]

const PanelReport = ({ data = [], index = 0, onChange = _ => {} }) => {

    return (
        <div className="panel-report-menu">
            <h2 className="panel-report-component">Reportes Generales</h2>

            <div className="content-links">
                {data.map((i, k) => <div onClick={_ => onChange(k)} className={`item-list ${k === index ? "active" : ""}`} key={k}>{i.label}</div>)}
            </div>
        </div>
    )
}

export default PanelReport