package com.himedia.srShopServer.controller;

import com.himedia.srShopServer.dao.OrderService;
import com.himedia.srShopServer.dto.Order_v;
import com.himedia.srShopServer.entity.Order_detail;
import com.himedia.srShopServer.entity.Order_view;
import jakarta.persistence.criteria.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/order")
public class OrderController {
    private final OrderService os;

    @GetMapping("/insertorders/{userid}")
    public HashMap<String, Object> insertOrderDetail(@PathVariable String userid ){
        HashMap<String, Object> result = new HashMap<>();
        result.put("oseq",os.insertOrders(userid));
        return  result;
    }

    @PostMapping("/insertOrderDetail")
    public HashMap<String, Object> insertOrder(@RequestParam("oseq") Integer oseq, @RequestBody List<Long> odseq ){
        HashMap<String, Object> result = new HashMap<>();
        os.insertOrderDetail(oseq,odseq);

        result.put("msg","ok");
        return  result;
    }

    @GetMapping("/getOrders/{oseq}")
    public HashMap<String, Object> getOrder(@PathVariable String oseq){
        HashMap<String, Object> result = new HashMap<>();
        List<Order_view> list = os.getOrderByOseq(oseq);

        int totalPrice = 0;
        for(Order_view o : list){
            totalPrice += o.getPrice2() * o.getQuantity();
        }
        Order_view orderDetail = list.get(0);


        result.put("list", list);
        result.put("totalPrice", totalPrice);
        result.put("orderDetail", orderDetail);

        return result;
    }
    @PostMapping("/insertOrderOne")
    public HashMap<String, Object> isertOrder( @RequestBody Order_detail order_detail , @RequestParam("userid") String userid){
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("order_detail : "+order_detail);
        System.out.println("userid : "+userid);
        int oseq = os.insertOrders(userid);
        os.insertOderDetailOne(order_detail , oseq);
        result.put("oseq",oseq);
        return result;
    }


    @GetMapping("/getOderIng/{userid}")
    public HashMap<String, Object> getOrderIng(@PathVariable String userid){
        HashMap<String, Object> result = new HashMap<>();

        List<Order_v> list = os.getOrderIng(userid);
        result.put("orderList",list);

        return result;
    }

    @GetMapping("/getOderAll/{userid}")
    public HashMap<String , Object> getOrderAll(@PathVariable String userid ){
        HashMap<String, Object> result = new HashMap<>();

        List<Order_v> list = os.getOrderAll(userid);
        result.put("orderList",list);

        return result;
    }

    @GetMapping("/purchase")
    public HashMap<String , Object> purchase(@RequestParam("odseq") int odseq){
        HashMap<String, Object> result = new HashMap<>();
        os.putchase(odseq);
        return result;
    }
}

