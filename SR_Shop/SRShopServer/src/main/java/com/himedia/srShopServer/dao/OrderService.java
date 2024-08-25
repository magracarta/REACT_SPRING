package com.himedia.srShopServer.dao;

import com.himedia.srShopServer.dto.Order_v;
import com.himedia.srShopServer.entity.Cart;
import com.himedia.srShopServer.entity.Order_detail;
import com.himedia.srShopServer.entity.Order_view;
import com.himedia.srShopServer.service.OrderDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class OrderService {
    private final OrderDao odao;
    private final CartDao cdao;

    public int insertOrders(String userid) {
        return odao.inserOrders(userid);
    }

    public void insertOrderDetail(int oseq, List<Long> cseqs) {
        for (Long cseq : cseqs) {
            Cart cart = cdao.getCart(cseq);
            odao.insertOrderDetail(oseq , cart);
        }
        cdao.remove(cseqs);
    }

    public List<Order_view> getOrderByOseq(String oseq) {
        return odao.getOrerByOseq(oseq);
    }

    public void insertOderDetailOne(Order_detail orderDetail , int oseq) {
        orderDetail.setOseq(oseq);
        odao.insertOderDetailOne(orderDetail);
    }

    public List<Order_v> getOrderIng(String userid) {
        List<Integer> oseqList = odao.getOseqListIng(userid);
        List<Order_v> list = new LinkedList<>();
        for(int oseq: oseqList){
            List<Order_view> orderListIng = odao.getOrerByOseq(String.valueOf((Integer) oseq));
            Order_v order = new Order_v();
            order.setPname(orderListIng.get(0).getPname()+" 포함 "+ orderListIng.size());
            int totalPrice = 0;
            for(Order_view o: orderListIng){
                totalPrice += o.getPrice2() * o.getQuantity();
            }
            order.setOseq(orderListIng.get(0).getOseq());
            order.setIndate(orderListIng.get(0).getIndate());
            order.setPrice2(totalPrice);
            list.add(order);
        }

        return  list;
    }

    public List<Order_v> getOrderAll(String userid) {
        List<Integer> oseqList = odao.getOseqListAll(userid);
        List<Order_v> list = new LinkedList<>();
        for(int oseq: oseqList){
            List<Order_view> orderListIng = odao.getOrerByOseq(String.valueOf((Integer) oseq));
            Order_v order = new Order_v();
            order.setPname(orderListIng.get(0).getPname()+" 포함 "+ orderListIng.size());
            int totalPrice = 0;
            for(Order_view o: orderListIng){
                totalPrice += o.getPrice2() * o.getQuantity();
            }
            order.setOseq(orderListIng.get(0).getOseq());
            order.setIndate(orderListIng.get(0).getIndate());
            order.setPrice2(totalPrice);
            list.add(order);
        }

        return  list;
    }

    public void putchase(int odseq) {
        odao.purchase(odseq);
    }
}
