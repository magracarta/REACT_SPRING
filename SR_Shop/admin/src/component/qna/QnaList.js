import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SubMenu from '../SubMenu';

function QnaList() {
    const [qnaList,setQnaList] = useState([]);
    const [page , setPage] = useState(1);
    const navigate = useNavigate();
    const observbox = useRef(null);
    const [hasmore ,setHasMore] = useState(true);
    const [search , setSearch] = useState("");

    useEffect(()=>{
        fetch("/api/admin/getQnaList/"+page+"?search="+encodeURIComponent(search)).then(result=>{
            if(!result.ok)  throw new Error("네트 워크 연결 실패");
            return result.json();
        }).then(data =>{
            // console.log(data);
            setQnaList(prev=>[...prev , ...data.qnaList]);
            if(data.qnaList.length == 0) setHasMore(false);
        }).catch(err=>{console.error(err)});
    },[page]);

    useEffect(()=>{
        let observer = new IntersectionObserver(intersection,{
            rootMargin:"0px",
            threshold:1.0
        });

        if(observbox.current) observer.observe(observbox.current);

        return()=>{
            if(observbox.current) observer.unobserve(observbox.current);
        }
    },[hasmore]);


    let intersection = (entries)=>{
        if(entries[0].isIntersecting && hasmore) setPage(prev => prev+1);
    }
    const searchgo = async()=>{
        setQnaList([]);
        setHasMore(true);
        setPage(1);
     }

  return (
    <div className='adminContainer'>
            <SubMenu />
            <div className='btns' style={{display:"flex", margin:"5px"}}>
                <input type="text" value={search} onChange={(e)=>{setSearch(e.currentTarget.value)}} /> <button onClick={searchgo}>검색</button>
                <button style={{marginLeft:"auto"}} onClick={()=>{ navigate('/writeproduct') }}>상품등록</button>
            </div>
            <div className='productTable'>
                <div className='row'>
                    <div className='col'>번호</div>
                    <div className='col'>제목</div>
                    <div className='col'>작성자</div>
                    <div className='col'>답변여부</div>
                    <div className='col'>작성일</div>
                </div>
                {
                    (qnaList)?(
                        qnaList.map((qna, idx)=>{
                            return (
                                <div className='row'>
                                    <div className='col'>{qna.qseq}</div>
                                    <div className='col' style={{cursor:"pointer"}} onClick={()=>{
                                        navigate("/qnaView/"+qna.qseq);
                                    }}>{qna.subject}</div>
                                    <div className='col'>{qna.userid}</div>
                                    <div className='col'>{(qna.reply)?(<div>Y</div>):(<div>N</div>)}</div>
                                    <div className='col'>{qna.indate.substring(2, 10)}</div>
                                </div>
                            )
                        })
                    ):(<span>loading...</span>)
                }
            </div>

        <div ref={observbox} style={{height:"10px"}}></div>
    </div>
  )
}

export default QnaList
