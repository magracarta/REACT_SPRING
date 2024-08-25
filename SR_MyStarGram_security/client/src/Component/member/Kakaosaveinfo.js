import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { loginAction, setFollowers, setFollowings } from '../../store/userSlice';
import jaxios from '../../util/jwtUtil';
import { setCookie } from '../../util/cookiesUtil';

function Kakaosaveinfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {nickname} = useParams();

    useEffect(
        ()=>{
            console.log(nickname);
            axios.post('/api/member/loginlocal',null,{params:{username:nickname, password:"kakao"}})
            .then((result)=>{
                if(result.data.err == "EROORO_LOGIN"){
                    return alert("이메일 또는 패스워드 오류입니다.");
                }else{
                    console.log("kakaoUser", result.data);
                    dispatch( loginAction(result.data) );
                    setCookie("user", JSON.stringify(result.data), 1);
                    
                    jaxios.get("/api/member/getFollowings",{params:{nickname:nickname}}).then((res)=>{
                        dispatch(setFollowings({followings:res.data}))
                    })
                    jaxios.get("/api/member/getFollowers",{params:{nickname:nickname}}).then((res)=>{
                        dispatch(setFollowers({followers:res.data}))
                    })

                }
                navigate('/main');   
            })
            .catch((err)=>{console.error(err)})
        },[]
    )
    return (
        <div>
        
        </div>
    )
}

export default Kakaosaveinfo
