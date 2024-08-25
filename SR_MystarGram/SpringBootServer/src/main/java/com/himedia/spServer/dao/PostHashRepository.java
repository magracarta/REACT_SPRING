package com.himedia.spServer.dao;

import com.himedia.spServer.entity.Posthash;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostHashRepository extends JpaRepository<Posthash,Integer> {
}
