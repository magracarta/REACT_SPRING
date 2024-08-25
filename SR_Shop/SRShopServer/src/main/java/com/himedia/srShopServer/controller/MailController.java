package com.himedia.srShopServer.controller;

import com.himedia.srShopServer.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
//필요한 객체에 의존주입을 자동으로 하는 어노테이션 주로 final 로 생성되는 객체에 사용됩니다.
//autowired 는 필요한 객체 선언 위에 개별로 작성했다면, 이는 현위치에 한번만 사용하면 내부에모든 static final 객체에 일괄 적용됩니다.
@RequiredArgsConstructor
@RequestMapping("/member")
public class MailController {

    private final MailService ms;
    private int number;


    @PostMapping("/sendMail")
    public HashMap<String, Object> mailsend(@RequestParam("email") String mail) {
        HashMap<String, Object> result = new HashMap<>();
        try{
            number = ms.sendMail(mail);
            String num = String.valueOf(number);
            result.put("msg","success");
            //result.put("number",num);
        }catch (Exception e){
            result.put("msg","fail");
        }
        return result;
    }

    @PostMapping("/codecheck")
    public HashMap<String, Object> codecheck(@RequestParam("usercode") String usercode) {
        HashMap<String, Object> result = new HashMap<>();

        String num = String.valueOf(number);
        if(num.equals(usercode)){
            result.put("msg","ok");
        }else {
            result.put("msg","fail");
        }
        return result;
    }
}
