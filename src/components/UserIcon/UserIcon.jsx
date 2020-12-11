import React from 'react'
// Import icons
import { ReactComponent as PersonIcon } from '../../static/images/user.svg'
import { ReactComponent as EnterpriseIcon } from '../../static/images/enterprise.svg'

const PERSON_TYPE = 1
const ENTERPRISE_TYPE = 2

//retornar el icono del tipo de usuario
const UserIcon = ({ type, color = '#ffcb08', className = 'icon' }) => {
  if (!type) return ''

  return (
    <>
      {type === PERSON_TYPE ? (
        <PersonIcon className={className} fill={color} />
      ) : (
        <EnterpriseIcon className={className} fill={color} />
      )}
    </>
  )
}

export default UserIcon
