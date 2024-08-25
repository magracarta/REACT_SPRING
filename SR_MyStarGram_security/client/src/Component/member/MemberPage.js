import React, {useState, useEffect} from 'react'
import '../../style/mypage.css'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import MainMenu from '../MainMenu';
import { useSelector, useDispatch } from 'react-redux';
import { setFollowings } from '../../store/userSlice';

function MemberPage() {

    const [ imgSrc, setImgSrc ]=useState('http://localhost:8070/images/user.png');
    const [ postList, setPostList ] = useState([]);  
    const [ imgList, setImgList] = useState([]);   
    const lUser = useSelector( state=>state.user );

    const [ word, setWord ] = useState('');
    const navigate=useNavigate();
    const {membernick } = useParams();
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings2] = useState([]);
    const [myfollowing, setMyfollowings] = useState([]);
    const [cUser, setCUser] = useState({});
    const dispatch = useDispatch();


    useEffect(
        ()=>{
            setMyfollowings( [...lUser.Followings] );
            axios.get(`/api/member/getMemberInfo/${membernick}`)
            .then((result)=>{
                setCUser( result.data.cuser );
                console.log('cuser', result.data.cuser)
                setFollowers( result.data.followers )
                setFollowings2( result.data.followings )
                if(result.data.cuser.profileimg){
                    setImgSrc(`${result.data.cuser.profileimg}`)
                }
            })
            .catch()
            
            axios.get('/api/post/getMyPost', {params:{nickname:membernick}} )
            .then((result)=>{
                setPostList( result.data.postList );
                setImgList( [...result.data.imgList] );
                console.log(result.data.imglist)
            })
            .catch((err)=>{console.error(err)})

            
            console.log('lUser', lUser)
            
        },[]
    )

    async function follow(){
        try{
            await axios.post('/api/member/follow', null, { params:{ffrom:lUser.nickname, fto:cUser.nickname} } );
            const result = await axios.get('/api/member/getFollowings');
            dispatch( setFollowings({ followings:result.data} ) );
            setMyfollowings( result.data );
        }catch(err){
            console.error(err);
        }
    }
    async function unfollow(){
        try{
            await axios.post('/api/member/unfollow', null, { params:{ffrom:lUser.nickname, fto:cUser.nickname} } );
            const result = await axios.get('/api/member/getFollowings');
            dispatch( setFollowings({ followings:result.data} ) );
            setMyfollowings( result.data );
        }catch(err){
            console.error(err);
        }
    }


    return (
        <div className='mypage'>
            <MainMenu setWord={setWord} />

            <div className='userinfo'>
                <div className='img'>
                    <img src={imgSrc} />
                </div>
                <div className='profile'>
                    <div className='field'>
                        <label>E-mail</label>
                        <div>{cUser.email}</div>
                    </div>
                    <div className='field'>
                        <label>Nick Name</label>
                        <div>{cUser.nickname}</div>
                    </div>
                    <div className='field'>
                        <label>Followers</label>
                        <div>{ (followers)?(followers.length):(0) }</div>
                    </div>
                    <div className='field'>
                        <label>Followings</label>
                        <div>{ (followings)?(followings.length):(0) }</div>
                    </div>
                    <div className='field'>
                        <label>intro</label>
                        <div>{cUser.profilemsg}</div>
                    </div>
                </div>
            </div>

          
            <div className='btns' >
                {/* 현재 팔로우중이면 UnFollow 버튼을   아직 팔로우 전이면 Follow 버튼을 표시해주세요  */}
                {
                    ( !myfollowing.some( (following)=>{ return following.fto == cUser.nickname } ) )?
                    (<button onClick={()=>{ follow() }}>Follow</button>):
                    (<button onClick={()=>{ unfollow() }}>UnFollow</button>)
                }
                
                <button onClick={()=>{navigate('/writePost')}}>Post Write</button>
            </div>
            <div className='userpost' >
                {/* 한줄에 세개씩 이미지를 적당한 크기로 나열해주세요. 필요하다면  css 수정도 해주세요 */}
                {
                    (imgList)?(
                        imgList.map((imgs, idx)=>{
                            return (
                                <div key={idx} onClick={
                                    ()=>{ navigate(`/postone/${postList[idx].id}`) }
                                }>
                                    <img src={`http://localhost:8070/uploads/${imgs}`} />
                                </div>
                            )
                        })
                    ):(null)
                    
                }
            </div>
        </div>
    )
}

export default MemberPage
