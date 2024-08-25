import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate , Link } from 'react-router-dom'
import { logoutAction } from '../../store/userSlice';
import "../../style/index.css"

function Heading() {
  const navigate = useNavigate();
  const loginUser = useSelector(state => state.user);
  const dispatch = useDispatch();

  function onLogout(){
    //리덕스에서는 logoutAction 호출
    //세션은 loginUser 삭제
    fetch("/api/member/logout", {method: "GET"})
    .then(response => response.json())  // response를 json으로 변환
    .then(data => {
        if(data.msg === "ok"){    
        dispatch(logoutAction());
        alert("로그아웃했습니다.");
        window.location.href = "/";
        }
    })
    .catch(err => {
        console.error(err);
    });
  }
  return (
    <div className='header'>
    <div className='top_menu'>
        <div className='logo'>
            <img className='logo' src="http://localhost:8070/images/logo.png"
                onClick={() => { navigate('/') }} />
        </div>

        <div className='gnb'>
            {/* Link 테그는 anchor 테그로도 인식되서 css 적용이 가능합니다 */}
            {
                (loginUser.userid) ? (
                    <div className='logininfo'>
                        {loginUser.userid}({loginUser.name})
                        <a href='#none' onClick={()=>{onLogout()}}>LOGOUT</a>
                    </div>
                ) : (
                    <>
                        <Link to='/login'>LOGIN</Link>
                        <Link to='/join'>JOIN</Link>
                    </>
                )
            }
            <Link to='/cartlist'>CART</Link>
            <Link to='/mypage'>MYPAGE</Link>
            <Link to='/customer'>CUSTOMER</Link>
        </div>
    </div>

    <div className='category_menu'>
        {/* Link 태그는 anchor태그로도 인식되어서 css 적용이 가능합니다. */}
        <Link to="/kindlist/1">HEELS</Link>
        <Link to="/kindlist/2">BOOTS</Link>
        <Link to="/kindlist/3">SNEAKERS</Link>
        <Link to="/kindlist/4">SLEEPERS</Link>
    </div>
      
    </div>
  )
}

export default Heading
