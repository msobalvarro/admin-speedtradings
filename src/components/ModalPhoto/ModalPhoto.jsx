import React from 'react'
import Modal from '../../components/Modal/Modal'
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'

import './ModalPhoto.scss'

const ModalPhoto = ({ onClose, image, title = '' }) => {
  return (
    <Modal persist={true} onlyChildren>
      <div className="overlay">
        <div className="modal-container">
          <div className="button-container">
            <CloseIcon className="icon" fill="#ffffff" onClick={onClose} />
          </div>

          <img className="modal-image" src={image} alt="Foto de perfil" />
          <p className="modal-title">{title}</p>
        </div>
      </div>
    </Modal>
  )
}

export default ModalPhoto
