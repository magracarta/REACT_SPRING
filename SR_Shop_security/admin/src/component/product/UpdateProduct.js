import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import SubMenu from '../SubMenu';

function UpdateProduct() {
    const {pseq} = useParams();
    const navigate = useNavigate();
    const [name , setName ] = useState(""); 
    const [price1 , setPrice1 ] = useState(""); 
    const [price2 , setPrice2 ] = useState(""); 
    const [price3 , setPrice3 ] = useState(""); 
    const [content , setContent ] = useState(""); 
    const [kind , setKind ] = useState(""); 
    const [image , setImage] = useState(null);
    const [imgSrc , setImgSrc ] = useState("");
    const [originsavefilename , setSavefilename] = useState("");
    const [originImg , setOrignImg] = useState("");
    const [useyn, setUseyn] = useState("");
    const [bestyn, setBestyn] = useState("");

    useEffect(
        ()=>{
            fetch("/api/admin/getProduct/"+pseq).then(response=> response.json())
            .then((data)=>{
                setName(data.product.name);
                setPrice1(data.product.price1);
                setPrice2(data.product.price2);
                setContent(data.product.content);
                setKind(data.product.kind);
                setSavefilename(data.product.savefilename);
                setOrignImg(data.product.image);
                setUseyn(data.product.useyn);
                setBestyn(data.product.bestyn);
                document.querySelector("option[value='"+data.product.kind+"']").selected = true;
                document.querySelector(".useyn input[value='"+data.product.useyn+"']").checked = true;
                document.querySelector(".bestyn input[value='"+data.product.bestyn+"']").checked = true;
            }).catch((err)=>{console.error(err);});
        },[]
    )

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
        
        const product = {
            name: name,
            price1: price1,
            price2: price2,
            price3: price3,
            content: content,
            useyn: useyn,
            bestyn: bestyn,
            kind: kind,
            image: originImg,
            savefilename: originsavefilename
        };
    
        formData.append('product', new Blob([JSON.stringify(product)], {type: "application/json"}));
        formData.append('savefilename', originsavefilename);
        if (image) formData.append('file', image);

        fetch("/api/admin/updateProduct/"+pseq,{
            method:"POST",
            body:formData
        }).then(response=>{
            return response.json();
        }).then(data=>{
           if(data) navigate("/productView/"+pseq);
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
            
            <div className="field useyn">
                <label style={{flex:"3"}}>판매 노출</label>
                YES : <input type="radio" value="Y" name="useyn" onChange={(e)=>{ setUseyn( e.currentTarget.value )}}/>
                NO : <input type="radio" value="N" name="useyn" onChange={(e)=>{ setUseyn( e.currentTarget.value )}}/>
            </div>
            <div className="field bestyn">
                <label  style={{flex:"3"}}>베스트 상품</label>
                YES : <input type="radio" value="Y" name="bestyn" onChange={(e)=>{ setBestyn( e.currentTarget.value )}}/>
                NO : <input type="radio" value="N" name="bestyn" onChange={(e)=>{ setBestyn( e.currentTarget.value )}}/>
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
                <label>원래 이미지</label>
                <div><img src={"http://localhost:8070/product_images/" +originsavefilename} width="200" /></div>
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
                <button onClick={ ()=>{  onSubmit();  } }>상품 수정</button>
                <button onClick={()=>{ navigate("/productList") }}>돌아가기</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateProduct
