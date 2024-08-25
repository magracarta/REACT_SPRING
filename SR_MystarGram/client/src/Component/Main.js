// Main.js
import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import MainMenu from './MainMenu';
import Post from './post/Post';
import '../style/Posts.css';

import { useSelector, useDispatch } from 'react-redux';

function Main() {
    const [loginUser, setLoginUser] = useState({});
    const lUser = useSelector( state=>state.user );

    const [postList, setPostList ] = useState([]);
    const [paging, setPaging] = useState(1);
    const [word, setWord] = useState(null);
    const [hasmore, setHashmore] = useState(true); 
    const elementRef = useRef(null);

    const navigate = useNavigate(); 
    
    const onInterception = (entries)=>{
        const firstEntry = entries[0];
        if(firstEntry.isIntersecting && hasmore){
            setPaging(prev => prev+1);
        }
    };

    useEffect(()=>{
        const observe = new IntersectionObserver(onInterception,{
            rootMargin:"0px",
            threshold:1.0
        });

        if(elementRef.current){
            observe.observe(elementRef.current);
        }

        return()=>{
            if(elementRef.current){
                observe.unobserve(elementRef.current);
            }
        }

    },[hasmore]);

    useEffect(()=>{
        onPageMove(paging );
        console.log(paging);
    },[paging]);


    async function onPageMove( page ){
        
        console.log(paging);
        
        const result = await axios.get(`/api/post/getPostList/${page}`, { params: { word } });
        let posts = [];
        posts = [...postList];
        posts = [...posts, ...result.data.postList ];
        setPostList([...posts]);
        if(result.data.postList.length == 0) setHashmore(false);
    }
    
    useEffect(
        ()=>{
            if(!lUser.email){
                alert('로그인이 필요합니다');
                navigate('/');
            }            
            console.log( 'lUser : ',  lUser );
            
            
            
            axios.get(`/api/post/getPostList/`+1, { params: { word } })
            .then((result)=>{
                setPaging(1);
                setPostList([]);
                console.log("아무이야기나"+postList);
                
                setPostList( result.data.postList );
            })
            .catch((err)=>{console.error(err)})
        },[word]
    )



    return (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <MainMenu setWord={setWord} />
            <div className='Posts'>
                {
                    (postList)?(
                        postList.map((post, idx)=>{
                            return (
                                <Post key={idx} post={post} postid={post.id} loginUser={lUser}/>
                            )
                        })
                    ):(null)
                }
            <div ref={elementRef} style={{height:"10px", widows:"100px"}}></div>
            </div>
        </div>
    )
}

export default Main
