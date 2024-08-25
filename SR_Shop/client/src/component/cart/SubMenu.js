import React from 'react'
import { Link } from 'react-router-dom'

function SubMenu() {
  return (
    <div className='submenu'>
      <Link to="/cartlist">장바구니</Link>
      <Link to="/mypage">진행중인 주문</Link>
      <Link to="/orderAll">총 주문</Link>
      <Link to="/updateMember">회원정보 수정</Link>
    </div>
  )
}

export default SubMenu
