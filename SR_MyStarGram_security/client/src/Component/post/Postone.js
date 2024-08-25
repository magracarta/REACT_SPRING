import React, {useState, useEffect} from 'react';
import axios from "axios";
import { useNavigate , useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import MainMenu from '../MainMenu';
import Post from '../post/Post';


const settings = {
    dot:false,
    arrows:false,
    infinite:false,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
}

function Postone() {
    const [ post, setPost ] =useState({});
    const [ images, setImages] =useState([]);
    const [ likeList, setLikeList ] = useState([]);
    const [ replyList, setReplyList] = useState([]);

    const [ followings, setFollowings ] = useState([]);   
    const [ word, setWord] = useState('');

    const [ viewVal, setViewVal ] = useState(false)
    const [ replyStyle, setReplyStyle] = useState({display:"none"})
    const [ replyContent, setReplyContent]  = useState('');

    const navigate = useNavigate();
    const {postid} = useParams();
    const loginUser = useSelector( state=>state.user );

    useEffect(
        ()=>{
            // 포스트
            axios.get(`/api/post/getPost/${postid}`)
            .then((result)=>{
                setPost( result.data )
            })
            .catch((err)=>{console.error(err)})


            // 이미지
            axios.get(`/api/post/getImages/${postid}` )
            .then((result)=>{ setImages( result.data ); })
            .catch((err)=>{console.error(err)})

            // // 댓글
            axios.get(`/api/post/getReplys/${postid}`)
            .then((result)=>{ setReplyList( result.data ); })
            .catch((err)=>{console.error(err)})

            // // 좋아요
            axios.get(`/api/post/getLikes/${postid}` )
            .then((result)=>{ setLikeList( result.data ); console.log(result.data) })
            .catch((err)=>{console.error(err)})
        },[]
    )


    async function onLike(){
        try{
            // 현재 로그인 유저의 닉네임과 현재 포스트의 id 로  like 작업
            // 현재 로그인 유저의 닉네임과 현재 포스트의 id 를 서버에 보내서 내역이 있으면 삭제 , 없으면 추가
            await axios.post('/api/post/addlike', {postid, likenick:loginUser.nickname} );

            // 현재 포스트의 라이크를 재조회하고 likeList 를 갱신 합니다
            const result = await axios.get(`/api/post/getLikes/${postid}` )
            setLikeList( result.data );
        }catch(err){
            console.error(err);
        }
    }


    useEffect(
        ()=>{
            if( !viewVal ){
                setReplyStyle({display:"none"})
            }else{
                setReplyStyle({display:"flex", margin:"5px 5px"})
            }
        },[viewVal]
    );

    function viewOrNot(){
        setViewVal( !viewVal );
    }


    async function addReply(){
        try{
            // 댓글을 추가하고 댓글 리스트를 재조회 및 갱신하세요
            await axios.post('/api/post/addReply', {writer:loginUser.nickname, content:replyContent, postid})
            const result = await axios.get(`/api/post/getReplys/${postid}`)
            setReplyList( result.data );
        }catch(err){
            console.error(err);
        }
        setReplyContent('');
    }

    async function deleteReply(id){
        try{
            // 댓글을 삭제하고 댓글 리스트를 재조회 및 갱신하세요
            await axios.delete(`/api/post/deleteReply/${id}`)
            const result = await axios.get(`/api/post/getReplys/${postid}`)
            setReplyList( result.data );
        }catch(err){
            console.error(err);
        }

    }

    async function onFollow( writer ){
        try{
            await axios.post('/api/member/follow', {ffrom:loginUser.nickname, fto:writer} );
            const result = await axios.get('/api/member/getFollowings');
            setFollowings( result.data );
        }catch(err){
            console.error(err);
        }
    }



    return (
        <div>
            <MainMenu setWord={setWord}/>
            {/* 해당 포스트 한개만  Main 에서 표시된 것처럼 표시하세요 */}
            
            <div className='post' style={{width:"780px"}}>
                <div className='writer' style={{display:"flex"}}>
                    <div>{postid}&nbsp;&nbsp;</div>
                    <div>{post.writer}&nbsp;&nbsp;</div>
                    {
                        ( 
                            ( post.writer != loginUser.nickname) &&  
                            ( !followings.includes( post.writer) )
                        )?( <button onClick={()=>{onFollow(post.writer)}}>FOLLOW</button> ): (null)
                    }
                </div>
                { <Slider {...settings} >
                    {
                        (images)?(
                            images.map((img, idx)=>{
                                return (
                                    <img key={idx} src={`http://localhost:8070/uploads/${img.savefilename}`} width="750" height="900"/>
                                )
                            })
                        ):(null)
                    }
                </Slider>  }

                <div className='like'>
                    {
                        (likeList)?( 
                            likeList.some(
                                (like)=>(loginUser.nickname==like.likenick) 
                            )
                            ?
                            ( <img src={`http://localhost:8070/images/delike.png`} onClick={ ()=>{ onLike() } } />)
                            :
                            (<img src={`http://localhost:8070/images/like.png`} onClick={ ()=>{ onLike() } }  />)
                        ):(
                            <img src={`http://localhost:8070/images/like.png`} onClick={ ()=>{ onLike() } }  />
                        )
                    }

                    &nbsp;&nbsp;
                    <img src={`http://localhost:8070/images/reply.png`} onClick={()=>{
                        viewOrNot()
                    }}/>
                </div>
                <div className='like'>
                    {
                        (likeList && likeList.length>=1)?(
                            <span>{likeList.length} 명이 좋아합니다</span>
                        ):(
                            <span>아직 "좋아요"가 없어요</span>
                        )
                    }
                    
                </div>
                <div className='content' style={{fontWeight:"bold"}}>{post.content}</div>
                <div className='reply'>
                    {
                        (replyList && replyList.length>=1)?(
                            replyList.map((reply, idx)=>{
                                return (
                                    <div key={idx} style={replyStyle}>
                                        <div style={{flex:"1", fontWeight:"bold"}}>{reply.writer}&nbsp;</div>
                                        <div style={{flex:"3"}}>{reply.content}</div>
                                        <div style={{flex:"1", textAlign:"right"}}>
                                            {
                                                (reply.writer==loginUser.nickname)?(
                                                    <button onClick={ ()=>{ 
                                                        deleteReply(reply.id)
                                                    } } style={{width:"100%"}}>삭제</button>
                                                ):(null)
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        ):(<div style={replyStyle}>아직 댓글이 없습니다</div>)
                    }
                    <div style={replyStyle}>
                        <input type="text" style={{flex:"5"}} value={replyContent} onChange={
                            (e)=>{ setReplyContent( e.currentTarget.value) }
                        }/>
                        <button style={{flex:"1"}} onClick={
                            ()=>{ addReply() }
                        }>댓글입력</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Postone
