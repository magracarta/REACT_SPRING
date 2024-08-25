import React, { useState } from 'react'
import SubImg from './SubImg'
import SubMenu from './SubMenu'

import "../../style/login.css"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginAction } from '../../store/userSlice';

function Login() {
    const [userid , setUserid ] = useState("");
    const [pwd , setPwd ] = useState("");
    const [message , setMessage ] = useState("");

    
    const dispatch = useDispatch();
    const navigate = useNavigate();


    async function onLocalLogin(){
        if(!userid) return alert("아이디를 입력하세요.");
        if(!pwd) return alert("패스워드를 입력하세요.");

        try{
            let result = await axios.post("/api/member/locallogin",{userid,pwd});
            if(result.data.msg == "ok"){
                result = await axios.get("/api/member/getLoginUser");
                dispatch(loginAction(result.data.loginUser));
                navigate("/");
            }else{
                alert(result.data.msg);
                //setMessage(result.data.msg);
            }
        }catch(err){
            console.error(err);
        }
    }
  return (
     <article>
            <SubImg />
            <div className='subPage'>
                <SubMenu />
                <div className='memberform'>
                    <h2>LogIn</h2>
                    <div className="field">
                        <label>User ID</label>
                        <input type="text" value={userid} onChange={(e) => {
                            setUserid(e.currentTarget.value);
                        }} />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" value={pwd} onChange={(e) => {
                            setPwd(e.currentTarget.value);
                        }} />
                    </div>
                    <div className="btns">
                        <button onClick={() => {
                            onLocalLogin();
                        }}>로그인</button>
                        <button onClick={()=>{
                            navigate("/join");
                        }}>회원가입</button>
                    </div>
                    <div className="sns-btns">
                        <button onClick={
                            () => {
                                window.location.href = 'http://localhost:8070/member/kakaoStart';
                            }
                        }>Kakao Login</button>
                        <button>Naver Login</button>
                        <button>Google Login</button><button>FaceBook Login</button>
                    </div>
                    <div>{message}</div>
                </div>
            </div>
        </article>

  )
}

export default Login
