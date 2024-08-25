package com.himedia.srboardServer.controller;

import com.himedia.srboardServer.entity.Member;
import com.himedia.srboardServer.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {
    private final MemberService ms;

    @PostMapping("/login")
    public HashMap<String , Object> login(@RequestBody Member member , HttpSession session) {
        System.out.println(member);
        Member mem = ms.getMember(member.getUserid());
        HashMap<String , Object> result = new HashMap<>();
        if(mem == null){
            result.put("msg","아이디가 없습니다.");
        }else if(!mem.getPwd().equals(member.getPwd())){
            result.put("msg","패스워드가 일치하지 않습니다.");

        }else{
            session.setAttribute("loginUser", mem);
            result.put("msg" , "ok");
        }

        return result;
    }

    @PostMapping("/join")
    public HashMap<String, Object> join(@RequestBody Member member ) {
        HashMap<String , Object> result = new HashMap<>();
        Member mem = ms.getMember(member.getUserid());
        if(mem != null){
            result.put("msg","아이디가 중복됩니다.");
        }else{
            ms.insertMember(member);
            result.put("msg","ok");
        }

        return  result;
    }

    @GetMapping("/getLoginUser")
    public HashMap<String, Object> getLoginUser( HttpSession session){
        HashMap<String, Object> result = new HashMap<>();
        result.put("loginUser", (Member)session.getAttribute("loginUser"));

        return result;
    }

    @GetMapping("/logout")
    public HashMap<String, Object> logout(HttpSession session){
        HashMap<String, Object> result = new HashMap<>();
        session.removeAttribute("loginUser");
        result.put("msg" , "ok");
        return result;
    }

    @PostMapping("/updateMember")
    public HashMap<String, Object> updateMember(@RequestBody Member member , HttpSession session){
        HashMap<String, Object> result = new HashMap<>();
        Member mem = ms.updateMember(member); //전송된 자료로 멤버 수정. 이때 수정된 객체를 리턴받아서 세션에 재 저장합니다.
        session.setAttribute("loginUser", mem);
        result.put("msg" , "ok");
        return result;
    }

}
