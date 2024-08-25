import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction, setFollowers, setFollowings } from '../../store/userSlice';


function EditProfile() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk ] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [profilemsg, setProfilemsg] = useState('');
    const [oldImgsrc, setOldImgSrc] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [imgStyle, setImgStyle] = useState({display:"none"});
    const [profileimg , setProfileimg] = useState('');
    
    const lUser = useSelector(state=>state.user);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function fileupload(e){
        const formData = new FormData();
        formData.append('image',e.target.files[0]);
        try{
            const result = await axios.post("/api/member/fileupload",formData);
            setImgSrc("http://localhost:8070/uploads/"+result.data.filename);
            setImgStyle({display:"block", width:"200px"});
            setProfileimg(`http://localhost:8070/uploads/${result.data.filename}`);
        }catch(err){
            console.error(err);
        }
    }
    async function onSubmit(){
        if(!email)return alert("이메일을 입력하세요.");
        if(!nickname)return alert("닉네임을 입력하세요.");
        if(!pwd)return alert("Password 입력하세요.");
        if(pwd != pwdChk)return alert("Password 확인이 일치하지 않습니다.");

        try{
            if(email != lUser.email){
                let result = await axios.post('/api/member/emailcheck', null , {params:{email}});
                if(result.data.msg == 'no')return alert("이메일이 중복됩니다.");
            }
            if(nickname != lUser.nickname){
                let result = await axios.post('/api/member/nicknamecheck', null , {params:{nickname}});
                if(result.data.msg == 'no')return alert("닉네임이 중복됩니다.");
            }
    
            //회원 정보 수정
            let result = await axios.post('/api/member/updateProfile',{email , nickname , pwd , phone, profileimg , profilemsg});
            if(result.data.msg =="ok"){
                let res = await axios.get("/api/member/getLoginUser");
                
                //로그인 유저 조회
                dispatch( loginAction( res.data.loginUser )  );     
                dispatch( setFollowers( {followers:res.data.followers} ) );          
                dispatch( setFollowings( {followings:res.data.followings} ) );
                
                //리덕스 수정
                navigate("/mypage")
            }
        }catch(err){
            console.error(err);
        }
        
    }

    useEffect(()=>{
        setEmail(lUser.email);
        setNickname(lUser.nickname);
        setPhone(lUser.phone);
        setOldImgSrc(lUser.profileimg);
        setProfilemsg(lUser.profilemsg);

        if(lUser.provider == "kakao"){
            setPwd('kakao');
            setPwdChk('kakap');
            document.getElementById("pwd").readOnly=true;
            document.getElementById("pwdchk").readOnly=true;
        }
    },[])

    return (
            <div className='loginform'>
            <div className="logo" style={{fontSize:"2.0rem"}}>Member Join</div>
            <div className='field'>
                <label>E-MAIL</label>
                <input type="text" value={email} onChange={
                    (e)=>{ setEmail( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>PASSWORD</label>
                <input type="password" id="pwd" value={pwd} onChange={
                    (e)=>{ setPwd( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>RETYPE PASS</label>
                <input type="password" id="pwdchk" value={pwdChk} onChange={
                    (e)=>{ setPwdChk( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>NICKNAME</label>
                <input type="text"  value={nickname} onChange={
                    (e)=>{ setNickname( e.currentTarget.value ) }
                } readOnly/>
            </div>
            <div className='field'>
                <label>PHONE</label>
                <input type="text" value={phone} onChange={
                    (e)=>{ setPhone( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>INTRO</label>
                <input type="text" value={profilemsg} onChange={
                    (e)=>{ setProfilemsg( e.currentTarget.value ) }
                }/>
            </div>

            <div className='field'>
                <label>Old profileimg</label>
                <div><img src={oldImgsrc} width="150" /></div>
            </div>

            <div className='field'>
                <label>PROFILE-IMG</label>
                <input type="file" onChange={(e)=>{ fileupload(e) }}/>
            </div>
            <div className='field'>
                <label>Profile img preview</label>
                <div><img src={imgSrc} style={imgStyle} /></div>
            </div>

            <div className='btns'>
                <button onClick={ ()=>{   onSubmit()    }  }>Update Profile</button>
                <button onClick={ ()=>{ navigate('/myPage')   }  }>BACK</button>
            </div>

        </div>

    )
}

export default EditProfile
