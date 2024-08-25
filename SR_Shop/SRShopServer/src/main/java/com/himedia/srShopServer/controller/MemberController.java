package com.himedia.srShopServer.controller;

import com.google.gson.Gson;
import com.himedia.srShopServer.dto.KakaoProfile;
import com.himedia.srShopServer.dto.OAuthToken;
import com.himedia.srShopServer.entity.Member;
import com.himedia.srShopServer.service.KakaoService;
import com.himedia.srShopServer.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {
    private final MemberService ms;
    private final KakaoService ks;


    @PostMapping("/locallogin")
    public HashMap<String, Object> localLogin(@RequestBody Member member , HttpSession session) {
        HashMap<String, Object> result = new HashMap<>();
        Member mem = ms.getMember(member.getUserid());
        if(mem == null){
            result.put("msg","해당 아이디가 없습니다.");
        }else if(! mem.getPwd().equals(member.getPwd())){
            result.put("msg","패스워드가 틀립니다.");
        }else if(mem.getUseyn().equals("N")){
            result.put("msg","탈퇴한 회원입니다.");
        }else{
            session.setAttribute("loginUser",mem);
            result.put("msg","ok");
        }
        return result;
    }

    @GetMapping("/getLoginUser")
    public HashMap<String, Object> getLoginUser(HttpSession session){
        HashMap<String, Object> result = new HashMap<>();

        result.put("loginUser",(Member)session.getAttribute("loginUser"));

        return result;
    }

    @GetMapping("/logout")
    public HashMap<String, Object> logout(HttpSession session){
        HashMap<String, Object> result = new HashMap<>();
        session.removeAttribute("loginUser");
        result.put("msg","ok");
        return result;
    }


    @RequestMapping("/kakaoStart")
    public @ResponseBody String kakaoStart(){
        String a ="<script type='text/javascript'>" +
                "location.href='https://kauth.kakao.com/oauth/authorize?" +
                "client_id=7a06fabd130063b1612dc2388af35e0e&" +
                "redirect_uri=http://localhost:8070/member/kakaoLogin&" +
                "response_type=code';" +
                "</script>";

        return a;
    }

    @RequestMapping("/kakaoLogin")
    public void loginKakao(
            HttpServletRequest request,
            HttpServletResponse response, HttpSession session)
            throws UnsupportedEncodingException, IOException {

        String code = request.getParameter("code");

        OAuthToken oAuthToken = ks.getOAuthToken(code);


        KakaoProfile kakaoProfile = (KakaoProfile) ks.getProfile(oAuthToken);
        KakaoProfile.KakaoAccount.Profile pf = kakaoProfile.getAccount().getProfile();

        Member member = ms.getMember( kakaoProfile.getId() );
        if( member == null) {
            member = new Member();
            member.setUserid( kakaoProfile.getId() );
            member.setEmail( pf.getNickname() );
            member.setName( pf.getNickname() );
            member.setProvider( "kakao" );
            member.setPwd( "kakao" );
            member.setUseyn("Y");
            ms.insertMember(member);
        }
        session.setAttribute("loginUser", member);
        response.sendRedirect("http://localhost:3000/kakaosaveinfo");
    }

    @PostMapping("/idcheck")
    public HashMap<String, Object> idCheck(@RequestParam("userid") String userid){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember(userid);
        if(member == null){
            result.put("res","1");
        }else{
            result.put("res","-1");
        }
        return result;
    }
    @PostMapping("/insertMember")
    public HashMap<String , Object> insertMember(@RequestBody Member member){
        ms.insertMember(member);
        HashMap<String , Object> result = new HashMap<>();

        result.put("res","ok");
        return result;
    }

    @PostMapping("/udatteMember")
    public HashMap<String , Object> updateMember(@RequestBody Member member , HttpSession session) {
        ms.udateMember(member);
        HashMap<String , Object> result = new HashMap<>();
        session.setAttribute("loginUser",member);
        result.put("loginUser",member);
        return result;
    }

    @RequestMapping("/deleteMember")
    public HashMap<String, Object> deleteMember(@RequestParam("userid") String userid, HttpSession session){
        HashMap<String, Object> result = new HashMap<>();
        ms.deleteMember(userid);
        session.removeAttribute("loginUser");
        result.put("res","ok");
        return result;
    }
}
