import axios from 'axios';
import React, { useState } from 'react';
import DaumPostCode from "react-daum-postcode";
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import SubImg from './SubImg';
import SubMenu from './SubMenu';

function Join() {
    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdchk, setPwdchk] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [usercode , setUserCode] = useState(""); 
    const [name, setName] = useState('');
    const [zipnum, setZipnum] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    const [message, setMessage] = useState('');
    const [msg, setMsg] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    

    const navigate = useNavigate();

    function idcheck(){
        axios.post("/api/member/idcheck",null,{params:{userid}})
        .then((result)=>{
            if(result.data.res == '1'){
                setMessage('사용가능합니다.');
            }else{
                setMessage('아이디가 중복됩니다..');
            }
        }).catch(err=>{console.error(err)});
    }

    let toggle=()=>{
        setIsOpen(!isOpen);
    }
    function onJoin(){
        if(!userid) return alert("아이디를 입력해주세요.");
        if(message !== "사용가능합니다.") return alert("중복체크를 확인해주세요.");
        if(!pwd) return alert("비밀번호를 입력해주세요.");
        if(pwd !== pwdchk) return alert("비밀번호 체크를 확인해주세요.");
        if(!name) return alert("이름을 입력해주세요.");
        if(!email) return alert("이메일을 입력해주세요.");
        if(!phone) return alert("전화번호를 입력해주세요.");
        if(msg !== "ok") return alert("이메일 본인 인증을 해주세요.");

        axios.post("/api/member/insertMember",{userid, pwd , name ,email,phone, zip_num:zipnum , address1 , address2 ,address3})
        .then((data)=>{ 
            alert("회원가입이 완료되었습니다. 로그인하세요.");
            navigate("/login");
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

    async function sendMail(){
        if( !email){
            return alert('이메일을 입력하세요.');
        }
       try{
        const result = await axios.post("/api/member/sendMail", null , {params:{email}});
        if(result.data.msg == 'success'){
            alert('이메일이 전송되었습니다. 해당 이메일 수신내역을 확인하세요.');
            console.log(result.data.number);
        }
       }catch(err){
           console.error(err);
       }
    }

    async function codecheck(){
        try{
            const result = await axios.post("/api/member/codecheck", null,{params:{usercode}});
            setMsg(result.data.msg)
        }catch(err){
            console.error(err);
        }

    }

  return (
    <div>
      <SubImg/>
      <div className='subPage'>
        <SubMenu />
        <div className='memberform'>
            <h2>Join</h2>
            <div className='field'>
                <label>User ID</label>
                <input type="text" style={{flex:"2"}} value={userid} onChange={
                    (e)=>{
                        setUserid(e.currentTarget.value);
                        setMessage("");
                    }
                }/>
                 <button onClick={()=>{
                    idcheck();
                }}>아이디 중복검사</button>
                <div style={{flex:"2", color:"blue" , lineHeight:"30px"}}>&nbsp;&nbsp;{message}</div>
            </div>

            <div className="field">
                <label>Password</label>
                <input type="password" value={pwd} onChange={(e)=>{
                    setPwd( e.currentTarget.value );
                }}/>
            </div>
            <div className="field">
                <label>reType Password</label>
                <input type="password" value={pwdchk} onChange={(e)=>{
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
                <button style={{flex:"1"}} onClick={()=>{sendMail()}}>Send Mail</button>
                <label style={{textAlign:"right" , marginRight:"10px"}}>Code</label>
                <input style={{flex:"1"}} type="text" value={usercode} onChange={(e)=>{
                    setUserCode(e.currentTarget.value);
                }} />
                <button style={{flex:"1"}} onClick={()=>{codecheck()}}>코드확인</button>
                <div style={{felx:"1" , color:"blue" , lineHeight:"30px"}}>&nbsp;&nbsp;{msg}</div>
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
                    onJoin();
                }}>회원 가입</button>
                <button onClick={()=>{navigate("/")}}>돌아가기</button>
            </div>
           
        </div>
      </div>
    </div>
  )
}

export default Join
