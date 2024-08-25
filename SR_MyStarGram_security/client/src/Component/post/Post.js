import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setFollowings } from '../../store/userSlice';


import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


import '../../style/Posts.css';
import jaxios from '../../util/jwtUtil';

const settings = {
    dot:false,
    arrows:false,
    infinite:false,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
}

function Post( props ) {
    const [postid, setPostid] = useState();
    const [images, setImages] = useState([]);
    const [likeList, setLikeList ] = useState([]);
    const [replyList, setReplyList] = useState([]);
    const [loginUser, setLoginUser] = useState({});
    let lUser = useSelector( state=>state.user );

    const [ viewVal, setViewVal ] = useState(false)
    const [ replyStyle, setReplyStyle] = useState({display:"none"})
    const [replyContent, setReplyContent]  = useState('');
    const [followings, setFollowings2] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(
        ()=>{
            //console.log("Post.js")
            console.log("-------------------------------------"+lUser.Followings);
            if (Array.isArray(lUser.Followings)) {
                setFollowings2([...lUser.Followings]);
            } else {
                setFollowings2([]); // 기본값 설정
            }

            jaxios.get(`/api/post/getImages/${props.post.id}`)
            .then((result)=>{ setImages( result.data ); })
            .catch((err)=>{console.error(err)})

            jaxios.get(`/api/post/getLikes/${props.post.id}` )
            .then((result)=>{ setLikeList( result.data );  })
            .catch((err)=>{console.error(err)})

            jaxios.get(`/api/post/getReplys/${props.post.id}`)
            .then((result)=>{ setReplyList( result.data ); })
            .catch((err)=>{console.error(err)})

        },[ ]
    )

    async function onLike(){
        try{
            // 현재 로그인 유저의 닉네임과 현재 포스트의 id 로  like 작업
            // 현재 로그인 유저의 닉네임과 현재 포스트의 id 를 서버에 보내서 내역이 있으면 삭제 , 없으면 추가
            console.log(props.post.id, lUser.nickname)
            await jaxios.post('/api/post/addlike', null, {
               params:{ postid:props.post.id, likenick:lUser.nickname}});

            // 현재 포스트의 라이크를 재조회하고 likeList 를 갱신 합니다
            const result = await jaxios.get(`/api/post/getLikes/${props.post.id}` )
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
            await jaxios.post('/api/post/addReply', {writer:lUser.nickname, content:replyContent, postid:props.post.id})
            const result = await jaxios.get(`/api/post/getReplys/${props.post.id}`)
            setReplyList( result.data );
        }catch(err){
            console.error(err);
        }
        setReplyContent('');
    }
    async function deleteReply(id){
        try{
            // 댓글을 삭제하고 댓글 리스트를 재조회 및 갱신하세요
            await jaxios.delete(`/api/post/deleteReply/${id}`);
            const result = await jaxios.get(`/api/post/getReplys/${props.post.id}`)
            setReplyList( result.data );
        }catch(err){
            console.error(err);
        }

    }

    async function onFollow( writer ){
        try{
            await jaxios.post('/api/member/follow', null, { params:{ffrom:lUser.nickname, fto:writer} } );
            const result = await jaxios.get('/api/member/getFollowings',{params:{nickname:lUser.nickname}});
            dispatch( setFollowings( {followeings:result.data }) );
            setFollowings2( result.data );
        }catch(err){
            console.error(err);
        }
    }


    return (
        <div className='post' style={{width:"780px"}}>
            <div className='writer' style={{display:"flex"}}>
                <div>{props.post.id}&nbsp;&nbsp;</div>
                <div onClick={()=>{navigate(`/memberPage/${props.post.writer}`)}}>{props.post.writer}&nbsp;&nbsp;</div>
                {
                    ( 
                        ( props.post.writer != lUser.nickname) &&  
                        ( !followings.some( (following)=>{  return following.fto == props.post.writer  } ) )
                    )?( <button onClick={()=>{ onFollow(props.post.writer)} }>FOLLOW</button> ): (null)
                }
                {/* 객체.some( (변수)=>{} ) : 객체의 요소 하나하나를 한번씩  '변수'에 저장하고 익명함수를 반복실행합니다.
                대개는 익명함수에서 비교연산의 결과를 리턴하는데, 그결과가 모두 false 라면 최종 결과 false 이며, 리턴값중 하나라도  true 가 있으면 최종 결과는  true 입니다.  위 명령은 내가 팔로잉 하는 사람들들 현재 post 의 작성자가 있다면 true , 없다면 false 가 결과가 됩니다. */}
                {/* 글쓴이가 나이거나, 나의 팔로잉중에  글쓴이가 없다면..... */}
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
                            (like)=>(lUser.nickname==like.likenick) 
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
            <div className='content' style={{fontWeight:"bold"}}>{props.post.content}</div>
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
                                            (reply.writer==lUser.nickname)?(
                                                <button onClick={ ()=>{ deleteReply(reply.id)  } } style={{width:"100%"}}>삭제</button>
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
    )
}

export default Post
