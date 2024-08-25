package com.example.Controller;

import com.example.Service.JoinService;
import com.example.dto.JoinDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class JoinController {
    private final JoinService js;

    @GetMapping("/join")
    public String joinP(){
        return "join";
    }

    @PostMapping("/joinProc")
    public String joinProcess(JoinDTO joindto){

        System.out.println(joindto.getUsername());
        js.joinProcess(joindto);

        return "redirect:/login";
    }
}
