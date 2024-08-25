package com.himedia.srboardServer.service;

import com.himedia.srboardServer.dao.MemberDao;
import com.himedia.srboardServer.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
public class MemberService {
    private final MemberDao mdao;

    public Member getMember(String userid) {
        return  mdao.getMember(userid);
    }

    public void insertMember(Member member) {
        mdao.insertMember(member);
    }

    public Member updateMember(Member member) {
        return mdao.updateMember(member);
    }
}
