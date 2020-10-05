import React, {useState} from 'react'
import './PasswordField.scss'

/**
 * 
 * @param {String} value - Estado que almacenará en dato ingresado por el usuario
 * @param {Callback} onChange - Función a ejecutar cuando se detecta un cambio en el dato ingresado por el usuario
 * @param {String} className - Clases css adicionales para el componente
 * @param {Object} rest - Resto de propiedades que puedan añadirse
 */
const PasswordField = ({value='', onChange=_=>{}, className='', ...rest}) => {
    // Estado que controla si se muestra o no la contraseña
    const [showPassword, setShowPassword] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)

    // Cambia el estado para mostrar la contraseña o no cuando se da click en el botón de mostrar
    const handlClickShowPassword = e => {
        e.preventDefault()
        setShowPassword(!showPassword)
    }
    
    // Función que escucha el evento invalid del input, y añade el indicador de error de ser necesario
    const handleInvalid = e => setIsInvalid(true)
    const handleFocus = e => setIsInvalid(false)

    return (
        <fieldset className={`PasswordField ${isInvalid ? 'invalid' : ''} ${className}`}>
            <input
                type={showPassword ? 'text' : 'password'}
                onInvalid={handleInvalid}
                onChange={onChange}
                onFocus={handleFocus}
                value={value} {...rest} className='PasswordField-input' />

            <div onClick={handlClickShowPassword} title='Mostrar contraseña' className={!showPassword ? '' : 'hide'}></div>
        </fieldset>
    )
}

export default PasswordField