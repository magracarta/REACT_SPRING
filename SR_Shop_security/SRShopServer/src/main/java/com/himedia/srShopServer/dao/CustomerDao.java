package com.himedia.srShopServer.dao;

import com.himedia.srShopServer.dto.Paging;
import com.himedia.srShopServer.entity.Qna;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;


@RequiredArgsConstructor
@Repository
public class CustomerDao {
    private final EntityManager em;

    public List<Qna> getQnaList(Paging paging) {
        return em.createQuery("select q from Qna q order by q.pseq desc", Qna.class).setFirstResult(paging.getStartNum()).setMaxResults(paging.getDispayRow()).getResultList();
    }

    public void insertQna(Qna qna) {
        em.persist(qna);
    }

    public Qna getQna(int qseq) {
        return em.find(Qna.class, qseq);
    }
}
