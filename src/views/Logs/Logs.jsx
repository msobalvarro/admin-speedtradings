import React, { useEffect, useState } from "react"
import { Petition } from "../../utils/constanst"

// Import styles and assets
import "./Logs.scss"

const Logs = () => {
    const [dataLogs, setLogs] = useState([])
    const [dataHistory, setHistory] = useState([])
    const [filter, setFilter] = useState('')

    const getAllPetition = async () => {
        const { data } = await Petition.get("/logs")

        // verificamos si hay un error
        if (data.error) {
            console.log(data.message)
        }

        // verificamo si hay logs
        if (data.logs.length) setLogs(data.logs)

        // verifcamos si hay datos de historico de acciones
        if (data.actions.length) setHistory(data.actions)
    }

    useEffect(() => {
        getAllPetition()
    }, [])

    return (
        <div className="container-logs">
            <div className="console">
                <div className="header">
                    <span>Acciones de usuario</span>
                </div>

                {
                    dataHistory.map((log, index) => (
                        <div className="row" key={index}>
                            <div className="line-number">{index + 1}</div>
                            <span className="text-log">{log}</span>
                        </div>
                    ))
                }

                {
                    dataHistory.length === 0 &&
                    <h2 className="empty">No se encontraron LOGS</h2>
                }
            </div>

            <div className="console">
                <div className="header">
                    <span>Logs for development - Backend</span>
                </div>

                {
                    dataLogs.map((log, index) => (
                        <div className="row" key={index}>
                            <div className="line-number">{index + 1}</div>
                            <span className="text-log">{log}</span>
                        </div>
                    ))
                }

                {
                    dataLogs.length === 0 &&
                    <h2 className="empty">No se encontraron LOGS</h2>
                }
            </div>
        </div>
    )
}

export default Logs