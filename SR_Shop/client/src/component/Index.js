import React, { useEffect, useState } from 'react'
import "../style/index.css"
import axios from "axios"
import { useNavigate } from 'react-router-dom'

function Index() {

  //화면 구성에 필요한 state 변수 생성
  const [bestProduct , setBestProduct] = useState();
  const [newProduct , setNewProduct]= useState();
  
  let navigate = useNavigate();    

  //state 변수에 저장될 내용 서버에서 조회
  useEffect(()=>{
    axios.get('/api/product/bestPro')
    .then(result=>{ setBestProduct(result.data.bestProduct)})
    .catch(err=>{console.error(err)});
    axios.get('/api/product/newPro')
    .then(result=>{ setNewProduct(result.data.newProduct)})
    .catch(err=>{console.error(err)});
  },[]);

 //필요한 함수 정의

  return (
    <article>
        <div className='main_img'>
            <img src='http://localhost:8070/images/main_img.jpg' />
        </div>
        <h2>Best Item</h2>
        <div className='itemList'>
            {
                (bestProduct)&&(
                    bestProduct.map((v,k)=>{
                        return (
                            <div className='item' key={k}  onClick={()=>{ navigate("/productDetail/"+v.pseq) }}>
                                <div className="image">
                                    <img src={`http://localhost:8070/product_images/${v.image}`} />
                                </div>
                                <div className='name'>{v.name}</div>
                                <div className='price'>{v.price2}</div>
                            </div>
                        )
                    })
                )
            }
        </div>
        <h2>New Item</h2>
        <div className='itemList'>
              {
                (newProduct)&&(
                    newProduct.map((v,k)=>{
                        return (
                            <div className='item' key={k}  onClick={()=>{ navigate("/productDetail/"+v.pseq) }}>
                                <div className="image">
                                    <img src={`http://localhost:8070/product_images/${v.image}`} />
                                </div>
                                <div className='name'>{v.name}</div>
                                <div className='price'>{v.price2}</div>
                            </div>
                        )
                    })
                )
            }
        </div>
    </article>
  )
}

export default Index
