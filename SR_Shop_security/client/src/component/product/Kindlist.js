import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import SubImg from './SubImg'
import SubMenu from './SubMenu'
import "../../style/prodcut.css";

function Kindlist() {
    const [itemList, setItemList] = useState([]);
    const [kindword , setKindWord] = useState("");
    const navigate = useNavigate();
    const {kind} = useParams();
    

    useEffect(
        ()=>{
            axios.get(`/api/product/kindlist/${kind}`).then((result)=>{
                console.log(result.data);
                setItemList(result.data);
            }).catch((err)=>{console.error(err)});
        },[kind]
    )
    
  return (
    <article>
      <SubImg/>
      <div className='subPage'>
        <SubMenu />
        <div className='kindList' style={{flex:"4", border:"1px dotted blue"}}>
            <div className='itemList'>
                {
                    (itemList)&&(
                        itemList.map((v , k)=>(
                            <div className='item' key={k} onClick={()=>{ navigate("/productDetail/"+v.pseq) }}>
                                <div className="image">
                                    <img src={`http://localhost:8070/product_images/${v.image}`} />
                                </div>
                                <div className='name'>{v.name}</div>
                                <div className='price'>{v.price2}</div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
      </div>
      
    </article>
  )
}

export default Kindlist
