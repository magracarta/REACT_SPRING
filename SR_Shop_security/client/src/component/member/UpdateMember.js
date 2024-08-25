import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DaumPostCode from "react-daum-postcode";
import Modal from "react-modal";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../../store/userSlice';
import SubImg from './SubImg';
import SubMenu from './SubMenu';


function UpdateMember() {
    const loginUser = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdchk, setPwdchk] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [zipnum, setZipnum] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    

    useEffect(()=>{
        setUserid(loginUser.userid);
        if(loginUser.phone) setPhone(loginUser.phone);
        setEmail(loginUser.email);
        setName(loginUser.name);
        if(loginUser.zip_num) setZipnum(loginUser.zip_num);
        if(loginUser.address1) setAddress1(loginUser.address1);
        if(loginUser.address2) setAddress2(loginUser.address2);
        if(loginUser.address3) setAddress3(loginUser.address3);
        if(loginUser.provider == "kakao"){
            setPwd("kakao");
            setPwdchk("kakao");
            document.querySelector("#pwd").readOnly = true;
            document.querySelector("#pwdcheck").readOnly = true;
        }
    },[]);
    

    const navigate = useNavigate();


    let toggle=()=>{
        setIsOpen(!isOpen);
    }

    function onUpdate(){
        if(!pwd) return alert("비밀번호를 입력해주세요.");
        if(pwd !== pwdchk) return alert("비밀번호 체크를 확인해주세요.");
        if(!name) return alert("이름을 입력해주세요.");
        if(!email) return alert("이메일을 입력해주세요.");
        if(!phone) return alert("전화번호를 입력해주세요.");

        axios.post("/api/member/udatteMember",{userid, pwd , name ,email,phone, zip_num:zipnum , address1 , address2 ,address3})
        .then((result)=>{ 
            alert("회원수정이 완료되었습니다. 로그인하세요.");
            //리덕스에 수정된 회원정보를 업데이트하세요.
            dispatch(loginAction(result.data.loginUser));
            navigate("/");
         })
        .catch((err)=>{ console.error(err); })

    }

    // 모달창을 위한 style
    const customStyle = {
        overlay: {
            backgroundColor: "rgba( 0 , 0 , 0 , 0.5)",
        },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "600px",
            padding: "0",
            overflow: "hidden",
        },
    };

    const completeHandler=(data)=>{
        setZipnum(data.zonecode);
        setAddress1(data.address);
        setIsOpen(false);
    }

   


  return (
    <article>
        <SubImg />
        <div className='subPage'>
            <SubMenu />
            <div className='memberform' style={{flex:"4"}}>
               

            <h2>Join</h2>
            <div className='field'>
                <label>User ID</label>
                <input type="text" style={{flex:"2"}} value={userid} readOnly/>
                <div style={{flex:"2", color:"blue" , lineHeight:"30px"}}>&nbsp;&nbsp;{message}</div>
            </div>

            <div className="field">
                <label>Password</label>
                <input type="password" id ="pwd" value={pwd} onChange={(e)=>{
                    setPwd( e.currentTarget.value );
                }}/>
            </div>
            <div className="field">
                <label>reType Password</label>
                <input type="password" id ="pwdcheck" value={pwdchk} onChange={(e)=>{
                    setPwdchk( e.currentTarget.value );
                }}/>
            </div>
            <div className="field">
                <label>name</label>
                <input type="text" value={name} onChange={(e)=>{
                    setName( e.currentTarget.value );
                }}/>
            </div>
            <div className="field">
                <label>Phone</label>
                <input type="text" value={phone} onChange={(e)=>{
                    setPhone( e.currentTarget.value );
                }}/>
            </div>
            <div className="field">
                <label>E-mail</label>
                <div style={{flex:"3" , display:"flex"}}>
                    <input type="text" style={{felx:"1"}} value={email} onChange={(e)=>{
                        setEmail( e.currentTarget.value );
                    }}/>
                </div>
            </div>
            <div className='field'>
                <label>Zip num</label>
                <input type="text" style={{flex:"2"}} value={zipnum} onChange={(e)=>{
                    setZipnum(e.currentTarget.value);
                }} readOnly />
                <button style={{flex:"1"}} onClick={()=>{toggle()}} >우편번호 찾기</button>
            </div>


            <div>
                <Modal isOpen={isOpen} ariaHideApp={false} style={customStyle}>
                    <button onClick={()=>{
                        setIsOpen(false);
                    }}>닫기</button>
                    <DaumPostCode onComplete={completeHandler} />
                </Modal>
            </div>

            <div className="field" >
                <label>Address</label>
                <input type="text" value={address1} onChange={(e)=>{
                    setAddress1( e.currentTarget.value );
                }} readOnly/>
            </div>
            <div className="field">
                <label>detail Address</label>
                <input type="text" value={address2} onChange={(e)=>{
                    setAddress2( e.currentTarget.value );
                }} placeholder='상세주소 입력'/>
            </div>
            <div className="field">
                <label>extra Address</label>
                <input type="text" value={address3} onChange={(e)=>{
                    setAddress3( e.currentTarget.value );
                }}/>
            </div>
            <div className='btns'>
                <button onClick={()=>{
                    onUpdate();
                }}>수정완료</button>
                <button onClick={()=>{navigate("/")}}>돌아가기</button>
            </div>


            </div>
        </div>
    </article>
  )
}

export default UpdateMember
