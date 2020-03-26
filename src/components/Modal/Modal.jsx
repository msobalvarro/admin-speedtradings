import React, { useEffect } from 'react'

// Import styles and asstes
import "./Modal.scss"

const Modal = ({ children, onClose = () => { } }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])

    return (
        <div className="modal">
            <div className="background-modal" onClick={onClose} />

            <div className="container">
                {children}
            </div>
        </div>
    )
}

export default Modal