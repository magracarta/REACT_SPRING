import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import SubImg from './SubImg'
import SubMenu from './SubMenu'

function OrderAll() {
    const loginUser = useSelector(state =>  state.user);
    const [orderList, setOrderList] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get("/api/order/getOderAll/"+loginUser.userid).then((result)=>{
            console.log(result.data.orderList);
            setOrderList(result.data.orderList);
        }).catch(err=>{console.error(err);})
    },[]);
    return (
        <article>
            <SubImg />
            <div className='subPage'>
                <SubMenu />
                <div className='orderdetail'>
                    <h2>총 주문 내역</h2><br/>
                    <div className='orderTable'>
                        <div className='row'>
                            <div className='col'>주문 일자</div>
                            <div className='col'>주문 번호</div>
                            <div className='col'>상품명</div>
                            <div className='col'>결제 금액</div>
                            <div className='col'>주문 상세</div>
                        </div>
                        {
                            (orderList)?(orderList.map((order , idx)=>(
                                <>
                                <div className='row'>
                                    <div className='col'>{order.indate.substring(0,10)}</div>
                                    <div className='col'>{order.oseq}</div>
                                    <div className='col'>{order.pname}</div>
                                    <div className='col'>{new Intl.NumberFormat("Ko-kr").format(order.price2)}</div>
                                    <div className='col'  onClick={
                                        ()=>{navigate("/orderList/"+order.oseq)}
                                    }>상세보기</div>
                                </div>
                                </>
                            ))):("현재 진행중익 주문내역이 없습니다.")
                        }
                    </div>
                </div>
            </div>
        </article>
    )
}

export default OrderAll
