package com.himedia.spServer.dao;

import com.himedia.spServer.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikesRespository extends JpaRepository<Likes,Integer> {
    List<Likes> findByPostid(Integer postid);

    Likes findByPostidAndLikenick(Integer postid, String likenick);
}
