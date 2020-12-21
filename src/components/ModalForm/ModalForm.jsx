import React, { useState } from 'react'
import Modal from '../../components/Modal/Modal'
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'
import PasswordField from '../PasswordField/PasswordField'
import './ModalForm.scss'
import Swal from 'sweetalert2'

const ModalForm = ({ onClose, deleteKYC }) => {
  const [password, setPassword] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (password.length < 4)
      return Swal.fire({
        icon: 'error',
        title: 'Contraseña invalida',
        text: 'Ingrese una contraseña valida',
      })

    if (reason.length < 4)
      return Swal.fire({
        icon: 'error',
        title: 'Ingrese una razón valida',
        text: 'Ingrese una razón valida porque quiere deshabilitar este KYC',
      })
    deleteKYC(password, reason)
  }

  return (
    <Modal persist={true} onlyChildren>
      <div className="overlay">
        <div className="modal-form">
          <div className="close-modal">
            <CloseIcon className="icon" fill="#ffffff" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <h2 className="modal-title">Deshabilitar KYC</h2>
            <div className="modal-group ">
              <span className="modal-label">Ingrese la contraseña maestra</span>
              <PasswordField
                className="modal-value"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="modal-group ">
              <label className="modal-label" htmlFor="rason">
                ¿Porque quiere deshabilitar este KYC?
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="text-input full-width"
                rows="10"
              ></textarea>
            </div>

            <button type="submit" className="button large full-width">
              Deshabilitar KYC
            </button>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default ModalForm
