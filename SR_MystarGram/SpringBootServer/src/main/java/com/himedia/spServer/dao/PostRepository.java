package com.himedia.spServer.dao;

import com.himedia.spServer.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {

//    @Query("select p from Post p where p.id IN (select ph.postid from Posthash ph where ph.hashid =:hashid) order by  p.id desc")
    //List<Post> getPostListByTag(@Param("hashid") int hashid);

    @Query("select p from Post p where p.id IN (select ph.postid from Posthash ph where ph.hashid = :hashid) order by p.id desc")
    Page<Post> getPostListByTag(@Param("hashid") int hashid, Pageable pageable);


    List<Post> findByWriterOrderByIdDesc(String nickname);

    Post findById(int id);


    Page<Post> findByContentContaining(String word, Pageable pageable);
}
