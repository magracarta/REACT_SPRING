import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SubMenu from '../SubMenu';

function OrderList() {
    const [orderList,setOrderList] = useState([]);
    const [page , setPage] = useState(1);
    const navigate = useNavigate();
    const observbox = useRef(null);
    const [hasmore ,setHasMore] = useState(true);
    const [search , setSearch] = useState("");
    const [odseqList, setOdseqList] = useState([]);
    

    useEffect(()=>{
        fetch(`/api/admin/getOrderList/${page}?search=${encodeURIComponent(search)}`).then(result=>{
            if(!result.ok)  throw new Error("네트 워크 연결 실패");
            return result.json();
        }).then(data =>{
            // console.log(data);
            setOrderList(prev=>[...prev , ...data.orderList]);
            if(data.orderList.length == 0) setHasMore(false);
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
        setOrderList([]);
        setHasMore(true);
        setPage(1);
     }

    function onResult(result){
        if( result=='1') {return "주문완료"}
        if( result=='2') {return "배송중"}
        if( result=='3') {return "배송완료"}
        if( result=='4') {return "구매확정"}
    }


    async function nextPress(){
        if (odseqList.length === 0) {
            return alert("odseqList가 비어 있습니다.");
        }
        try{
            let result = await fetch("/api/admin/nextResult", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(odseqList) 
            });
    
            if(!result.ok) return alert("오류발생!");
            let data = await result.json();
            setOrderList([]);
            setHasMore(true);
            setPage(1);
            
        }catch(err){console.error(err);}
    }

    function pushOdseqList(odseq ,check){
        if(check) setOdseqList(prev=>[...prev,odseq]);
        else setOdseqList(prev => prev.filter((value , idx ,arr)=> value !== odseq));

        console.log(odseqList);
    }

    function deliverStyle(result){
        if( result=='1') {return {color:"red"}}
        if( result=='2') {return {color:"green"}}
        if( result=='3') {return {color:"blue"}}
        if( result=='4') {return {color:"gray"}}
    }
    return (
        <div className='adminContainer'>
            <SubMenu />
            <div className='btns' style={{display:"flex", margin:"5px"}}>
            <input type="text" value={search} onChange={(e)=>{setSearch(e.currentTarget.value)}} /> <button onClick={searchgo}>검색</button>
                <button style={{marginLeft:"auto"}} onClick={()=>{ nextPress() }}>다음 단계로</button>
            </div>
            <div className='productTable'>
                <div className='row'>
                    <div className='col'>선택</div>
                    <div className='col'  style={{flex:"1"}}>주문번호(처리상태)</div>
                    <div className='col'>상품명</div>
                    <div className='col'>주문자</div>
                    <div className='col'  style={{flex:"2"}}>배송주소</div>
                    <div className='col'>가격</div>
                    <div className='col'>주문일</div>
                </div>
                {
                    (orderList)?(
                        orderList.map((order, idx)=>{
                            return (
                                <div className='row' key={idx}>
                                    <div className='col'>
                                        <input type="checkbox" value={order.odseq} onChange={(e)=>{
                                            pushOdseqList(order.odseq ,e.target.checked);
                                        }} />
                                    </div>
                                    <div className='col'  style={{flex:"1"}}>
                                       <span style={deliverStyle(order.result)}>{order.oseq}-{order.odseq}<br/>({ onResult(order.result) }) </span> 
                                    </div>
                                    <div className='col'>{order.pname}</div>
                                    <div className='col'>{order.userid}({order.mname})</div>
                                    <div className='col' style={{flex:"2"}}>{order.address1} {order.address2}</div>
                                    <div className='col'>{order.price2}</div>
                                    <div className='col'>{order.indate.substring(0, 10)}</div>
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

export default OrderList
