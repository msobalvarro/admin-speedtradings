import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Petition } from "../../utils/constanst"

// Import components
import NavigationBar from "../../components/NavigationBar/NavigationBar"

// Import styles and assets
import "./Logs.scss"

const Logs = () => {
    const { token } = useSelector(store => store.globalStorage)
    const [dataLogs, setLogs] = useState([])
    const [filter, setFilter] = useState('')

    useEffect(() => {
        Petition.get("/logs", {
            headers: {
                "x-auth-token": token
            }
        })
            .then(({ data, status }) => {
                if (status === 200) {
                    // Verificamos si hay logs
                    if (data.length) {
                        setLogs(data.reverse())
                    } else {
                        setLogs([])
                    }
                }
            })
    }, [])

    return (
        <div className="container-logs">
            <NavigationBar />

            <div className="console">
                <div className="header">
                    <span>Logs for development - Backend</span>

                    <input
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        type="text"
                        placeholder="filtrar"
                        className="text-input" />
                </div>

                {
                    dataLogs.map((log, index) => {
                        if (log.length > 0 && log.toLowerCase().search(filter.toLocaleLowerCase()) > -1) {
                            return (
                                <div className="row" key={index}>
                                    <div className="line-number">{index + 1}</div>
                                    <span className="text-log">{log}</span>
                                </div>
                            )
                        } else {
                            return null
                        }
                    })
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