import React, {useState, useEffect} from 'react'
import '../../style/mypage.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import MainMenu from '../MainMenu';
import { useSelector } from 'react-redux';

function MyPage(  ) {

    const [ imgSrc, setImgSrc ]=useState('http://localhost:8070/images/user.png');
    const [ followers, setFollowers] = useState([]);  // 나를 follow 하는 사람들
    const [ followings, setFollowings ] = useState([]);   // 내가 following 하는 사람들
    const [ postList, setPostList ] = useState([]);  // 로그인 유저가 작성한 포스트들
    const [ imgList, setImgList] = useState([]);   // 하단에 포스트를 대변할 수 있는 이미지들
    const [loginUser, setLoginUser] = useState({});
    const lUser = useSelector( state=>state.user);
    const [ word, setWord ] = useState('');

    const navigate=useNavigate();

    useEffect(
        ()=>{
            // axios.get('/api/member/getLoginUser')
            // .then((result)=>{
            //     setLoginUser( result.data.loginUser );
            //     setFollowers( result.data.followers );
            //     setFollowings( result.data.followings );
            //     if( result.data.loginUser.profileimg ){
            //         setImgSrc(`${result.data.loginUser.profileimg}`)
            //     }
            // })
            // .catch((err)=>{console.error(err)})

            axios.get('/api/post/getMyPost',{params:{nickname:lUser.nickname}})
            .then((result)=>{
                setPostList( [...result.data.postlist] );
                setImgList( [...result.data.imglist] );
                console.log(result.data.imglist)
            })
            .catch((err)=>{console.error(err)});
            if(lUser.profileimg){
                setImgSrc(`${lUser.profileimg}`);
                
            }
        },[]
    )


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
                        <div>{lUser.email}</div>
                    </div>
                    <div className='field'>
                        <label>Nick Name</label>
                        <div>{lUser.nickname}</div>
                    </div>
                    <div className='field'>
                        <label>Followers</label>
                        <div>{ (lUser.Followers)?(lUser.Followers.length):(0) }</div>
                    </div>
                    <div className='field'>
                        <label>Followings</label>
                        <div>{ (lUser.Followings)?(lUser.Followings.length):(0) }</div>
                    </div>
                    <div className='field'>
                        <label>intro</label>
                        <div>{lUser.profilemsg}</div>
                    </div>
                </div>
            </div>
            <div className='btns' >
                <button onClick={()=>{navigate("/editProfile")}}>Edit Profile</button>
                <button>Post Write</button>
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

export default MyPage
