import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../style/board.css';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../store/userSlice';

function UserInfo() {

    const navigate = useNavigate();
    const luser = useSelector(state => state.user);
    const dispatch = useDispatch();
    

    useEffect(
        ()=>{
            if(!luser.userid){
                alert('로그인이 필요한 서비스 입니다');
                navigate('/');
            }
        },[luser]
    );

    function onLogout(){
        dispatch(logoutAction());
        
    }

    return (
        <div className='loginuser'>
            {
                (luser.userid)?(
                    <h3>{luser.userid}({luser.name})님 어서오세요 &nbsp;</h3>
                ):(null)
            }            
            <button onClick={ ()=>{ navigate('/memberupdate'); } }>회원정보수정</button>
            <button onClick={ ()=>{  onLogout();  } }>로그아웃</button>
            <button onClick={ ()=>{ navigate('/writeBoard'); }  }>게시글쓰기</button>
        </div>
    )
}

export default UserInfo
