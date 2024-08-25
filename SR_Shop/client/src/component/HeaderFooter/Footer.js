import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className='footer' style={{width:"100%" , textAlign:"center", padding:"20px"}}>
      <hr/>
      <div id ="copy">
        All content Copyright 2021 HJKang.co Inc. all rights reserved<br/>
        Contact mail : abc@abc.com Tel : +82 02 1234 1234 Fax : +82 02 1233 1233 &nbsp;
        <Link to="http://localhost:3001">admin</Link>
      </div>
    </div>
  )
}

export default Footer
