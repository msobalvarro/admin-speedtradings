import React, { useEffect, useCallback } from 'react'

// Import styles and asstes
import "./Modal.scss"

const Modal = ({ children, onClose = () => { } }) => {
    const onHandledCallback = useCallback(() => onClose(), [])

    useEffect(() => {
        document.body.style.overflow = "hidden"

        document.onkeyup = (key) => {
            if (key.code === "Escape") {
                onHandledCallback()
            }
        }

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