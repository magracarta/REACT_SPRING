package com.himedia.spServer.service;


import com.himedia.spServer.dao.*;
import com.himedia.spServer.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {
    private final PostRepository pr;
    private final ImagesRepository ir;
    private final LikesRespository lr;
    private final ReplyRepository rr;
    private final HashtagRepository hr;
    private final PostHashRepository phr;

    public Page<Post> getPostList(int page, String word) {
        int pageSize = 5; // 페이지 당 항목 수
        System.out.println(word);
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("id").descending());
        if (word == null || word.isEmpty()) {
            return pr.findAll(pageable);
        } else {

            Optional<Hashtag> h = hr.findByWord(word);
            pageable = PageRequest.of(page - 1, pageSize, Sort.by("id").descending());
            return pr.getPostListByTag(h.get().getId(), pageable);
        }
    }

//    public List<Post> getPostList(int page, String word) {
////        return  pr.findAll(Sort.by(Sort.Direction.DESC, "id"));
////        return  pr.findAll(Sort.by(Sort.Direction.DESC, "id" , "writer"));
////        return  pr.findAll(Sort.by(Sort.Order.DESC, "id") , Sort.Order.asc("writer"));
//
////        wor로 hashtag 테이블 검색
////        검색결과에 있는 tagid들로 posthash 테이블에서 postid 들을 검색
////        검색 결과에 있는 tagid들로 posthash 테이블에서postid들을 검색
////        postid들로 post테이블에서 post들을 검색
////        select id from hashtag where word=?
////        select postid from posthash where word =?
////        select postid from posthash where hashid=?
////        select * from post where id=?
//        List<Post> posts =null;
//        if(word == null){
//            posts = pr.findAll(Sort.by(Sort.Direction.DESC, "id"));
//            return  posts;
//        }
//        Optional<Hashtag> h = hr.findByWord(word);
//        if(h.isEmpty()){ //검색어가 hashtag 테이블에 없는 단어라면 모두 검색
//            posts = pr.findAll(Sort.by(Sort.Direction.DESC, "id"));
//        }else{ //있는 단어라면 hashtag 테이블의 단어의 id로 검색
//            posts = pr.getPostListByTag(h.get().getId());
//        }
//
//
//
//        return  posts;
//    }

    public List<Images> getImages(Integer postid) {
       return   ir.findByPostid(postid);
    }

    public List<Likes> getLikes(Integer postid) {
        return lr.findByPostid(postid);
    }

    public List<Reply> getReplys(Integer postid) {
        return rr.findByPostidOrderByIdDesc(postid);
    }

    public void addLike(Integer postid, String likenick) {
       Optional<Likes> findlike = Optional.ofNullable(lr.findByPostidAndLikenick(postid, likenick));
       if(findlike.isPresent()) {
           lr.delete(findlike.get());
       }else {
           Likes like = new Likes();
           like.setPostid(postid);
           like.setLikenick(likenick);
           lr.save(like);
       }
    }

    public void addReply(Reply reply) {
        rr.save(reply);
    }

    public void deleteReply(int reply) {
        Optional<Reply> findreply = rr.findById(reply);
        if(findreply.isPresent()) rr.delete(findreply.get());
    }


    public int insertPost(Post post) {
        //포스트 추가
        Post p = pr.save(post);
        //포스트의 content 추출
        String content = post.getContent();
        
        //콘텐츠에서 해시태그 추출
        Matcher m = Pattern.compile("#([0-9a-zA-Z가-힣]*)").matcher(content);
        System.out.println(m);
        List<String> tags = new ArrayList<>();
        while (m.find()){
            System.out.println(m.group(1));
            tags.add(m.group(1));
        }
        System.out.println(tags);
        //추출된 해시태그들로 해시테그 작업
        int tagid = 0;
        for(String word : tags) {
            Optional<Hashtag> findHash = hr.findByWord(word);
            //현재 원드가 없으면 Hashtag 테이블에 새레코드 추가
            if(findHash.isEmpty()){
                Hashtag hashtag = new Hashtag();
                hashtag.setWord(word);
                tagid = hr.save(hashtag).getId();
            }else{
                //있으면 아이디만 추출
                tagid = findHash.get().getId();
            }
            System.out.println("------------------------------tagid"+tagid+"------------------------------");
            Posthash posthash = new Posthash();
            posthash.setHashid(tagid);
            posthash.setPostid(p.getId());

            //추출된 포스트 아이디와 태그 아이디로 posthash 테이블에 레코드 추가
            phr.save(posthash);
        }

        return p.getId();
    }

    public void insertImages(Images images) {
        ir.save(images);
    }

    public List<Post> getPostListByNickname(String nickname) {
       return pr.findByWriterOrderByIdDesc(nickname);
    }

    public List<Images> getImgListByPostid(int id) {
        return ir.findByPostid(id);
    }

    public Post getPost(int id) {
        return pr.findById(id);
    }


    //Distinct : findDistinctBtname("name") 중복 제거 검색
    //And : findByNameAndGender("name" , "gender") 이름과 성별 동시에 만족
    //Or : findByNameOrGender("name","gender") 이름이 만족하거나 성별이 만족
    //Is, Equals : findByName("name") , findByNameIs("name") , findByNameEquals("name") 값이 같음
    //Between : findByStartDateBetween(1,10) 1과 10의 사이 값들 검색
    //LessThan : findByAgeLessThan(10) 10보다 작은 (<)
    //LessThanEqaul : findByAgeLessThanEqual(10) 10보다 작거나 같은 (<=)
    //GreaterThan : findByAgeGreaterThan(10) 10보다큰(>)
    //GreaterThanEqual : findByAgeGreaterThanEqual(10) 10보다큰(>=)
    //After : findByStartDateAfter(날짜) 날짜 이후
    //Before : findByStartDateBefore(날짜) 날짜 이전
    //like : findByNameLike("name") 이름을 포함하는 
    //StartingWith : findByNameStartingWith("name") 이름으로 시작하는
    //EndingWith : findByNameEndingWith("name") 이름으로 끝나는
    //Containing : findByNameContaining 이름을 포함하는(Like 와 유사)
    //평소에 사용하던 where name like '%철수%'는 containing을 사용합니다.
    //Like를 사용하면 where name like '철수'와 같이 동작하므로 결과가 없을수도 있습니다.


    //OrderBy : findByAgeOrderByIdDesc() id 필드 기준으로 내림차순 정렬
    //In : findByAgeIn(Collection<Age> ages) In함수 사용
    //true : findByActiveTrue() acitve 필드값이 true
    //false : findByActiveFalse() acitve 필드값이 false
    //IgnoreCase : findByNameIgnoreCase("name") 이름 검색하되 대소문자 구분하지 않음

}
