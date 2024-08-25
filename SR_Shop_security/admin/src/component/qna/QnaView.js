import React, { useState , useEffect }from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import "../../style/admin.css"
import SubMenu from '../SubMenu';
function QnaView() {
    const [qna, setQna] = useState({});
    const [reply , setReply] = useState("");
    const {qseq} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        getQna();
    },[]);

    function getQna(){
        fetch("/api/customer/qnaView/"+qseq).then((response)=>{
            if(!response.ok) throw new Error(response); 
            return response.json();
        }).then((data)=>{ 
            console.log(data.qna);
            setQna(data.qna)
        }).catch((data)=>{console.error(data);})
    }
   
    function writeReply(e){
        if(!reply) return alert("답변이 비어있습니다. 작성하고 등록해주세요.");
        
        fetch("/api/admin/writeReply?qseq="+qseq,{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({reply})
        }).then((response)=>{
            if(!response.ok) throw new Error(response); 
            return response.json();
        }).then((data)=>{ 
            getQna();
        }).catch((data)=>{console.error(data);})
    }
  return (
    <div className='adminContainer'>
        <SubMenu/>
        <h2>Qna View</h2>
        <div className='productTable'>
            <div className='field'>
                <label>번호</label><div>{qna.qseq}</div>
            </div>
            <div className='field'>
                <label>제목</label><div>{qna.subject}</div>
            </div>
            <div className='field'>
                <label>작성자</label><div>{qna.userid}</div>
            </div>
            <div className='field'>
                <label>내용</label>
                <div style={{flex:"4", row:"5"}}><pre>{qna.content}</pre></div>
            </div>
            <div className='field'>
                <label>작성일시</label>
                <div >{qna.indate&&qna.indate.substring(0,10)}</div>
            </div>
            <div className='field'>
                <label>답변</label>
                {
                    (qna.reply)?(
                        <div>{qna.reply}</div>
                    ):(
                        <div style={{display:"flex" , flex:"5"}}>
                            <input style={{flex:"3"}} type="text" value={reply} onChange={(e)=>{ setReply(e.currentTarget.value) }} />
                            <button style={{flex:"1"}} onClick={()=>{
                                writeReply()
                            }} >답변 입력</button>
                        </div>
                    )
                }
            </div>
            {
                (qna.reply)&&(
                    <div className='field updateReply'>
                        <label>수정</label>
                        <div style={{display:"flex" , flex:"5"}}>
                            <input style={{flex:"3"}} type="text" value={reply} onChange={(e)=>{ setReply(e.currentTarget.value) }} />
                            <button style={{flex:"1"}} onClick={()=>{
                                writeReply()
                            }} >답변 수정</button>
                        </div>
                    </div>
                ) 
            }
            <div className='btns'>
                <button onClick={()=>{navigate("/qnaList")}}>목록으로</button>
            </div>
        </div>

    </div>
  )
}

export default QnaView
