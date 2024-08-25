package com.himedia.srShopServer.controller;

import com.himedia.srShopServer.dto.Paging;
import com.himedia.srShopServer.entity.Qna;
import com.himedia.srShopServer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer")
public class CusetomerController {
    private final CustomerService cs;

    @RequestMapping("/qnalist/{page}")
    public HashMap<String, Object> getQnaList(@PathVariable("page") int page){
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.calPaging();
        List<Qna> list = cs.getQnaList(paging);
        result.put("qnaList", list);
        return result;
    }

    @PostMapping("/writeqna")
    public String writeQna(@RequestBody Qna qna){
        cs.insertQna(qna);
        return "success";
    }

    @GetMapping("/qnaView/{qseq}")
    public HashMap<String, Object> getQnaView(@PathVariable("qseq") int qseq){
        HashMap<String, Object> result = new HashMap<>();
        Qna qna = cs.getQna(qseq);
        System.out.println(qna);
        result.put("qna",qna);
        return result;
    }


}
