package com.himedia.srShopServer.controller;

import com.himedia.srShopServer.entity.Product;
import com.himedia.srShopServer.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("product")
public class ProductController {

    private final ProductService ps;

    @GetMapping("/bestPro")
    public HashMap<String, Object> bestProduct(){
        HashMap<String, Object> result = new HashMap<>();
        result.put("bestProduct", ps.getBestProduct());
        return result;
    }
    @GetMapping("/newPro")
    public HashMap<String, Object> newProduct(){
        HashMap<String, Object> result = new HashMap<>();
        result.put("newProduct", ps.getNewProduct());
        return result;
    }

    @GetMapping("/kindlist/{kind}")
    public List<Product> productList(@PathVariable String kind){

        return ps.getListKind(kind);
    }


    @GetMapping("/getProduct/{pseq}")
    public HashMap<String, Object> getProduct(@PathVariable int pseq){
        HashMap<String, Object> result = new HashMap<>();
        Product product = ps.getProduct(pseq);
        result.put("product", product);
        return result;
    }
}
