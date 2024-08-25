package com.himedia.srboardServer.controller;

import com.himedia.srboardServer.dto.Paging;
import com.himedia.srboardServer.entity.Board;
import com.himedia.srboardServer.entity.Reply;
import com.himedia.srboardServer.service.BoardService;
import jakarta.servlet.ServletContext;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.HashMap;

@RequiredArgsConstructor
@RestController
@RequestMapping("/board")
public class BoardController {
    private final BoardService bs;
    private final ServletContext context;

    @GetMapping("/getBoardList/{page}")
    public HashMap<String,Object> getBoardList(@PathVariable("page") int page) {
        HashMap<String,Object> result = new HashMap<>();
        Paging paging = new Paging();

        paging.setPage(page);
        paging.setTotalCount(bs.getAllCount());
        paging.calPaing();


        result.put("boardlist",bs.getBoardList(paging));
        result.put("paging" , paging);
        return result;
    }

    @GetMapping("/getBoard/{num}")
    public HashMap<String , Object> getBoard(@PathVariable("num") int num){
        HashMap<String , Object> result = new HashMap<>();
        //bs.updateReadCount(num);
        result.put("board", bs.getBaord(num));
        return  result;
    }

    @GetMapping("/getReplyList/{num}")
    public HashMap<String , Object> getRelyList(@PathVariable("num") int num){
        HashMap<String , Object> result = new HashMap<>();
        result.put("reply", bs.getReplyList(num));
        return  result;
    }


    @PostMapping("/addReply")
    public HashMap<String , Object> addReply(@RequestBody Reply reply){
        HashMap<String , Object> result = new HashMap<>();
        bs.inertReply(reply);
        result.put("msg", "ok");
        return result;
    }

    @DeleteMapping("/deletereply/{replynum}")
    public HashMap<String , Object> deleteReply(@PathVariable("replynum") int replynum){
        HashMap<String , Object> result = new HashMap<>();
        bs.deletReply(replynum);
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/fileupload")
    public HashMap<String , Object> fileUpload(@RequestParam("image") MultipartFile file){
        HashMap<String , Object> result = new HashMap<>();
        String path = context.getRealPath("/images");

        LocalDateTime today = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMddHHmmssSSS");
        String formattedDateTime = today.format(formatter);

        String fileName = file.getOriginalFilename();

        String fn1 = fileName.substring(0, fileName.lastIndexOf("."));
        String fn2 = fileName.substring(fileName.lastIndexOf("."));
        String savefilename =  fn1 + formattedDateTime + fn2;

        File images = new File(path);
        if(!images.exists()) images.mkdir();

        try {
            file.transferTo(new File( path+ File.separator+savefilename));
            result.put("image",fileName);
            result.put("savefilename", savefilename);
        } catch ( IllegalStateException | IOException e) {
            e.printStackTrace();
        }



        return result;
    }

    @PostMapping("/insertBoard")
    public HashMap<String, Object> insertBoard(@RequestBody Board board){
        bs.insertBoard(board);
        HashMap<String, Object> result= new HashMap<String, Object>();
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/updateReadCount/{num}")
    public HashMap<String , Object> updateReadCount(@PathVariable("num") int num){
        HashMap<String , Object> result = new HashMap<>();
        bs.updateReadCount(num);
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/updateBoard")
    public HashMap<String , Object> updateBoard(@RequestBody Board board){
        HashMap<String , Object> result = new HashMap<>();
        bs.updateBoard(board);
        result.put("msg", "ok");
        return result;
    }

    @DeleteMapping("/deleteBoard/{num}")
    public String deleteBoard(@PathVariable("num") int num){
        bs.deleteBoard(num);
        return "ok";
    }
}

