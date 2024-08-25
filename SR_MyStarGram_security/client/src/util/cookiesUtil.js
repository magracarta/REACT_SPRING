//cookieUtil.js
import { Cookies } from "react-cookie";
const cookie = new Cookies();

export const setCookie = (name, value , days=1)=>{
    const expries = new Date(); //오늘 날짜 시간
    expries.setUTCDate(expries.getUTCDate() + days);//보관기한 설정
    return cookie.set(name,value,{path:"/" , expires:expries});
};

export const getCookie = (name)=>{
    return cookie.get('user');
}


export const removeCookie = (name, path="/")=>{
    cookie.remove(name, {path});
}