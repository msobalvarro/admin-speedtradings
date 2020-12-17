import React, { useEffect, useRef, useState } from 'react'
import Modal from '../../components/Modal/Modal'
import { ReactComponent as CloseIcon } from '../../static/images/close.svg'
import { ReactComponent as RotateLeft } from '../../static/images/rotate-left.svg'
import { ReactComponent as RotateRight } from '../../static/images/rotate-right.svg'

import './ModalPhoto.scss'

const ModalPhoto = ({ onClose, image, title = '' }) => {
  const imageElement = useRef(null)
  const [angle, setAngle] = useState(0)

  const rotate = () => {
    imageElement.current.style.transform = `rotate(${angle}deg)`
  }

  useEffect(() => {
    rotate()
  }, [angle])

  return (
    <Modal persist={true} onlyChildren>
      <div className="overlay">
        <div className="modal-photo">
          <div className="close-modal">
            <CloseIcon className="icon" fill="#ffffff" onClick={onClose} />
          </div>

          <img
            ref={imageElement}
            className="modal-image"
            src={image}
            alt="Foto de perfil"
          />
          <div className="rotate-buttons">
            <RotateLeft
              fill="#fff"
              className="icon"
              onClick={() => {
                setAngle(prevAngle => prevAngle - 90)
              }}
            />
            <RotateRight
              fill="#fff"
              className="icon"
              onClick={() => {
                setAngle(prevAngle => prevAngle + 90)
              }}
            />
          </div>

          <p className="modal-title">{title}</p>
        </div>
      </div>
    </Modal>
  )
}

export default ModalPhoto
