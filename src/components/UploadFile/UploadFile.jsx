import React, { useEffect, useRef, useState } from 'react'
import './UploadFile.scss'

// Import assets
import { ReactComponent as UploadIcon } from '../../static/images/upload.svg'

// Import utils
import { randomKey } from '../../utils/constanst'


const UploadFile = ({ onChange = _ => { }, accept = "*" }) => {
    // Estado para establecer si el usuario está haciendo uso del drag
    const [dragging, setDragging] = useState(false)

    // Estado que almacena el archivo actual que fue seleccionado
    const [currentFile, setCurrentfile] = useState(null)

    const uploadFileRef = useRef(null)
    let dragCounter = 0

    const componentKey = randomKey()

    // Función que encapsula las anulaciones por defecto de los eventos
    const resetBaseEvents = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    // Detecta cuando el usuario está arrastrando un archivo
    const handleDragIn = (e) => {
        resetBaseEvents(e)
        dragCounter++

        // Se detecta sí el usuario está arrastrando un archivo
        if (e.dataTransfer && e.dataTransfer.items.length > 0) {
            setDragging(true)
        }
    }

    // Detecta cuando el usuario deja de arrastrar el archivo
    const handleDragOut = (e) => {
        resetBaseEvents(e)
        dragCounter--
        if (dragCounter > 0) return

        setDragging(false)
    }

    // Captura el archivo arrastrado hasta la caja de selección
    const handleDrop = (e) => {
        resetBaseEvents(e)

        setDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setCurrentfile(e.dataTransfer.files[0])
            dragCounter = 0
        }
    }

    const handleDrag = (e) => {
        resetBaseEvents(e)
    }

    /**
     * Cada vez que el usuario inicia un nuevo arrastre, se limpian del buffer los
     * archivos anteriores
     * @param {Event} e 
     */
    const handleDragStart = (e) => {
        resetBaseEvents(e)
        e.dataTransfer.clearData()
    }


    useEffect(() => {
        // Getting the current reference for UploadFile node
        const currentUploadFile = uploadFileRef.current

        currentUploadFile.addEventListener('dragenter', handleDragIn)
        currentUploadFile.addEventListener('dragleave', handleDragOut)
        currentUploadFile.addEventListener('dragover', handleDrag)
        currentUploadFile.addEventListener('dragstart', handleDragStart)
        currentUploadFile.addEventListener('drop', handleDrop)

        return () => {
            currentUploadFile.removeEventListener('dragenter', handleDragIn)
            currentUploadFile.removeEventListener('dragleave', handleDragOut)
            currentUploadFile.removeEventListener('dragover', handleDrag)
            currentUploadFile.removeEventListener('dragstart', handleDragStart)
            currentUploadFile.removeEventListener('drop', handleDrop)
        }
    }, [])

    useEffect(_ => {
        if (currentFile !== null) {
            onChange(currentFile)
            console.log(currentFile)
        }
    }, [currentFile])

    return (
        <label ref={uploadFileRef} className={`UploadFile ${dragging ? 'active' : ''}`}>
            <UploadIcon className='UploadFile-icon' />

            {
                currentFile === null &&
                <p className='UploadFile-legend'>
                    <strong>Seleccione un archivo</strong> o arrástrelo aquí
                </p>
            }

            {
                currentFile !== null &&
                <p className="UploadFile-legend">
                    {currentFile.name}
                </p>
            }

            <input
                onChange={e => setCurrentfile(e.target.files[0])}
                style={{ display: 'none' }}
                type="file"
                accept={accept}
                id={componentKey} />
        </label>
    )
}

export default UploadFile