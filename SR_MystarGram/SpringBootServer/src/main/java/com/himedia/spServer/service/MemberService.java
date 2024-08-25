package com.himedia.spServer.service;

import com.himedia.spServer.dao.FollwRepository;
import com.himedia.spServer.dao.MemberRepository;
import com.himedia.spServer.entity.Follow;
import com.himedia.spServer.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository mr;
    private final FollwRepository fr;

    public Member getMember(String email) {
        //Optional : 검색결과가 null이어서 발생할 수 있는 예외 처리나 에러를 방지하기 위한 자바의 도구입니다. null 값이 있을지도 모를 객체를 감싸거 null인데 접근하려는 것을 사전에 차단합니다.
        // 다음과 같이 검증을 거친 후 사용되어 집니다.
        Optional<Member> mem = mr.findByEmail(email);
        
        //isPresent() : 해당 객체가 인스턴스를 저장하고 있다면 true, null 이면 false를 리턴
        //isEmpty() : isPresent()의 반대값을 리턴합니다.
        //get() : 안의 내부 객체를 꺼낸다
        return mem.orElse(null);
    }

    public List<Follow> getFollowings(String nickname) {
        return fr.findByFfrom(nickname);
    }

    public List<Follow> getFollowers(String nickname) {
        return fr.findByFto(nickname);
    }

    public Member getMeberBySnsId(String id) {
        Optional<Member> member = mr.findBySnsid(id);
        return member.orElse(null);
    }

    public void insertMember(Member member) {
        mr.save(member);
    }

    public Member getMemberByNickname(String nickname) {
       Optional<Member> mem = mr.findByNickname(nickname);
       return mem.orElse(null);
    }


    public void onFollow(String ffrom, String fto) {
        //ffrom과 fto로 전달된 값으로 레코드가 있는지 검사
        Optional<Follow> follow = fr.findByFfromAndFto(ffrom ,fto);
        if(!follow.isPresent()) {
            Follow f = new Follow();
            f.setFfrom(ffrom);
            f.setFto(fto);
            fr.save(f);
        }
    }

    public void updateProfile(Member member) {
//        mr.save(member);
        Optional<Member> m = mr.findByNickname(member.getNickname());
        if(m.isPresent()){
            Member mem = m.get();
            mem.setEmail(member.getEmail());
            mem.setNickname(member.getNickname());
            mem.setPhone(member.getPhone());
            mem.setProfileimg(member.getProfileimg());
            mem.setProfilemsg(member.getProfilemsg());
        }else{
            return;
        }
    }
}
