import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../../store/userSlice';

function KakaoSaveInfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        //로그인 유저 조회해서 리덕스에 저장하고 index.js로 이동합니다.
        console.log("ㅓㅓㅓ");
        axios.get("/api/member/getLoginUser")
        .then((result)=>{
            console.log(result.data);
            dispatch(loginAction(result.data.loginUser));
            navigate("/");
        }).catch(err=>{console.error(err)});
    })
  return (
    <div>
      
    </div>
  )
}

export default KakaoSaveInfo
