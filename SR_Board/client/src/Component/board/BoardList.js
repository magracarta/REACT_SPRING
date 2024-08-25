import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../style/board.css';

function BoardList() {

    const [boardList, setBoardList] = useState([]);
    const [ paging, setPaging ] = useState({});
    const [ beginend, setBeginend ] = useState([]);

    const navigate = useNavigate();


    useEffect(
        ()=>{
            axios.get('/api/board/getBoardList/1')
            .then((result)=>{
                setBoardList( [...result.data.boardlist ] );
                setPaging(result.data.paging);

                const pageArr = [];
                for(let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    pageArr.push(i);
                }
                setBeginend( [...pageArr] );
            })
            .catch((err)=>{console.error(err)})
        },[]
    )



    // useEffect(
    //     ()=>{
    //         // 컴포넌트 시작할때 
    //         //window.addEventListener("scroll", handleScroll);
    //         // scroll 이벤트가 발생하면 handleScroll 함수를 호출해서 실행해주세요

    //         //컴포넌트가 끝날때 실행하는 명령
    //         return () => {
    //             // scroll event listener 해제
    //             //window.removeEventListener("scroll", handleScroll);
    //         }
    //     }
    // );

   

    

    const handleScroll=()=>{
        const scrollHeight = document.documentElement.scrollHeight - 10; // 스크롤이 가능한 크기
        const scrollTop = document.documentElement.scrollTop;  // 현재 위치
        const clientHeight = document.documentElement.clientHeight; // 내용물의 크기
        
        if( scrollTop + clientHeight >= scrollHeight ) {
            onPageMove( Number(paging.page) + 1 );
        }
    }


    async function onBoardView( num ){
        try{
            
            let result = await fetch("/api/board/updateReadCount/"+num, {method:"GET"});
            let data = await (result.json() );
            if(data.msg == "ok") navigate(`/boardView/${num}`);
        }catch(err){
            console.error(err);
        }
    }


    function onPageMove(page){

        //무한 스크롤
        //console.log('onPageMove(', page, ')')
        // axios.get(`/api/board/getBoardList/${page}`)
        // .then((result)=>{
        //     setPaging( result.data.paging);
        //     let boards=[]; 
        //     boards = [...boardList];  // 현재 boardList 의 내용 복사
        //     // boards = [...boards, ...result.data.boardlist ]; // 새로 조회한 페이지의 목록과 Merge
        //     boards = [...result.data.boardlist ]; // 새로 조회한 페이지의 목록과 Merge
        //     setBoardList( [...boards] ); // Merge 한 리스트를 boardList 로 복사
        // })
        // .catch((err)=>{console.error(err)})

        // 페이지 표시방식
        axios.get(`/api/board/getBoardList/${page}`)
        .then((result)=>{
            console.log(page);
            setBoardList( [...result.data.boardlist ] );
            console.log(result.data.boardlist);
            setPaging( result.data.paging);

            const pageArr = [];
            for(let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                pageArr.push(i);
            }
            setBeginend( [...pageArr] );
        })
        .catch((err)=>{console.error(err)})
    }

    return (
        <div className='boardList'>
            <div className='titlerow'>
                <div className='titlecol'>번호</div>
                <div className='titlecol'>제목</div>
                <div className='titlecol'>글쓴이</div>
                <div className='titlecol'>작성일</div>
                <div className='titlecol'>조회수</div>
            </div>
            {
                boardList.map((board, idx)=>{
                    return (
                        <div className='row' key={idx}>
                            <div className='col'>{board.num}</div>
                            <div className='col' onClick={()=>{
                                onBoardView( board.num );
                            }}>{board.title}</div>
                            <div className='col'>{board.userid}</div>
                            <div className='col'>{(board.writedate+"").substring(0, 10)}</div>
                            <div className='col'>{board.readcount}</div>
                        </div>
                    )
                })
            }



            <div id="paging" style={{textAlign:"center", padding:"10px"}}>
            {
                (paging.prev)?(
                    <span style={{cursor:"pointer"}} onClick={ ()=>{ onPageMove( paging.beginPage-1 ) } } > ◀ </span>
                ):(<span></span>)
            }
            {
                (beginend)?(
                    beginend.map((page, idx)=>{
                        return (
                            <span style={{cursor:"pointer"}} key={idx} onClick={
                                ()=>{ onPageMove( page ) }
                            }>&nbsp;{page}&nbsp;</span>
                        )
                    })
                ):(<></>)
            }
            {
                (paging.next)?(
                    <span style={{cursor:"pointer"}} onClick={
                        ()=>{ onPageMove( paging.endPage+1 ) }
                    }>&nbsp;▶&nbsp;</span>
                ):(<></>)
            }
            </div>
        </div>
    )
}

export default BoardList