import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

import '../../style/board.css';

function BoradView() {

    const navigate = useNavigate();
    const [board, setBoard] = useState({});
    const [replyList, setReplyList] = useState([]);
    const [curDateTime, setCurDataTime]=useState("");   // 07/11 10:45
    const [rContent, setRContent] = useState("");

    const loginUser = useSelector(state => state.user);
    const {num} = useParams();

    useEffect(
        ()=>{

            // 게시물 조회
            axios.get(`/api/board/getBoard/${num}`)
            .then((result)=>{
                setBoard(  result.data.board );
            })
            .catch((err)=>{console.log(err)})

            // 댓글 조회
            axios.get(`/api/board/getReplyList/${num}`)
            .then((result)=>{
                setReplyList( [... result.data.reply ] );
            })
            .catch((err)=>{console.log(err)})

            
            // 댓글 작성에 표시될 데이터(날짜) 생성
            const date = new Date();
            const months = String( date.getMonth()+1 ).padStart(2, '0');
            const days = String( date.getDate()+1 ).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            setCurDataTime(`${months}/${days} ${hours}:${minutes}`);


        },[]
    );

    async function addReply(){
        try{
            // 댓글을 추가하고
            await axios.post('/api/board/addReply', {userid:loginUser.userid, content:rContent, boardnum:num} )
            // 댓글을 다시 조회해서  댓글리스트를 갱신하세요(replyList 변수에 새 리스트가 들어가면 자동 갱신)

            const result = await axios.get(`/api/board/getReplyList/${num}`);
            setReplyList( [... result.data.reply ] ); // 스테이트 변수가 변경되면 관련내용이 재 렌더링됩니다
        }catch(err){
            console.error(err);
        }
        setRContent('');
    }

    async function deleteReply(replynum){
        if( window.confirm( '해당 댓글을 삭제할까요?') ){
            try{
                await axios.delete(`/api/board/deletereply/${replynum}`);
                const result = await axios.get(`/api/board/getReplyList/${num}`);
                setReplyList( [... result.data.reply ] ); 
            }catch(err){
                console.error(err);
            }
        }else{
            return
        }

    }

    function deleteBoard( num ){
        const pass = window.prompt('삭제할 패스워드를 입력하세요');
        if(board.pass != pass){return alert('패스워드가 일치하지 않습니다')}
        axios.delete(`/api/board/deleteBoard/${board.num}`)
        .then(()=>{ navigate('/main') })
        .catch((err)=>{console.error(err)})
    }

    return (
        <div className='boardView'>
            <h2>Board View</h2>
            <div className='field'>
                <label>작성자</label><div>{board.userid}</div>
            </div>
            <div className='field'>
                <label>이메일</label><div>{board.email}</div>
            </div>
            <div className='field'>
                <label>조회수</label><div>{board.readcount}</div>
            </div>
            <div className='field'>
                <label>작성일자</label><div>{board.writedate}</div>
            </div>
            <div className='field'>
                <label>제목</label><div>{board.title}</div>
            </div>
            <div className='field'>
                <label>내용</label><div><pre>{board.content}</pre></div>
            </div>
            <div className='field'>
                <label>이미지</label>
                <div>
                    <img src={`http://localhost:8070/images/${board.savefilename}` } style={{width:"300px"}} />
                </div>
            </div>

            <div className='btns'>
                <button onClick={()=>{ navigate(`/updateBoard/${board.num}`) }}>수정</button>
                <button onClick={()=>{ deleteBoard( board.num ) }}>삭제</button>
                <button onClick={()=>{ navigate('/main') }}>돌아가기</button>
            </div><br /><br />
            <div className="head-row">
                <div className="head-col">작성일시</div><div className="head-col">작성자</div><div className="head-col">내용</div><div className="head-col">&nbsp;</div>
            </div>

            <div className="new-reply-row">
                <div className="new-reply-col">{curDateTime}</div>
                <div className="new-reply-col">{loginUser.userid}</div>
                <div className="new-reply-col">
                    <input type="text" value={rContent} onChange={
                        (e)=>{ setRContent( e.currentTarget.value ) }
                    }/>
                </div>
                <div className="new-reply-col">
                    <button onClick={ ()=>{  addReply(); } }>댓글작성</button>
                </div>
            </div>

            {
                (replyList)?(
                    replyList.map((reply, idx)=>{
                        return (
                            <div key={idx} className="new-reply-row">
                                <div className="new-reply-col">{reply.writedate.substring(5,10)}</div>
                                <div className="new-reply-col">{reply.userid}</div>
                                <div className="new-reply-col">{reply.content}</div>
                                <div className="new-reply-col">
                                    {
                                        (loginUser.userid == reply.userid)?
                                        (<button onClick={()=>{deleteReply(reply.replynum)}}>삭제</button>):(null)
                                    }
                                </div>
                            </div>
                        )
                    })
                ):null
            }

        </div>
    )
}

export default BoradView
