package com.himedia.srboardServer.dao;

import com.himedia.srboardServer.dto.Paging;
import com.himedia.srboardServer.entity.Board;
import com.himedia.srboardServer.entity.Reply;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class BoardDao {

    private final EntityManager em;

    public List<Board> getBoardList(Paging paging) {

        return em.createQuery("select b from Board b order by b.num desc", Board.class).setFirstResult(paging.getStartNum()-1).setMaxResults(paging.getDisplayRow()).getResultList();
    }

    public int getAllcount() {
        Long count = (Long) em.createQuery("select count(b) from Board b").getSingleResult();
        return count.intValue();
    }

    public Board getBaord(int num) {
        return em.find(Board.class, num);
    }

    public List<Reply> getReplyList(int num) {
        return em.createQuery("select r from Reply r where r.boardnum =:boardnum  order by r.replynum desc", Reply.class)
                .setParameter("boardnum",num).getResultList();
    }

    public void inserReply(Reply reply) {
        em.persist(reply);
    }

    public void deleteReply(int replynum) {
        Reply reply = em.find(Reply.class, replynum);
        if(reply != null) em.remove(reply);
    }

    public void updateReadCount(int num) {
        Board board = em.find(Board.class , num);
        board.setReadcount(board.getReadcount()+1);
    }

    public void inserBoard(Board board) {
        em.persist(board);
    }

    public void update(Board board) {
        Board updateBoard = em.find(Board.class, board.getNum());
        updateBoard.setTitle(board.getTitle());
        updateBoard.setContent(board.getContent());
        updateBoard.setImage(board.getImage());
        updateBoard.setSavefilename(board.getSavefilename());
    }

    public void deleteBoard(int num) {
        Board board = em.find(Board.class, num);
        em.remove(board);
    }
}
