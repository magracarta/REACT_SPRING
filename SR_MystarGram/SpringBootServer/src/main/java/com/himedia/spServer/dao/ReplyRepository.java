package com.himedia.spServer.dao;

import com.himedia.spServer.entity.Reply;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ReplyRepository extends CrudRepository<Reply, Integer> {

    List<Reply> findByPostidOrderByIdDesc(Integer postid);
}
