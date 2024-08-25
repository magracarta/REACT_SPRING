import axios from 'axios';
import React, { useState } from 'react'
import "../../style/admin.css";

function Admin() {
    const [adminid , setAdminid ] = useState("");
    const [pwd , setPwd ] = useState("");

    function onLogin(){
        axios.post('/api/admin/login', { adminid, pwd })
        .then((result)=>{
            
        }).catch((err)=>{console.error(err)});
    }

    return (
        <div className='AdminForm'>
            <h2>Admin LogIn</h2>
            <div className="field">
                <label>Admin ID</label>
                <input type="text" value={adminid} onChange={(e)=>{
                    setAdminid( e.currentTarget.value );
                }}/>
            </div>
            <div className="field">
                <label>Password</label>
                <input type="password" value={pwd} onChange={(e)=>{
                    setPwd( e.currentTarget.value );
                }}/>
            </div>
            <div className="btns">
                <button onClick={()=>{ onLogin(); }}>로그인</button>
            </div>
        </div>
    )
}

export default Admin
