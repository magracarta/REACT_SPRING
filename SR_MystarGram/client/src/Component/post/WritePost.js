import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from 'react-redux';

import MainMenu from '../MainMenu';

import '../../style/writePost.css'

function WritePost() {

    const navigate=useNavigate();
    const [content, setContent] = useState('');
    const [word, setWord] = useState('')
    const [loginUser, setLoginUser ] = useState({});
    const lUser = useSelector( state=>state.user );

    const [ imgsrc1, setImgsrc1 ] = useState('');
    const [ imgsrc2, setImgsrc2 ] = useState('');
    const [ imgsrc3, setImgsrc3 ] = useState('');
    const [ imgsrc4, setImgsrc4 ] = useState('');
    const [ imgsrc5, setImgsrc5 ] = useState('');
    const [ imgsrc6, setImgsrc6 ] = useState('');
    const [ imgsrc7, setImgsrc7 ] = useState('');
    const [ imgsrc8, setImgsrc8 ] = useState('');
    const [ imgsrc9, setImgsrc9 ] = useState('');
    const [ imgsrc10, setImgsrc10 ] = useState('');

    const [ divStyle2, setDivStyle2 ] = useState({display:'none'});
    const [ divStyle3, setDivStyle3 ] = useState({display:'none'});
    const [ divStyle4, setDivStyle4 ] = useState({display:'none'});
    const [ divStyle5, setDivStyle5 ] = useState({display:'none'});
    const [ divStyle6, setDivStyle6 ] = useState({display:'none'});
    const [ divStyle7, setDivStyle7 ] = useState({display:'none'});
    const [ divStyle8, setDivStyle8 ] = useState({display:'none'});
    const [ divStyle9, setDivStyle9 ] = useState({display:'none'});
    const [ divStyle10, setDivStyle10 ] = useState({display:'none'});

    const [imgList, setIimgList] = useState([]);

    const fieldStyle={
        width:"100%", 
        display: "flex",
        flexDirection:"row",
        margin:"5px 0",
        justifyContent: "space-between",
        border:"1px solid black",
    }

    useEffect(
        ()=>{
            // axios.get('/api/member/getLoginUser')
            // .then((result)=>{
            //     if(!result.data.loginUser){
            //         alert('로그인이 필요합니다');
            //         navigate('/');
            //     }
            //     setLoginUser( result.data.loginUser );
            // })
            // .catch((err)=>{console.error(err)})
        },[]
    )

    async function imgUpload(e, n){
        let formData = new FormData();
        formData.append('image', e.target.files[0] );
        const result = await axios.post('/api/post/imgup', formData);

        if( n == 1){
            setDivStyle2( fieldStyle );
            setImgsrc1( `http://localhost:8070/uploads/${result.data.filename}`);
        }else if( n == 2){
            setDivStyle3( fieldStyle );
            setImgsrc2( `http://localhost:8070/uploads/${result.data.filename}`);
        }else if( n == 3){
            setDivStyle4( fieldStyle );
            setImgsrc3( `http://localhost:8070/uploads/${result.data.filename}`);
        }else if( n == 4){
            setDivStyle5( fieldStyle );
            setImgsrc4( `http://localhost:8070/uploads/${result.data.filename}`);
        }else if( n == 5){
            setDivStyle6( fieldStyle );
            setImgsrc5( `http://localhost:8070/uploads/${result.data.filename}`);
        }else if( n == 6){
            setDivStyle7( fieldStyle );
            setImgsrc6( `http://localhost:8070/uploads/${result.data.filename}`);
        }else if( n == 7){
            setDivStyle8( fieldStyle );
            setImgsrc7( `http://localhost:8070/uploads/${result.data.filename}`);
        }else if( n == 8){
            setDivStyle9( fieldStyle );
            setImgsrc8( `http://localhost:8070/uploads/${result.data.filename}`);
        }else if( n == 9){
            setDivStyle10( fieldStyle );
            setImgsrc9( `http://localhost:8070/uploads/${result.data.filename}`);
        }else if( n == 10){
            setImgsrc2( `http://localhost:8070/uploads/${result.data.filename}`);
        }

        let arr = [...imgList];
        arr.push(result.data.filename);
        setIimgList( [...arr] );
        console.log(imgList);

    }

    async function onSubmit(){
        if(!content){return alert('내용을 입력하세요');}
        if(!imgList) {return alert('이미지를 하나이상 선택하세요')}

        // content 와 작성자로  post 테이블에 레코드를 추가. 이때 insert 된 레코드의 id 를 리턴 
        const result = await axios.post('/api/post/writePost', { content, writer:lUser.nickname} )
        let postid = result.data.postid;

        // 리턴 아이디와  이미지 이름들로  images 테이블에 레코드들을 추가
        for( let i=0; i<imgList.length; i++){
            await axios.post('/api/post/writeImages', { postid, savefilename:imgList[i] });
        }
        //window.location.href='http://localhost:3000/main
        navigate('/main');
    }

    return (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            
            <MainMenu setWord={setWord}/>

            <div className='postWrite'>
                <div className='title' style={{fontFamily:"Dancing Script" , fontSize:"150%"}}>Feed Write</div>
                <div className='field'>
                    <label>content</label>
                    <textarea rows="7" value={content} onChange={
                        (e)=>{ setContent( e.currentTarget.value ) }
                    }></textarea>
                </div>

                <div className='field' id='img1'>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 1) }} />
                </div>
                <img src={imgsrc1} height="50"/>

                <div className='field' id='img2' style={divStyle2}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 2) }} />
                </div>
                <img src={imgsrc2} height="50"/>

                <div className='field' id='img3' style={divStyle3}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 3) }} />
                </div>
                <img src={imgsrc3} height="50"/>

                <div className='field' id='img4' style={divStyle4}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 4) }} />
                </div>
                <img src={imgsrc4} height="50"/>

                <div className='field' id='img5' style={divStyle5}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 5) }} />
                </div>
                <img src={imgsrc5} height="50"/>

                <div className='field' id='img6' style={divStyle6}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 6) }} />
                </div>
                <img src={imgsrc6} height="50"/>

                <div className='field' id='img7' style={divStyle7}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 7) }} />
                </div>
                <img src={imgsrc7} height="50"/>

                <div className='field' id='img8' style={divStyle8}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 8) }} />
                </div>
                <img src={imgsrc8} height="50"/>

                <div className='field' id='img9' style={divStyle9}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 9) }} />
                </div>
                <img src={imgsrc9} height="50"/>

                <div className='field' id='img10' style={divStyle10}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 10) }} />
                </div>
                <img src={imgsrc10} height="50"/>

                <div className='btns'>
                    <button onClick={ ()=>{ onSubmit() } }>작성완료</button>
                    <button onClick={ ()=>{ navigate('/main') } }>Main으로</button>
                </div>

            </div>
        </div>
    )
}

export default WritePost
