import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubMenu from '../SubMenu'

function WriteProduct() {
    const navigate = useNavigate();
    const [name , setName ] = useState(""); 
    const [price1 , setPrice1 ] = useState(""); 
    const [price2 , setPrice2 ] = useState(""); 
    const [price3 , setPrice3 ] = useState(""); 
    const [content , setContent ] = useState(""); 
    const [kind , setKind ] = useState(""); 
    const [image , setImage] = useState(null);
    const [imgSrc , setImgSrc ] = useState("");

    useEffect(()=>{
        setPrice3(price1 - price2);
    },[price1,price2]);
    
    function fileup(event) {
        const input = event.target;
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function(e) {
            setImgSrc(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        setImage(input.files[0]);
        } else {
            setImgSrc("");
        }
    }

    function onSubmit(){
        if(!kind) return alert("종류를 입력해주세요."); 
        if(!name) return alert("이름을 입력해주세요."); 
        if(!price1) return alert("price1을 입력해주세요."); 
        if(!price2) return alert("price2을 입력해주세요."); 
        if(!content) return alert("내용을 입력해주세요."); 

        const formData = new FormData();
        
        formData.append('name', name);
        formData.append('price1', price1);
        formData.append('price2', price2);
        formData.append('price3', price3);
        formData.append('content', content);
        formData.append('kind', kind);
        if (image) formData.append('image', image);

        fetch("/api/admin/insertProduct",{
            method:"POST",
            body:formData
        }).then(response=>{
            return response.json();
        }).then(data=>{
            navigate("/productList");
        }).catch((err)=>{console.error(err)})

    }
    function selected(e){
        setKind(e.target.value);
    }
  return (
    <div className='adminContainer'>
        <SubMenu />
        <h2>상품 등록</h2>
        <div className='productTable'>
            <div className="field">
                <label>상품 종류</label>
                <select style={{flex:"5"}} onChange={(e)=>{selected(e)}}>
                    <option value="">종류 선택</option>
                    <option value="1">HEEL</option>
                    <option value="2">BOOTS</option>
                    <option value="3">SANDAL</option>
                    <option value="4">SNEAKERS</option>
                    <option value="5">SLEEPERS</option>
                </select>
            </div>
            <div className="field">
                <label>상품명</label>
                <input type="text" value={name} onChange={(e)=>{ setName( e.currentTarget.value )}}/>
            </div>
            <div className="field">
                <label>원가</label>
                <input type="text"  value={price1} onChange={(e)=>{ setPrice1( e.currentTarget.value )}}/>
            </div>
            <div className="field">
                <label>판매가</label>
                <input type="text"  value={price2} onChange={(e)=>{ setPrice2( e.currentTarget.value )}}/>
            </div>
            <div className="field">
                <label>마진</label>
                <input type="text"  value={price3} readOnly/>
            </div>
            <div className="field">
                <label>상품설명</label>
                <input type="text"  value={content} onChange={(e)=>{ setContent( e.currentTarget.value )}}/>
            </div>
            <div className="field">
                <label>이미지</label>
                <input type="file" onChange={fileup}/>
            </div>
            <div className="field">
                <label>이미지 미리보기</label>
                <div><img src={imgSrc} width="200" /></div>
            </div>
            <div className='btns'>
                <button onClick={ ()=>{  onSubmit();  } }>상품등록</button>
                <button onClick={()=>{ navigate("/productList") }}>돌아가기</button>
            </div>
        </div>
    </div>
  )
}

export default WriteProduct
