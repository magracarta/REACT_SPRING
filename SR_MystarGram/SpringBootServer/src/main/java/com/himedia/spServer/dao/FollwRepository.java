package com.himedia.spServer.dao;

import com.himedia.spServer.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollwRepository extends JpaRepository<Follow , Integer> {
    List<Follow> findByFfrom(String nickname);
    //[{ffrom:'hong1',fto:'abcd'},{ffrom:'hong1',fto:'cdef'} ...]
    List<Follow> findByFto(String nickname);

    Optional<Follow> findByFfromAndFto(String ffrom, String fto);
    //[{ffrom:'abcd',fto:'hong1'},{ffrom:'cdef',fto:'hong1'} ...]
}
