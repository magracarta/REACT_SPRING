import React, { useEffect, useState } from 'react'
import SubMenu from './SubMenu'
import SubImg from './SubImg'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function WriteQna() {
    const [subject , setSubject] = useState('');
    const [content , setContent] = useState('');
    const [pass , setPass] = useState('');
    const [security , setSecurity] = useState('N');
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    function onSubmit(){
        axios.post("/api/customer/writeqna",{ subject, content , userid:loginUser.userid , security , pass }).then((result)=>{
            navigate("/qna");
        }).catch((err)=>{
            console.error(err);
        });
    }

    const changeSecutiry =(e)=>{
        if(e.target.checked){
            document.querySelector("#pass").disabled = false;
            setSecurity("Y");
        }else{
            document.querySelector("#pass").disabled = true;
            setSecurity("N");
            setPass("");
        };
            
    }
  return (
    <article>
        <SubImg />
        <div className='subPage'>
            <SubMenu />
            <div className="qnawriteform" style={{flex:"4"}}>
                <h2>Write QnA</h2>
                <div className="field">
                    <label>Subject</label>
                    <input type="text" value={subject} onChange={
                        (e)=>{ setSubject(e.currentTarget.value) }
                    }/>
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="checkbox" onChange={changeSecutiry} /> 비밀글로 하기
                    <input type="text" id= "pass" value={pass} onChange={
                        (e)=>{ 
                            setPass(e.currentTarget.value); 
                            setSecurity("Y"); 
                        }
                    } disabled/>
                </div>
                <div className="field">
                    <label>Content</label>
                    <textarea rows="7" value={content} onChange={
                        (e)=>{ setContent(e.currentTarget.value) }
                    }></textarea>
                </div>
                <div className='btns'>
                    <button onClick={  ()=>{ onSubmit() }  }>글쓰기</button>
                    <button onClick={ ()=>{ navigate('/qna')} }>리스트로</button>
                </div>
            </div>
        </div>
    </article>
  )
}

export default WriteQna
