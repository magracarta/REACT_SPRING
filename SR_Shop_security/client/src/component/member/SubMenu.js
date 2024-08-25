import React from 'react'
import { Link } from 'react-router-dom'

function SubMenu() {
  return (
    <div className='submenu'>
      <Link to="">LOGIN</Link>
      <Link to="">JOIN</Link>
      <Link to="">LOGOUT</Link>
    </div>
  )
}

export default SubMenu
