import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SubMenu from './SubMenu'
import SubImg from './SubImg'
import "../../style/mypage.css"
import { useSelector } from 'react-redux'

function OrderList() {
  const [orders, setOrders] = useState([]); //주문상품들
  const [totalPrice , setTotalPrice] = useState(0);
  const [orderDetail , setOrderDetail] = useState({}); //구매자 정보가 들어있는 주문건 하나

  const loginUser = useSelector(state =>  state.user);
  const navigate = useNavigate();
  const {oseq} = useParams();

  useEffect(()=>{
    getOrderList();
  },[]);

  function onReslut(result){
    if(result=="1") return "결제 완료";
    if(result=="2") return "배송중";
    if(result=="3") return "배송완료";
    if(result=="4") return "구매확정";
  }


  function getOrderList(){
    axios.get(`/api/order/getOrders/${oseq}`).then(result=>{
      setOrders(result.data.list);
      setTotalPrice(result.data.totalPrice);
      setOrderDetail(result.data.orderDetail);

    }).catch(err=>{console.error(err)});
  }

  async function purchase(odseq){
    if(window.confirm('구매 확정이 완료되면 교환/환불이 불가합니다. 구매확정하시겠습니까?')){
        let result = await fetch("/api/order/purchase?odseq="+odseq,{method:"GET"});
        if( result.ok ) getOrderList();
    }else{
      return;
    }
  }

  function deliverStyle(result){
    if( result=='1') {return {color:"red"}}
    if( result=='2') {return {color:"green"}}
    if( result=='3') {return {color:"blue"}}
    if( result=='4') {return {color:"gray"}}
}

  return (
    <article>
        <SubImg />
        <div className='subPage'>
            <SubMenu />
            <div className='orderdetail'>
                <h2>주문상세</h2><br/>
                <h3>주문자 정보</h3>
                <div className='orderDetailTable'>
                  <div className='row'>
                    <div className='col'>주문 번호</div>
                    <div className='col'>주문자 성명</div>
                    <div className='col'>주문자 총액</div>
                  </div>
                  {
                  (orderDetail)?(
                    <>
                      <div className='row'>
                        <div className='col'>{orderDetail.oseq}</div>
                        <div className='col'>{orderDetail.mname}</div>
                        <div className='col'>{new Intl.NumberFormat("Ko-KR").format(totalPrice)} 원</div>
                      </div>
                      <div className='row'>
                        <div className='col'>배송 주소</div>
                        <div className='col'>{orderDetail.zip_num}</div>
                        <div className='col'>&nbsp;&nbsp;{orderDetail.address1}&nbsp;&nbsp;{orderDetail.address2}</div>
                      </div>
                    </>
                    
                  ):(null)
                }
                </div>
                
                
                <h3>주문자 상품</h3>
                <div className='orderTable'>
                    <div className='row'>
                        <div className='col'>상품명</div>
                        <div className='col'>상품별 주문번호</div>
                        <div className='col'>수량</div>
                        <div className='col'>가격</div>
                        <div className='col'>처리상태</div>
                        <div className='col'></div>
                    </div>
                    {
                        (orders)?(
                            orders.map((order, idx)=>{
                                return (
                                    <div className='row' key={idx}>
                                        <div className='col'>{order.pname}</div>
                                        <div className='col'>{order.odseq}</div>
                                        <div className='col'>{order.quantity}</div>
                                        <div className='col'>{new Intl.NumberFormat("Ko-KR").format(order.price2 * order.quantity)} 원</div>
                                        <div className='col' style={deliverStyle(order.result)}>{onReslut(order.result)}</div>
                                        <div className='col'>{(order.result == "3")?(<button onClick={()=>{
                                          purchase(order.odseq);
                                        }}>구매확정</button>):(null)}</div>
                                    </div>
                                )
                            })
                        ):(null)
                    }
                </div>  
                <div className='btns' style={{marginTop:"30px"}}>
                  <button style={{background:"blueviolet", color:"white" , marginRight:"2px"}} onClick={()=>{navigate("/")}}>메인으로</button>
                  <button style={{background:"blueviolet", color:"white"}} onClick={()=>{navigate("/mypage")}}>마이페이지로</button>
                </div>
            </div>
          </div>
    </article>
  )
}

export default OrderList
