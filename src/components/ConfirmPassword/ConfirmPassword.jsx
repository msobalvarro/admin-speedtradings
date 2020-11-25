import React, { useState } from 'react'
import './ConfirmPassword.scss'

// Import components
import Modal from '../Modal/Modal'


const ConfirmPassword = ({ onSubmit = _ => { }, onCancel = _ => { } }) => {
    const [password, setPassword] = useState('')

    const onSubmitPassword = _ => {
        onSubmit(password)
        setPassword('')
    }

    return (
        <Modal persist={true} onlyChildren>
            <div className="confirm-password">
                <div className="row">
                    <span>Escribe tu Contraseña para continuar</span>

                    <input
                        value={password}
                        type="password"
                        autoFocus={true}
                        onKeyUp={e => (e.key === 'Enter' ? onSubmitPassword() : null)}
                        onChange={e => setPassword(e.target.value)}
                        className="text-input" />
                </div>

                <div className="buttons">
                    <button
                        className="button margin"
                        onClick={onCancel}>
                        Cancelar
                    </button>
                    <button
                        className="button secondary"
                        onClick={_ => onSubmitPassword()}>
                        Procesar
                </button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmPassword