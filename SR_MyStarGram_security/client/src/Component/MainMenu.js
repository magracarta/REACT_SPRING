import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../style/MainMenu.css'
import { useSelector, useDispatch } from 'react-redux';
import { loginAction, logoutAction } from '../store/userSlice';
import { setCookie, getCookie, removeCookie } from '../util/cookiesUtil';

function MainMenu( props ) {
    const navigate=useNavigate();
    const [loginUser, setLoginUser] = useState({});
    const lUser = useSelector( state=>state.user );
    const dispatch = useDispatch();

    const [searchTag, setSearchTag] = useState('');
    const [viewOrNot, setViewOrNot] = useState(false);
    const [inputStyle, setInputStyle ] = useState({display:"none"})
    const [imgSrc, setImgSrc]=useState('http://52.78.197.165:8070/images/user.png');

    useEffect(
        ()=>{
            if( lUser.profileimg ){
                     setImgSrc("http://52.78.197.165:8070/uploads/"+lUser.profileimg);
            } 
        },[]
    )

    useEffect(()=>{
        if(viewOrNot){
            setInputStyle({display:"flex", marginBottom:"10px"});
        }else{
            setInputStyle({display:"none"})
            props.setWord('');
            setSearchTag('');
        }
    },[viewOrNot])

    function onLogout(){
        dispatch( logoutAction() );
        removeCookie("user");
        navigate("/");
    }

    function onSearch(){
        props.setWord( searchTag );
    }

    function onChangeView(){
        setViewOrNot( !viewOrNot );
    }
    
    return (
        <div>
            <div className='topmenu'>
                <img src='http://52.78.197.165:8070/images/home.png' onClick={ 
                    ()=>{   navigate('/main') }
                } />
                <img src="http://52.78.197.165:8070/images/write.png" onClick={
                    ()=>{ navigate('/writePost')   }
                } />
                <img src="http://52.78.197.165:8070/images/search.png" onClick={
                    ()=>{ onChangeView()  }
                } />

                <img src={imgSrc}  onClick={
                    ()=>{ navigate('/myPage') }
                } />
                
                <img src="http://52.78.197.165:8070/images/logout.png" onClick={
                    ()=>{ onLogout() }
                }/>
            </div>

            <div className='search' style={inputStyle}>
                <input type="text" value={searchTag} style={{flex:"4", padding:"3px"}} onChange={
                    (e)=>{ setSearchTag( e.currentTarget.value) } 
                } />
                <button style={{flex:"1", padding:"3px"}} onClick={
                    ()=>{ onSearch() }
                }>해시테그 검색</button>
            </div>
        </div>
    )
}

export default MainMenu
