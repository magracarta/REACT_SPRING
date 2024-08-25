import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BoardList from './board/BoardList';
import UserInfo from './member/UserInfo'

function Main() {

    const luser = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(
        ()=>{
            if(!luser.userid){
                alert('로그인이 필요한 서비스 입니다');
                navigate('/');
            }
        },[]
    );
  return (
    <div className='main'>
      <UserInfo />
      <BoardList />
    </div>
  )
}

export default Main
