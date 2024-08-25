import axios from 'axios'
import React, { useEffect, useState } from 'react'
import SubImg from './SubImg'
import SubMenu from './SubMenu'
import "../../style/mypage.css"
import { json, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'



function Cartlist() {
    const loginuser = useSelector(state=>state.user);
    const [ checkList ,setChecklist] = useState([]);
    const navigate = useNavigate();
    const [cartList, setCartList ] = useState([]);
    const [totalPrice , setTotalPrice] = useState(0);

    // let checkList = []; //클릭해서 체크된 체크박스 내용유지 용도의 배열

    useEffect(()=>{
        if(!loginuser.userid){
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
            return;
        }
        cartFunction();
    },[]);

    useEffect(()=>{
        setChecklist(prev=> prev.filter((value) => document.querySelector(`input[value="${value}"]`) !== null));
        document.querySelectorAll(`input[type="checkbox"]`).forEach(elem=>{
            elem.checked = false;
        })
        
    },[cartList]);

    function onCheck(cseq , checked){
        if(checked){
            setChecklist(prev => [...prev , cseq]);
        }else{
            setChecklist(prev => prev.filter((value , idx ,arr)=> value != cseq ));
           
            //filter 메서드 :  checklist의 값들을 value변수에 하나씩 넣으며, 배열의 요소만큼 실행
            //cseq 값과 비교하여 같지 않은 요소들만 반환하고 이들을 다시 배열로 생성
        }
        
    }
    async function onDeleteCart(){
        if(cartList.length===0) return alert("삭제할 항목을 선택하세요.");
       try{
        await axios.delete(`/api/cart/deletecart`, {
            data:checkList,
            headers:{
                'Content-Type': 'application/json'
            }
        });
        cartFunction();
       }catch(err){
        console.error(err);
       }

    }

    function cartFunction(){
        axios.get("/api/cart/cartlist/"+loginuser.userid).then(result=>{
            setCartList(result.data.cartList);
            setTotalPrice(result.data.totalPrice);
        }).catch(err => {
            console.error(err);
            
        });
    }

    async function onsubmit(){
        if(checkList.length === 0)return alert("주문할 항목을 선택하세요.");
        //orders 테이블에 레코드를 추가하고 oseq를 받아옵니다.
        try{
            const result = await axios.get("/api/order/insertorders/"+loginuser.userid);
            const oseq = result.data.oseq;

            //oseq checklist에 있는 cseq로 order_detail에 레코드를 추가합니다.
            await axios.post("/api/order/insertOrderDetail", checkList ,{
                    params: {oseq},
                    headers:{ 'Content-Type': 'application/json'}
            } );

            if(window.confirm('주문내역으로 이동하시겠습니까?')) navigate(`/orderList/${oseq}`);
            else cartFunction();
            
        }catch(err){
            console.error(err);
        }
    }
    return (
        <article>
            <SubImg />
            <div className='subPage'>
                <SubMenu />
                <div className='cartlist'>
                    <h2>장바구니</h2>
                    {
                        (cartList)?(
                            <div className='tb'>
                                <div className='row'>
                                    <div className='coltitle'>상품명</div>
                                    <div className='coltitle'>수 량</div>
                                    <div className='coltitle'>가 격</div>
                                    <div className='coltitle'>주문일</div>
                                    <div className='coltitle'>삭 제</div>
                                </div>
                                {
                                    cartList.map((v,k)=>(
                                        <div className='row' key={k}>
                                            <div className='col'>{v.pname}</div>
                                            <div className='col'>{v.quantity}</div>
                                            <div className='col'>{new Intl.NumberFormat('ko-kr').format(v.price2*v.quantity)} 원</div>
                                            <div className='col'>{v.indate.substring(2,10)}</div>
                                            <div className='col'>
                                                <input type="checkbox" value={v.cseq} onChange={
                                                    (e)=>{
                                                        onCheck(e.currentTarget.value , e.currentTarget.checked);
                                                    }
                                                }/>
                                            </div>
                                        </div>
                                            
                                    ))  
                                } 

                                <div className='row'>
                                    <div className='col' style={{background:"blue" , color:"white" , flex:"2"}}>
                                        총액
                                    </div>
                                    <div className='col' style={{flex:"2", textAlign:"left"}}>
                                        &nbsp;&nbsp;&nbsp;{new Intl.NumberFormat('ko-kr').format(totalPrice)} 원
                                    </div>
                                    <div className='col' style={{flex:"1"}}>
                                        <button onClick={()=>{onDeleteCart()}}>삭제</button>
                                    </div>
                                </div> 
                                <div className='btn' style={{display:"flex" }}>
                                    
                                    <button style={{ background:"blue", padding:"5px", color:"#fff" , background:"#000" , margin:"3px"}} onClick={()=>{navigate("/")}}>쇼핑 계속하기</button>
                                    <button style={{ background:"blue", padding:"5px", color:"#fff" , background:"#000" , margin:"3px"}} onClick={()=>{onsubmit()}}>주문하기</button>
                                </div>
                            </div>
                        
                        ):(<h3>장바구니가 비었습니다.</h3>)
                    }
                </div>
            </div>
        </article>
    )
}

export default Cartlist
