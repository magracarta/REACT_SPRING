import React ,{useState, useEffect} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

import '../../style/board.css';
import { useSelector } from 'react-redux';

function UpdateBoard() {

    const loginUser = useSelector(state => state.user);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [pass, setPass] = useState("");
    const [oldPass, setOldPass] = useState("");
    const [image, setImage] = useState("");
    const [saveFileName, setSaveFileName] = useState("");
    
    const [oldImgSrc, setOldImgSrc] = useState('');

    const [imgStyle, setImgStyle] = useState({display:'block'});
    const [imgSrc, setImgSrc] = useState('http://via.placeholder.com/200x150')
    const navigate = useNavigate();
    const {num} = useParams();

    useEffect(
        ()=>{
         
            axios.get(`/api/board/getBoard/${num}`)
            .then((result)=>{
                setTitle( result.data.board.title ) ;
                setContent( result.data.board.content ) ;
                setImage( result.data.board.image ) ;
                setSaveFileName( result.data.board.savefilename );
                setOldPass( result.data.board.pass );
                setOldImgSrc( `http://localhost:8070/images/${result.data.board.savefilename}`)
            })
            .catch((err)=>{console.log(err)})
        },[]
    );

    function onSubmit(){
        if( oldPass != pass){return alert('수정 패스워드가 일치하지 않습니다')}
        axios.post(`/api/board/updateBoard`, { num , title, content, image, savefilename:saveFileName})
        .then(()=>{
            navigate(`/boardView/${num}`);
        })
        .catch((err)=>{
            console.error(err);
        })
    }

    async function onFileUpload(e){
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        const result = await axios.post('/api/board/fileupload', formData);
        setSaveFileName(result.data.savefilename);
        setImage(result.data.image);

        setImgSrc( `http://localhost:8070/images/${result.data.savefilename}` );
        setImgStyle({width:"300px"});
    }

    return (
        <div className='writeBoard'>
            <h2>Board Update Form</h2>
            <div className='field'>
                <label>작성자</label><input type="text" value={loginUser.userid} readOnly/>
            </div>
            <div className='field'>
                <label>이메일</label><input type="text"  value={loginUser.email} readOnly/>
            </div>
            <div className='field'>
                <label>PASS</label><input type="password"  value={pass} onChange={
                    (e)=>{ setPass(e.currentTarget.value) }
                }/>
            </div>
            <div className='field'>
                <label>제목</label>
                <input type="text" value={title} onChange={
                    (e)=>{ setTitle( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>내용</label>
                <textarea rows="10" value={content} onChange={
                    (e)=>{ setContent( e.currentTarget.value ) }
                }></textarea>
            </div>
            <div className='field'>
                <label>원래 이미지</label>
                <div><img src={oldImgSrc} style={{width:"150px"}} alt=""/></div>
            </div>

            <div className='field'>
                <label>수정할 이미지</label>
                <input type="file" onChange={(e)=>{ onFileUpload(e); }  }/>
                {/* e 를 전달인수로 전달해야 해당함수에서 방금 선택한 이미지를 인식할 수 있습니다. */}
            </div>
            <div className='field'>
                <label>이미지 미리보기</label>
                <div><img src={imgSrc} style={imgStyle} alt=""/></div>
            </div>
            <div className='btns'>
                <button onClick={ ()=>{ onSubmit() } }>작성완료</button>
                <button onClick={ ()=>{ navigate('/main') }}>돌아가기</button>
            </div>
        </div>
    )
}

export default UpdateBoard
