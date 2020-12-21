import React from 'react'
import Modal from '../../components/Modal/Modal'

import './ModalPDF.scss'
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'

const ModalPDF = ({ onClose, pdf }) => {
  return (
    <Modal persist={true} onlyChildren>
      <div className="overlay">
        <div className="modal-pdf">
          <div className="close-modal">
            <CloseIcon className="icon" fill="#ffffff" onClick={onClose} />
          </div>

          <object
            data={pdf}
            type="application/pdf"
            alt=""
            className="content-pdf"
            scale="noScale"
          ></object>
        </div>
      </div>
    </Modal>
  )
}

export default ModalPDF
