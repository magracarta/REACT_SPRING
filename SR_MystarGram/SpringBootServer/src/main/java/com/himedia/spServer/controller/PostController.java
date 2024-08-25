package com.himedia.spServer.controller;

import com.himedia.spServer.dto.Paging;
import com.himedia.spServer.entity.Images;
import com.himedia.spServer.entity.Likes;
import com.himedia.spServer.entity.Post;
import com.himedia.spServer.entity.Reply;
import com.himedia.spServer.service.PostService;
import jakarta.servlet.ServletContext;
import lombok.RequiredArgsConstructor;
import org.hibernate.Cache;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService ps;


    @GetMapping("/getPostList/{page}")
    public Map<String, Object> getPostList(@PathVariable int page,
                                           @RequestParam(value = "word", required = false) String word) {
        Map<String, Object> result = new HashMap<>();
        Page<Post> postPage = ps.getPostList(page, word);

        result.put("postList", postPage.getContent());

        return result;
    }


//    @RequestMapping("/getPostList/{page}")
//    public HashMap<String, Object> getPostList(@PathVariable int page, @RequestParam(value ="word", required = false) String word) {
//        HashMap<String, Object> result = new HashMap<>();
//
//      List<Post> postList = ps.getPostList(page,word);
//        result.put("paging", page);
//        result.put("postList",postList);
//        return result;
//    }

    @GetMapping("/getImages/{postid}")
    public List<Images> getImages(@PathVariable("postid") Integer postid) {
        return ps.getImages(postid);
    }
    @GetMapping("/getLikes/{postid}")
    public List<Likes> getLikes(@PathVariable("postid") Integer postid) {
        List<Likes> list = ps.getLikes(postid);
        return list;
    }
    @GetMapping("/getReplys/{postid}")
    public List<Reply> getReplys(@PathVariable("postid") Integer postid) {
        List<Reply> list = ps.getReplys(postid);
        return list;
    }

    @PostMapping("/addlike")
    public String addLike(@RequestParam("postid") Integer postid, @RequestParam("likenick") String likenick) {
        ps.addLike(postid,likenick);
        return "ok";
    }

    @PostMapping("/addReply")
    public String addReply(@RequestBody Reply reply) {
        ps.addReply(reply);
        return  null;
    }

    @DeleteMapping("/deleteReply/{replyid}")
    public String deleteReply(@PathVariable int replyid){
        ps.deleteReply(replyid);
        return null;
    }

    private final ServletContext context;
    @PostMapping("/imgup")
    public HashMap<String ,Object> fileup(@RequestParam("image") MultipartFile file){
        HashMap<String, Object> result = new HashMap<>();
        String realpath = context.getRealPath("/uploads");
        Calendar today = Calendar.getInstance();
        Long l = today.getTimeInMillis();
        String filename = file.getOriginalFilename();
        String f1 = filename.substring(0,filename.lastIndexOf("."));
        String f2 = filename.substring(filename.lastIndexOf("."));
        String savename = f1+l+f2;

        try {
            file.transferTo(new File(realpath+File.separator+savename));
            result.put("filename",savename);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return result;
    }

    @PostMapping("/writePost")
    public HashMap<String, Object> writePost(@RequestBody Post post) {
        HashMap<String, Object> result = new HashMap<>();

        int postid = ps.insertPost(post);
        result.put("postid",postid);
        return result;
    }

    @PostMapping("/writeImages")
    public String writeImages(@RequestBody Images images){
        ps.insertImages(images);
        return null;
    }

    @GetMapping("/getMyPost")
    public HashMap<String, Object> getMyPost(@RequestParam("nickname") String nickname) {
        HashMap<String, Object> result = new HashMap<>();
        List<Post> list = ps.getPostListByNickname(nickname);
        List<String> imglist = new ArrayList<>();

        for(Post p : list){
            List<Images> imgl = ps.getImgListByPostid(p.getId());
            String imgname = imgl.get(0).getSavefilename();
            imglist.add(imgname);
        }
        result.put("postlist",list);
        result.put("imglist",imglist);
        return result;

    }


    @GetMapping("/getPost/{id}")
    public  Post getPost(@PathVariable("id") int id){
        Post post = ps.getPost(id);

        return post;
    }

}
