import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { loginAction, setFollowers, setFollowings } from '../../store/userSlice';

function Kakaosaveinfo() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        axios.get('/api/member/getLoginUser')
        .then((result)=>{
            dispatch(loginAction(result.data.loginUser));
            dispatch(setFollowers({followers:result.data.Followers}));
            dispatch(setFollowings({followings:result.data.followings}));
            navigate('/main');
        }).catch((err)=>{console.error(err)});
    },[]);
  return (
    <div>
      
    </div>
  )
}

export default Kakaosaveinfo
