import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SubMenu from '../SubMenu';

function ProductView() {
    const [product , setProduct] = useState({});
    const {pseq} = useParams();
    const navigate = useNavigate();

    useEffect(
        ()=>{
            fetch("/api/admin/getProduct/"+pseq).then(response=> response.json())
            .then((data)=>{
                setProduct(data.product);
            }).catch((err)=>{console.error(err);})
        },[]
    )

    const categoryFn=(num)=>{
        if(num == 1) return "HEEL";
        if(num == 2) return "BOOTS";
        if(num == 3) return "SANDALS";
        if(num == 4) return "SNEAKERS";
        if(num == 5) return "SLEEPERS";
    }

    const deleteProduct = (pseq)=>{
        fetch("/api/admin/deleteProduct/"+pseq).then(response=>{
            if(!response.ok)  throw new Error(response.status);
            return  response.json();
        })
        .then((data)=>{
           if(data.msg == "ok") {
            alert("삭제에 성공했습니다.");
            navigate("/productList");
           }
        }).catch((err)=>{console.error(err);})
    }
  return (
    <div className='adminContainer'>
        <SubMenu />

        <h2>Product View</h2>
        <div className='productTable'>
            <div className="field">
                <label>카테고리</label><div>{categoryFn(product.kind)}</div>
            </div>
            <div className="field">
                <label>상품명</label><div>{product.name}</div>
            </div>
            <div className="field">
                <label>판매 노출</label><div>{product.useyn == "Y"? "YES" :"NO"}</div>
            </div>
            <div className="field">
                <label>베스트 상품</label><div>{product.bestyn == "Y"? "YES" :"NO"}</div>
            </div>
            <div className="field">
                <label>원가</label><div>{product.price1}</div>
            </div>
            <div className="field">
                <label>판매가</label><div>{product.price2}</div>
            </div>
            <div className="field">
                <label>마진</label><div>{product.price3}</div>
            </div>
            <div className="field">
                <label>상품설명</label><div>{product.content}</div>
            </div>
            <div className="field">
                <label>이미지</label>
                <div><img src={`http://localhost:8070/product_images/${product.savefilename}`} width="200" /></div>
            </div>
            <div className='btns'>
                <button onClick={()=>{navigate("/updateProduct/"+product.pseq)}}>수정</button>
                <button onClick={()=>{ deleteProduct(product.pseq) }}>삭제</button>
                <button onClick={()=>{navigate("/productList")}}>돌아가기</button>
            </div>
        </div>
    </div>
  )
}

export default ProductView
