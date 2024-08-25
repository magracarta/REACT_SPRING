package com.himedia.srShopServer.dao;

import com.himedia.srShopServer.entity.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ProductDao {
    private final EntityManager em;

    public List<Product> getBestProduct() {
        return em.createQuery("select p from Product p where p.bestyn =:bestyn", Product.class)
                .setParameter("bestyn" , "Y").setFirstResult(0).setMaxResults(4).getResultList();
    }

    public List<Product> getNewProduct() {
        TypedQuery<Product> query = em.createQuery("select p from Product p order by p.indate desc", Product.class);
        query.setFirstResult(0).setMaxResults(4);
        return query.getResultList();
    }

    public List<Product> getListKind(String kind) {
        return em.createQuery("select p from Product p where p.kind =:kind", Product.class).setParameter("kind",kind).getResultList();
    }

    public Product getProduct(int pseq) {
        return em.find(Product.class , pseq);
    }
}
