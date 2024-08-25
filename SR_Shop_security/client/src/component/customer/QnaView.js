import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SubMenu from './SubMenu'
import SubImg from './SubImg'

function QnaView() {
    let {qseq} = useParams();
    let [qna , setQna] = useState({});
    let navigate = useNavigate();

    useEffect(()=>{
        async function fetchData(){
            let result = await fetchQna("/api/customer/qnaView/"+qseq);
            setQna(result.qna);
        }
        fetchData();
    },[qseq]);

    async function fetchQna(url , postData){
        try{
            let response;
            if(!    postData){
                response = await fetch(url);
            }else  response = await fetch(url,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(postData)
            });
            const data = await response.json();

            return data;
        }catch(err){
            console.error(err);
            return null;
        }
    }

  return (
    <article>
        <SubImg />
        <div className='subPage'>
            <SubMenu />
            <div className="qna" style={{flex:"4"}}>
            {
                        (qna)?(
                            <div className='qnaview'>
                                <h2>QnA View</h2>
                                <div className='field'>
                                    <label>Subject</label>
                                    <div>{qna.subject}</div>
                                </div>
                                <div className='field'>
                                    <label>writer</label>
                                    <div>{qna.userid}</div>
                                </div>
                                <div className='field'>
                                    <label>content</label>
                                    <div><pre>{qna.content}</pre></div>
                                </div>
                                <div className='field'>
                                    <label>Reply</label>
                                    <div>{qna.reply}</div>
                                </div>
                            </div>
                        ):(<div>Loading</div>)
                }
                <div className='btns'>
                    <button onClick={()=>{
                        navigate("/qna");
                    }}>목록으로</button>
                </div>
            </div>
        </div>
    </article>
  )
}

export default QnaView
