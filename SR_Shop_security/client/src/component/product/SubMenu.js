import React from 'react'
import { Link } from 'react-router-dom'

function SubMenu() {
  return (
    <div className='submenu'>
      <Link to="/kindlist/1">Heels</Link>
      <Link to="/kindlist/2">Boots</Link>
      <Link to="/kindlist/3">Sandals</Link>
      <Link to="/kindlist/4">Sneakers</Link>
      <Link to="/kindlist/5">Sleepers</Link>
    </div>
  )
}

export default SubMenu
