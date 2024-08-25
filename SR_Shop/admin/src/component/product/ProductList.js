import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../../style/admin.css"
import SubMenu from '../SubMenu'

function ProductList() {
    const [productList,setProductList] = useState([]);
    const [page , setPage] = useState(1);
    const navigate = useNavigate();
    const observbox = useRef(null);
    const [hasmore ,setHasMore] = useState(true);
    const [search , setSearch] = useState("");

    useEffect(()=>{
        setPage(1);
    },[]);

    useEffect(()=>{
        callProductList(page,search);
    },[page]);

    function callProductList(page ,search){
        console.log(page);
        
        axios.get("/api/admin/getProductList/" + page, {
            params: { search } // '검색어'를 실제 검색어로 대체하세요
        }).then((result)=>{
            setProductList(prev => [...prev, ...result.data.productList]);
            if(result.data.productList.length ==0) setHasMore(false);
        }).catch((err)=>{
            console.error(err);
        });
    }

    const interciption = (entries)=>{
        if(entries[0].isIntersecting && hasmore) setPage(prev => prev+1);
    }

    useEffect(()=>{
        const observer = new IntersectionObserver(interciption,{
            rootMargin:"0px",
            threshold:1.0
        });
        if(observbox.current) observer.observe(observbox.current);

        return()=>{
            if(observbox.current) observer.unobserve(observbox.current);
        }
    },[hasmore]); 

    const searchgo = async()=>{
       setProductList([]);
       setHasMore(true);
       setPage(1);
    }

  return (
    <div className='adminContainer'>
        <SubMenu />
        <div className='btns' style={{ display: "flex", margin: "5px" }}>
            <input type="text" value={search} onChange={(e)=>{setSearch(e.currentTarget.value)}} /> <button onClick={searchgo}>검색</button>
            <button style={{ marginLeft: "auto" }} onClick={() => { navigate('/writeProduct') }}>상품등록</button>
        </div>
        <div className='productTable'>
            <div className='row'>

                <div className='col'>번호</div>
                <div className='col'>상품명</div>
                <div className='col'>원가</div>
                <div className='col'>판매가</div>
                <div className='col'>등록일</div>
                <div className='col'>사용유무</div>
            </div>
     
        {
            (productList) ? (
                productList.map((product, idx) => {
                    return (
                            <div className='row' key={idx}>
                                <div className='col'>{product.pseq}</div>
                                <div className='col' style={{cursor:"pointer"}} onClick={()=>{navigate(`/productView/${product.pseq}`)}}>{product.name}</div>
                                <div className='col'>{new Intl.NumberFormat('ko-KR').format(product.price1)}</div>
                                <div className='col'>{new Intl.NumberFormat('ko-KR').format(product.price2)} 원</div>
                                <div className='col'>{product.indate&&product.indate.substring(0, 10)}</div>
                                <div className='col'>{product.useyn}</div>
                            </div>
                        
                    )
                })
            ) : (null)
        }
     </div>
        <div ref={observbox} style={{height:"10px"}}></div>
    </div>
  )
}

export default ProductList
