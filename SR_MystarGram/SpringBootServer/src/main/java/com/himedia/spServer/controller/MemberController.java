package com.himedia.spServer.controller;

import com.google.gson.Gson;
import com.himedia.spServer.dto.KakaoProfile;
import com.himedia.spServer.dto.OAuthToken;
import com.himedia.spServer.entity.Follow;
import com.himedia.spServer.entity.Member;
import com.himedia.spServer.service.MemberService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;


@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService ms;

    @PostMapping("/loginlocal")
    public HashMap<String, Object> loginLocal(@RequestBody Member member , HttpSession session) {
        HashMap<String, Object> result = new HashMap<>();
        Member mem = ms.getMember(member.getEmail());
        if (mem == null) {
            result.put("msg", "이메일 또는 페스워드를 확인하세요.");
        }else if(!mem.getPwd().equals(member.getPwd())) {
            result.put("msg", "이메일 또는 페스워드를 확인하세요.");
        }else{
            result.put("msg", "ok");
            session.setAttribute("loginUser", mem);
        }

        return  result;
    }

    @GetMapping("/getLoginUser")
    public HashMap<String, Object> getLoginUser(HttpSession session) {
        HashMap<String, Object> result = new HashMap<>();
        Member loginUser = (Member) session.getAttribute("loginUser");
        result.put("loginUser", loginUser);


        List<Follow> followinglist = ms.getFollowings(loginUser.getNickname());
        List<Follow> followerlist = ms.getFollowers(loginUser.getNickname());

        result.put("followings",followinglist);
        result.put("followers",followerlist);

        return result;
    }

    @Value("${kakao.client_id}")
    private String clientid;
    @Value("${kakao.redirect_uri}")
    private String redirecturi;

    @RequestMapping("/kakaostart")
    public @ResponseBody String kakaostart() {
        String a = "<script type ='text/javascript'>" +
                "location.href='https://kauth.kakao.com/oauth/authorize?" +
                "client_id="+clientid+"&redirect_uri=" +
                redirecturi +"&response_type=code'</script>";
        return a;
    }

    @RequestMapping("/kakaoLogin")
    public void kakaoLogin(HttpSession session , HttpServletRequest request , HttpServletResponse response) throws IOException {
        String code = request.getParameter("code");
        String endpoint = "https://kauth.kakao.com/oauth/token";
        URL url = new URL(endpoint); // import java.net.URL;
        String bodyData = "grant_type=authorization_code&";
        bodyData += "client_id="+clientid+"&";
        bodyData += "redirect_uri="+redirecturi+"&";
        bodyData += "code=" + code;

        HttpURLConnection conn = (HttpURLConnection) url.openConnection(); // import java.net.HttpURLConnection;
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        conn.setDoOutput(true);
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
        bw.write(bodyData);
        bw.flush();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        String input = "";
        StringBuilder sb = new StringBuilder(); // 조각난 String 을 조립하기위한 객체
        while ((input = br.readLine()) != null) {
            sb.append(input);
            //System.out.println(input); // 수신된 토큰을 콘솔에 출력합니다
        }
        Gson gson = new Gson();
        OAuthToken oAuthToken = gson.fromJson(sb.toString(), OAuthToken.class);
        String endpoint2 = "https://kapi.kakao.com/v2/user/me";
        URL url2 = new URL(endpoint2);

        HttpsURLConnection conn2 = (HttpsURLConnection) url2.openConnection();
        conn2.setRequestProperty("Authorization", "Bearer " + oAuthToken.getAccess_token());
        conn2.setDoOutput(true);
        BufferedReader br2 = new BufferedReader(new InputStreamReader(conn2.getInputStream(), "UTF-8"));
        String input2 = "";
        StringBuilder sb2 = new StringBuilder();
        while ((input2 = br2.readLine()) != null) {
            sb2.append(input2);
            //System.out.println(input2);
        }
        Gson gson2 = new Gson();
        KakaoProfile kakaoProfile = gson2.fromJson(sb2.toString(), KakaoProfile.class);
        KakaoProfile.KakaoAccount ac = kakaoProfile.getAccount();
        KakaoProfile.KakaoAccount.Profile pf = ac.getProfile();
        System.out.println("id : " + kakaoProfile.getId());
        System.out.println("KakaoAccount-Email : " + ac.getEmail());
        System.out.println("Profile-Nickname : " + pf.getNickname());

        Member member = ms.getMeberBySnsId( kakaoProfile.getId() );
        if( member == null) {
            member = new Member();
            member.setEmail( pf.getNickname() );
            member.setNickname( pf.getNickname() );
            member.setProvider( "kakao" );
            member.setPwd( "kakao" );
            member.setSnsid(kakaoProfile.getId());
            ms.insertMember(member);
        }
        session.setAttribute("loginUser", member);
        response.sendRedirect("http://localhost:3000/kakaosaveinfo");
    }


    @GetMapping("/logout")
    public HashMap<String, Object> logout(HttpSession session){
        HashMap<String, Object> result = new HashMap<>();
        session.removeAttribute("loginUser");
        result.put("loginUser", null);
        return result;
    }

    private final ServletContext context;
    @PostMapping("/fileupload")
    public HashMap<String , Object> fileupload(@RequestParam("image") MultipartFile file){
        HashMap<String , Object> result = new HashMap<>();
        String filepath = context.getRealPath("/uploads");
        String fileName = file.getOriginalFilename();
        assert fileName != null;
        String f1 = fileName.substring(0, fileName.lastIndexOf("."));
        String f2 = fileName.substring(fileName.lastIndexOf("."));
        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String t = sdf.format(now);

        String saveFileName = f1+t+f2;

        try {
            file.transferTo(new File(filepath + File.separator + saveFileName));
            result.put("filename", saveFileName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    @RequestMapping("/emailcheck")
    public HashMap<String , Object> emailcheck(@RequestParam("email") String email){
        HashMap<String , Object> result = new HashMap<>();
        Member mem = ms.getMember(email);
        if(mem != null) result.put("msg", "no");
        else result.put("msg", "yes");
        return result;
    }

    @RequestMapping("/nicknamecheck")
    public HashMap<String , Object> nicknamecheck(@RequestParam("nickname") String nickname){
        HashMap<String , Object> result = new HashMap<>();
        Member mem = ms.getMemberByNickname(nickname);
        if(mem != null) result.put("msg", "no");
        else result.put("msg", "yes");
        return result;
    }

    @RequestMapping("/join")
    public HashMap<String , Object> join(@RequestBody Member member){
        HashMap<String , Object> result = new HashMap<>();
        ms.insertMember(member);
        result.put("msg", "ok");
        return result;
    }

    @RequestMapping("/follow")
    public HashMap<String , Object> follow(@RequestParam("ffrom") String ffrom , @RequestParam("fto") String fto ){
        ms.onFollow(ffrom, fto);
        return null;
    }

    @GetMapping("/getFollowings")
    public List<Follow> getFollowings(HttpSession session){
        Member member = (Member) session.getAttribute("loginUser");

        return ms.getFollowings(member.getNickname());
    }


    @PostMapping("/updateProfile")
    public HashMap<String, Object> updateProfile(@RequestBody Member member , HttpSession session){
        HashMap<String, Object> result = new HashMap<>();

        System.out.println("----------------member: -----------------"+member);

        ms.updateProfile(member);
        session.setAttribute("loginUser", member);
        result.put("msg","ok");

        return result;
    }

}
