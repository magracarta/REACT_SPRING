import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutAction } from '../../store/userSlice';

function SubMenu() {
  let loginUser = useSelector(state=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!loginUser.userid){
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  },[])
  function withDrawal(){
    if(!window.confirm("정말로 탈퇴하시겠습니까?")) return false;
    fetch("api/member/deleteMember?userid="+loginUser.userid).then(response=>{
      if(!response.ok) throw new Error(response);
       return response.json();
    }).then(data=>{
      alert("회원탈퇴에 성공했습니다.");
      dispatch(logoutAction());
      navigate("/");
    }).catch(err=>{console.error(err)})
  }
  
  return (
    <div className='submenu'>
      <Link to="/cartlist">장바구니</Link>
      <Link to="/mypage">진행중인 주문</Link>
      <Link to="/orderAll">총 주문</Link>
      <Link to="/updateMember">회원정보 수정</Link>
      <a href='#none' onClick={()=>{withDrawal()}}>회원 탈퇴</a>
    </div>
  )
}

export default SubMenu
