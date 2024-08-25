package com.himedia.srShopServer.service;

import com.himedia.srShopServer.dao.MemberDao;
import com.himedia.srShopServer.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberDao mdao;

    public Member getMember(String userid) {
        return mdao.getMember(userid);
    }

    public void insertMember(Member member) {
        mdao.insertMember(member);
    }

    public void udateMember(Member member) {
       mdao.updateMember(member);
    }

    public void deleteMember(String userid) {
        mdao.deleteMember(userid);
    }
}
