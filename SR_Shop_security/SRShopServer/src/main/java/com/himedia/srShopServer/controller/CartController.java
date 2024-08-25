package com.himedia.srShopServer.controller;

import com.himedia.srShopServer.entity.Cart;
import com.himedia.srShopServer.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cs;

    @PostMapping("/insertCart")
    public HashMap<String, Object> insertCart(@RequestBody Cart cart) {
        HashMap<String, Object> result = new HashMap<>();
        cs.insertCart(cart);
        return result;
    }

    @GetMapping("/cartlist/{userid}")
    public HashMap<String, Object> cartlist(@PathVariable String userid) {
//        Member loginUser = (Member) session.getAttribute("loginUser");
        return cs.getCartList(userid);
    }

    @DeleteMapping("/deletecart")
    public int deleteCart(@RequestBody List<Long> ids) {
        return cs.remove(ids);
    }
}
