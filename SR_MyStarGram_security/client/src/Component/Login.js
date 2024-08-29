import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { loginAction, setFollowers, setFollowings } from '../store/userSlice';
import { setCookie, getCookie } from '../util/cookiesUtil';

import '../style/mystargram.css'

function Login() {
    // const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [pwd, setPwd] = useState('');
    const dispatch = useDispatch();  // 쓰기를 위한 함수 생성
    const navigate = useNavigate();
    const lUser = useSelector(state=>state.user);
    async function onLoginLocal(){
        if(!nickname){return alert("이메일을 입력하세요");}
        if(!pwd){return alert("패스워드를 입력하세요");}
        try{
            const result = await axios.post('/api/member/loginlocal',null, {params:{username:nickname, password:pwd}} );
            if(result.data.error == "ERROR_LOGIN"){
                return alert(result.data.error, "이메일 또는 패스워드 오류입니다.");
            }else{
                console.log(result.data);
                dispatch(loginAction(result.data));
                setCookie("user", JSON.stringify(result.data) , 1);

                //로그인 유저의 follower와 following 을 조회해서 리덕스에 저장해주세요.
                let res = await axios.get("/api/member/getFollowings",{params:{nickname:lUser.nickname}, headers:{"Authorization":"Bearer "+lUser.accessToken}});
                console.log("아무것도 안오는거 같은데"+res.data);
                dispatch(setFollowings({followings:res.data}));
                res = await axios.get("/api/member/getFollowers",{params:{nickname:lUser.nickname}, headers:{"Authorization":"Bearer "+lUser.accessToken}});
                dispatch(setFollowers({followers:res.data}));
                navigate("/main");
            }
                     
        }catch(err){ console.error(err)}
    }

    return (
        <div className="loginform">
            <div className='field'>
                <label>Nickname</label>
                <input type="text" value={nickname} onChange={(e)=>{ setNickname(e.currentTarget.value) }}/>
            </div>
            <div className='field'>
                <label>PASSWORD</label>
                <input type="password" value={pwd} onChange={(e)=>{ setPwd(e.currentTarget.value) }}/>
            </div>
            <div className='btns'>
                <button onClick={ ()=>{ onLoginLocal() } }>LOGIN</button>
                <button onClick={ ()=>{ navigate('/join') } }>JOIN</button>
            </div>
            <div className='snslogin'>
                <button onClick={()=>{
                    window.location.href='http://52.78.197.165/member/kakaostart';
                }}>KAKAO</button>
                <button>NAVER</button>
                <button>GOOGLE</button>
                <button>FACEBOOK</button>
            </div>
        </div>
    )
}

export default Login
