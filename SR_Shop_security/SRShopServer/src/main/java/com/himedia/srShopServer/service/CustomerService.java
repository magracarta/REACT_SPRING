package com.himedia.srShopServer.service;

import com.himedia.srShopServer.dao.CustomerDao;
import com.himedia.srShopServer.dto.Paging;
import com.himedia.srShopServer.entity.Qna;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {
    private final CustomerDao cdao;

    public List<Qna> getQnaList(Paging paging) {
        return cdao.getQnaList(paging);
    }

    public void insertQna(Qna qna) {
        cdao.insertQna(qna);
    }

    public Qna getQna(int qseq) {
        return  cdao.getQna(qseq);
    }
}
