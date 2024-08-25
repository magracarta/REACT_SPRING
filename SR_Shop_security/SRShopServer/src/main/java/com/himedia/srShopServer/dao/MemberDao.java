package com.himedia.srShopServer.dao;

import com.himedia.srShopServer.entity.Member;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MemberDao {
    private final EntityManager em;


    public Member getMember(String userid) {
        return em.find(Member.class, userid);
    }

    public void insertMember(Member member) {
        em.persist(member);
    }

    public void updateMember(Member member) {
        em.merge(member);
    }

    public void deleteMember(String userid) {
        Member member = em.find(Member.class, userid);
        member.setUseyn("N");
    }
}
