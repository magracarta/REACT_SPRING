import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/userSlice';

function MemberUpdate() {
 
    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState("");
    const [pwdchk, setPwdchk] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginUser = useSelector(state => state.user);
    

    useEffect(
        ()=>{
            if( !loginUser.userid ){
                    alert('로그인이 필요한 서비스 입니다');
                    navigate('/');
            }else{
                setUserid( loginUser.userid );
                setName( loginUser.name );
                setEmail( loginUser.email );
                setPhone( loginUser.phone );
            }
           
        },[]
    );

    function onSubmit(){
        if( !pwd ){  return alert('패스워드를 입력하세요');   }
        if( !name ){ return alert('이름을 입력하세요');   }
        if( !email ){  return alert('이메일을 입력하세요');   }
        if( !phone ){ return alert('전화번호를 입력하세요');   }
        if( pwd != pwdchk ){  return alert('패스워드확인이 일치하지 않습니다');   }
        axios.post('/api/member/updateMember', {userid, pwd, name, email, phone})
        .then((result)=>{
            dispatch(loginAction({userid, pwd, name, email, phone}));
            alert('회원 수정이 완료되었습니다');
            
            navigate('/main');
        })
        .catch((err)=>{
            console.error(err);
        });
    }


    return (
        <div className="login">
            <form id="login-form">
                <h2>Edit Member</h2>
                <div className='field'>
                    <label>USER ID</label>
                    <input type="text" value={userid} readOnly/>
                </div>
                <div className='field'>
                    <label>PASSWORD</label>
                    <input type="password" value={pwd} onChange={
                        (e)=>{ setPwd( e.currentTarget.value ) }
                    } />
                </div>
                <div className='field'>
                    <label>RETYPE PASS</label>
                    <input type="password" value={pwdchk} onChange={
                        (e)=>{ setPwdchk( e.currentTarget.value ) }
                    } />
                </div>
                <div className='field'>
                    <label>NAME</label>
                    <input type="text" value={name} onChange={
                        (e)=>{ setName( e.currentTarget.value ) }
                    } />
                </div>
                <div className='field'>
                    <label>EMAIL</label>
                    <input type="text" value={email} onChange={
                        (e)=>{setEmail( e.currentTarget.value )}
                    } />
                </div>
                <div className='field'>
                    <label>PHONE</label>
                    <input type="text" value={phone} onChange={
                        (e)=>{ setPhone( e.currentTarget.value ) }
                    } />
                </div>
                <div className="btns">
                    <input type="button" value="정보수정" onClick={
                        ()=>{  onSubmit();   }
                    }/>
                    <input type="button" value="돌아가기" onClick={
                        ()=>{ navigate('/main'); }
                    }/>
                </div>
            </form>   
        </div>
    )
}

export default MemberUpdate
