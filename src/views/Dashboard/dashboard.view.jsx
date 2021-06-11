import React, { useState } from "react"

// import react navigation
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom'


// import components and sub-views
import Panel from "../../components/PanelReport/PanelReport.component"
import RegisterReport from "./Routes/register.part"
import UpgradesReport from "./Routes/upgrades.part"

// import assets and styles
import "./dashboard.style.scss"

// Lista de rutas
const MenuList = [
    { label: "Reportes de Registro", Component: RegisterReport },
    { label: "Reportes de Upgrades", Component: UpgradesReport },
    { label: "Reportes de Exchange" },
    { label: "Reportes de Money Changer" },
    { label: "Reportes de Comisiones" },
    { label: "Reportes de Transacciones" }
]

const Dashboard = () => {
    // estado que indica que tab esta activa
    const [index, setIndex] = useState(0)

    return (
        <div className="container-root-report">
            <Panel data={MenuList} active={index} onChange={setIndex} />

           {MenuList.map((l, i) => i === index && <l.Component key={i} />)}
        </div>
    )
}

export default Dashboard