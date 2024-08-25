package com.himedia.srboardServer.service;

import com.himedia.srboardServer.dao.BoardDao;
import com.himedia.srboardServer.dto.Paging;
import com.himedia.srboardServer.entity.Board;
import com.himedia.srboardServer.entity.Reply;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
    private final BoardDao bdao;

    public List<Board> getBoardList(Paging paging) {
        return bdao.getBoardList(paging);
    }

    public int getAllCount() {
        return bdao.getAllcount();
    }

    public Board getBaord(int num) {
        return bdao.getBaord(num);
    }

    public List<Reply> getReplyList(int num) {
        return bdao.getReplyList(num);
    }

    public void inertReply(Reply reply) {
        bdao.inserReply(reply);
    }

    public void deletReply(int replynum) {
        bdao.deleteReply(replynum);
    }

    public void updateReadCount(int num) {
        bdao.updateReadCount(num);
    }

    public void insertBoard(Board board) {
        bdao.inserBoard(board);
    }

    public void updateBoard(Board board) {
        bdao.update(board);
    }

    public void deleteBoard(int num) {
        bdao.deleteBoard(num);
    }
}
