package com.himedia.spServer.dao;

import com.himedia.spServer.entity.Images;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ImagesRepository extends CrudRepository<Images, Integer> {
    List<Images> findByPostid(Integer postid);
}
