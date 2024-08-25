import React, { useEffect } from 'react'
import SubImg from './SubImg'
import SubMenu from './SubMenu'
import "../../style/customer.css"

const {kakao} = window;

function Customer() {
  useEffect(
    ()=>{
      // 지도의 중심위치 설정
      const container = document.getElementById('map');
      const options = {
          center: new kakao.maps.LatLng(37.5718407, 126.9872086)
      };
      const kakaoMap = new kakao.maps.Map(container, options);

      // 표시지역 마킹
      const markerPosition = new kakao.maps.LatLng(37.5718407, 126.9872086);
      const marker = new kakao.maps.Marker({
          position: markerPosition
      });
      marker.setMap(kakaoMap);
    },[]
  )
  return (
    <article>
        <SubImg />
        <div className='subPage'>
            <SubMenu />
            <div className='customer' style={{flex:"4"}}>
                <div id="map" style={{width:"600px" , height:"400px" , margin: "20px"}}>

                </div>
           </div>
      </div>
    </article>
  )
}

export default Customer
