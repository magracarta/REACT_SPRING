import axios from 'axios'
import React, { useEffect, useState } from 'react'
import SubImg from './SubImg'
import SubMenu from './SubMenu'
import"../../style/product.css";
import { useNavigate  , useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProductDetail() {
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const loginUser = useSelector(state=> state.user);
    const [quantity , setQuantity] = useState(1);
    const {pseq} = useParams();

    useEffect(
        ()=>{
            axios.get(`/api/product/getProduct/${pseq}`)
            .then((result)=>{
                console.log(result.data);
                setProduct(result.data.product);
            }).catch((err)=>{
                console.error(err);
            });
        },[]
    )

    async function goCart(){
        if(loginUser.userid == ''){
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }else{
            try{
                await axios.post('/api/cart/insertCart',{pseq, userid : loginUser.userid , quantity});
                let ans = window.confirm('장바구니에 상품을 추가했어요, 장바구니로 이동할까요?');
                if(ans){
                    navigate("/cartlist");
                }
            }catch(err){
                console.error(err)
            }
        }
    }

    async function orderOne(){
        if(loginUser.userid == ''){
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }
        try{
            if(!window.confirm("현재 상품을 주문하시겠습니까?")) return false;
            const result = await axios.post('/api/order/insertOrderOne', {pseq: pseq, quantity: quantity}, {
                params: {userid: loginUser.userid},
                headers: {'Content-Type': 'application/json'}
            });
            // const result = await axios.post('/api/order/isertOrder',null ,{params:{pseq, userid : loginUser.userid , quantity}});
            let ans = window.confirm('주문이 완료되었습니다. 주문내역으로 이동할까요?');
            if(ans){
                navigate("/orderList/"+result.data.oseq);
            }
        }catch(err){
            console.error(err)
        }
    }
    return (
        <article>
            <SubImg />
            <div className='subPage'>
                <SubMenu />
                <div className='productdetail'>
                    <div className='detail'>
                        <div className='detailimg'>
                            <img src={`http://localhost:8070/product_images/${product.savefilename}`}></img>
                        </div>
                        <div className='detailinfo'>
                            <div className='field'>
                                <label>제 품 명</label><div>{product.name}</div>
                            </div>
                            <div className='field'>
                                <label>가 격</label><div>{product.price2} 원</div>
                            </div>
                            <div className='field'>
                                <label>수 량</label><input type='text' value={quantity}
                                    onChange={(e)=>{
                                        setQuantity(e.currentTarget.value);
                                    }}
                                />
                                <input type="button" value="장바구니에 담기" onClick={()=>{goCart();}}/>
                                <input type="button" value="즉시구매" onClick={()=>{orderOne();}}/>
                                <input type="button" value="메인으로" onClick={()=>{navigate("/")}}/>

                            </div>
                        </div>
                    </div>
                        <div className='itemdetail-content'><pre>{product.content}</pre></div>
                </div>
            </div>
        </article>
    )
}

export default ProductDetail
