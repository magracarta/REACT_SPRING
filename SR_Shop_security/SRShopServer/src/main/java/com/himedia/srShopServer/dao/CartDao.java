package com.himedia.srShopServer.dao;

import com.himedia.srShopServer.entity.Cart;
import com.himedia.srShopServer.entity.Cart_view;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CartDao {
    private final EntityManager em;

    public void insertCart(Cart cart) {
        em.persist(cart);
    }

    public List<Cart_view> getcartList(String userid) {
        return em.createQuery("select c from Cart_view c where userid = :userid", Cart_view.class).setParameter("userid",userid).getResultList();
    }

    public void remove(List<Long> ids) {
        em.createQuery("delete from Cart c where cseq in (:ids)").setParameter("ids",ids).executeUpdate();
    }

    public Cart getCart(Long cseq) {
        return em.find(Cart.class, cseq);
    }
}
