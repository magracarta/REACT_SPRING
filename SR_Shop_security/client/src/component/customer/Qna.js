import React, { useEffect, useRef, useState } from 'react'
import SubImg from './SubImg'
import SubMenu from './SubMenu'
import "../../style/customer.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Qna() {
    const [qnaList, setQnaList] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const elementRef = useRef(null);

    useEffect(() => {
        // Initial fetch
        qnaListFetch(page);
    }, [page]);

    const onIntersection = (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore)setPage(prev => prev + 1);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection, {
            rootMargin: '0px',
            threshold: 1.0
        });

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [hasMore]);

    function qnaListFetch(page) {
        axios.get(`/api/customer/qnalist/${page}`)
            .then((result) => {
                if (result.data.qnaList.length === 0) return setHasMore(false);
                 
                setQnaList(prev => [...prev, ...result.data.qnaList]);
            })
            .catch((err) => {
                console.error(err);
                // 에러 처리 필요
            });
    }

    function onQnaVeiw( qseq , security , pass){
        if(security === "N") return navigate(`/qnaView/${qseq}`);

        let inputPass = window.prompt("QnA 에 설정한 패스워드를 입력하세요", "");
        if(inputPass !== pass) return  alert("비밀번호가 틀렸습니다.");

        navigate(`/qnaView/${qseq}`);
        
    }
    
    return (
        <article>
            <SubImg />
            <div className='subPage'>
                <SubMenu />
                <div className='qnalist' style={{ flex: "4" }}>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <h2>Qna List</h2>
                        <button onClick={()=>{
                            navigate('/writeQna');
                        }}>1:1 문의 작성</button>
                    </div>
                    <div className='qnatable'>
                        <div className='row'>
                            <div className='col'>번호</div>
                            <div className='col'>제목</div>
                            <div className='col'>등록일</div>
                            <div className='col'>답변여부</div>
                        </div>
                        {
                            (qnaList.length > 0) && (
                                qnaList.map((v, k) => (
                                    <div className='row' key={k}>
                                        <div className='col'>{v.qseq}</div>
                                        <div className='col' style={{display:"flex", alignItems:"center"}} onClick={() => {
                                            onQnaVeiw( v.qseq , v.security , v.pass);
                                        }}>{v.subject}
                                            {
                                                (v.security == "Y")?(<img style={{marginLeft:"10px"}} src="http://localhost:8070/images/key.png" />):(null)
                                            }
                                        </div>
                                        <div className='col'>{(v.indate) && (v.indate.substring(0, 10))}</div>
                                        <div className='col'>{v.reply ? "Y" : "N"}</div>
                                    </div>
                                ))
                            )
                        }
                        {/* 관찰할 요소 */}
                        <div ref={elementRef} style={{ height: '1px' }}></div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Qna
