package com.himedia.srShopServer.service;

import com.himedia.srShopServer.entity.Cart;
import com.himedia.srShopServer.entity.Order_detail;
import com.himedia.srShopServer.entity.Orders;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class OrderDao {
    private final EntityManager em;

    public int inserOrders(String userid) {
        Orders orders = new Orders();
        orders.setUserid(userid);
        em.persist(orders);
        return orders.getOseq();
    }


    public void insertOrderDetail(int oseq, Cart cart) {
        Order_detail order_detail = new Order_detail();
        order_detail.setOseq(oseq);
        order_detail.setQuantity(cart.getQuantity());
        order_detail.setPseq(cart.getPseq());
        em.persist(order_detail);
    }

    public List getOrerByOseq(String oseq) {
        return em.createQuery("select o from  Order_view o where oseq = :oseq").setParameter("oseq", oseq).getResultList();
    }

    public void insertOderDetailOne(Order_detail orderDetail) {
        em.persist(orderDetail);
    }

    public List<Integer> getOseqListIng(String userid) {
        return em.createQuery("select distinct o.oseq from Order_view o where o.userid = :userid and o.result<>4  order by o.oseq desc",Integer.class).setParameter("userid", userid).getResultList();
    }

    public List<Integer> getOseqListAll(String userid) {
        return em.createQuery("select distinct o.oseq from Order_view o where o.userid = :userid order by o.oseq desc",Integer.class).setParameter("userid", userid).getResultList();
    }

    public void purchase(int odseq) {
        Order_detail orderDetail = em.find(Order_detail.class, odseq);
        orderDetail.setResult(4);
    }
}
