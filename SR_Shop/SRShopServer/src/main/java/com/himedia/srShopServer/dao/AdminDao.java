package com.himedia.srShopServer.dao;

import com.himedia.srShopServer.dto.Paging;
import com.himedia.srShopServer.entity.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.xml.transform.Result;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminDao {
    private final EntityManager em;

    public Admins getAdmins(String adminid) {
        return  em.find( Admins.class , adminid);
    }

    public List<Product> getProductList(Paging page, String search) {
        return em.createQuery("select p from Product p where p.name like :search order by p.pseq desc", Product.class).setParameter("search", "%" + search + "%").setFirstResult(page.getStartNum()).setMaxResults(page.getDispayRow()).getResultList();
    }

    public List<Order_view> getOrderList(Paging paging, String search) {
        return em.createQuery("select o from Order_view o where (o.mname like :search or o.userid like :search) order by o.odseq desc", Order_view.class).setParameter("search","%"+search+"%").setFirstResult(paging.getStartNum()).setMaxResults(paging.getDispayRow()).getResultList();
    }

    public List<Qna> getQnaList(Paging paging, String search) {
        return em.createQuery("select q from Qna q where q.subject like :search order by q.qseq desc", Qna.class).setParameter("search","%"+search+"%").setFirstResult(paging.getStartNum()).setMaxResults(paging.getDispayRow()).getResultList();
    }

    public List<Member> getMemberList(Paging paging, String search) {
        return em.createQuery("select m from Member m where (m.name like :search or m.userid like :search) order by m.indate desc", Member.class).setParameter("search","%"+search+"%").setFirstResult(paging.getStartNum()).setMaxResults(paging.getDispayRow()).getResultList();
    }

    public void insertProduct(Product product) {
        em.persist(product);
    }

    public Product getProduct(int pseq) {
      return  em.find(Product.class, pseq);
    }

    public void updateProduct(Product product) {
        Product findProduct = em.find(Product.class, product.getPseq());
        findProduct.setName(product.getName());
        findProduct.setKind(product.getKind());
        findProduct.setUseyn(product.getUseyn());
        findProduct.setPrice1(product.getPrice1());
        findProduct.setPrice2(product.getPrice2());
        findProduct.setPrice3(product.getPrice3());
        findProduct.setContent(product.getContent());
        findProduct.setImage(product.getImage());
        findProduct.setSavefilename(product.getSavefilename());
        findProduct.setUseyn(product.getUseyn());
        findProduct.setBestyn(product.getBestyn());
    }

    public void deleteProduct(int pseq) {
        em.remove(em.find(Product.class, pseq));
    }

    public void nextResult(int odseq) {
        Order_detail od = em.find(Order_detail.class, odseq);
        if(od.getResult() < 3){
            od.setResult(od.getResult()+1);
        }
    }

    public void changeUseYn(String userid, String useyn) {
        Member member = em.find(Member.class, userid);
        member.setUseyn(useyn);
    }

    public void writeReply(int qseq, String reply) {
        Qna qna = em.find(Qna.class, qseq);
        qna.setReply(reply);
    }
}
