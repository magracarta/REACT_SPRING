package com.himedia.srShopServer.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.himedia.srShopServer.dto.Paging;
import com.himedia.srShopServer.entity.Admins;
import com.himedia.srShopServer.entity.Product;
import com.himedia.srShopServer.service.AdminService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminsContoller {
    private final AdminService as;

    @PostMapping("/login")
    public HashMap<String, Object> login(@RequestBody Admins admin , HttpSession session) {
        HashMap<String, Object> result = new HashMap<>();
        Admins adminmember = as.getAdmins(admin.getAdminid());

        if(adminmember==null){
            result.put("msg", "없는 계정입니다.");
        }else if(!adminmember.getPwd().equals(admin.getPwd())){
            result.put("msg", "비밀 번호가 틀립니다.");
        }else{
            session.setAttribute("adminUser",adminmember);
            result.put("msg", "ok");
        }


        return result;
    }

    @GetMapping("/getProductList/{page}")
    public HashMap<String, Object> getProductList(@PathVariable("page") int page , @RequestParam("search") String search){
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDispayRow(10);
        paging.calPaging();
        List<Product> productList = as.getProductList(paging , search);

        result.put("productList",productList);
        return result;
    }


    @GetMapping("/getOrderList/{page}")
    public HashMap<String, Object> getOrderList(@PathVariable("page") int page , @RequestParam("search") String search){
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDispayRow(10);
        paging.calPaging();
        result.put("orderList",as.getOrderList(paging ,search));
        return result;
    }


    @GetMapping("/getQnaList/{page}")
    public HashMap<String, Object> getQnaList(@PathVariable("page") int page , @RequestParam("search") String search){
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDispayRow(10);
        paging.calPaging();
        result.put("qnaList",as.getQnaList(paging ,search));
        return result;
    }
    @GetMapping("/getmemberList/{page}")
    public HashMap<String, Object> getmemberList(@PathVariable("page") int page , @RequestParam("search") String search){
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDispayRow(10);
        paging.calPaging();
        result.put("memberList",as.getmemberList(paging ,search));
        return result;
    }

    @PostMapping("/insertProduct")
    public HashMap<String, Object> insertProduct(@RequestParam("name") String name ,@RequestParam("price1") String price1  ,@RequestParam("price2") String price2 ,@RequestParam("price3") String price3 ,@RequestParam("content") String content , @RequestParam("kind") String kind ,@RequestParam(value = "image", required = false) MultipartFile image){
        HashMap<String, Object> result = new HashMap<>();

        Product product = new Product();
        product.setName(name);
        product.setPrice1(Integer.parseInt(price1));
        product.setPrice2(Integer.parseInt(price2));
        product.setPrice3(Integer.parseInt(price3));
        product.setContent(content);
        product.setKind(kind);
        as.insertProduct(product , image);

        result.put("msg","ok");
        return result;
    }

    @GetMapping("/getProduct/{pseq}")
    public HashMap<String, Object> getProduct(@PathVariable("pseq") int pseq){
        HashMap<String, Object> result = new HashMap<>();

        result.put("product",as.getProduct(pseq));

        return result;
    }

    @PostMapping("/updateProduct/{pseq}")
    public HashMap<String, Object> updateProduct(@PathVariable("pseq") int pseq,
                                                 @RequestPart Product product, @RequestParam(value = "file", required = false) MultipartFile file){
        HashMap<String, Object> result = new HashMap<>();
        product.setPseq(pseq);
        as.updateProduct(product , file);
        result.put("msg","ok");
        return result;
    }

    @GetMapping("/deleteProduct/{pseq}")
    public HashMap<String , Object> deleteProduct(@PathVariable("pseq") int pseq){
        HashMap<String, Object> result = new HashMap<>();

        as.deleteProduct(pseq);
        result.put("msg","ok");
        return result;
    }


    @PostMapping("/nextResult")
    public HashMap<String, Object> nextResult(@RequestBody List<Integer> odseqList){
        HashMap<String, Object> result = new HashMap<>();
        as.nextResult(odseqList);
        return result;
    }

    @GetMapping("/changeUseyn")
    public HashMap<String , Object> changeUseyn(@RequestParam("userid") String userid , @RequestParam("useyn") String useyn){
        HashMap<String, Object> result = new HashMap<>();
        as.changeUseYn(userid , useyn);
        return result;
    }

    @PostMapping("/writeReply")
    public HashMap<String, Object> writeReply( @RequestParam int qseq , @RequestBody String reply ){
        HashMap<String, Object> result = new HashMap<>();
        ObjectMapper om = new ObjectMapper();
        try {
            Map<String, String> map = om.readValue(reply,Map.class);
            String replytext = map.get("reply");
            as.writeReply(qseq, replytext);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        return result;
    }
}
