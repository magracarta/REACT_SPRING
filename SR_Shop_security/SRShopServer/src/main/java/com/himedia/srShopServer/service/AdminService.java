package com.himedia.srShopServer.service;

import com.himedia.srShopServer.dao.AdminDao;
import com.himedia.srShopServer.dto.Paging;
import com.himedia.srShopServer.entity.*;
import jakarta.servlet.ServletContext;
import lombok.RequiredArgsConstructor;
import org.hibernate.query.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {
    private final AdminDao adao;
    private final ServletContext context;

    public Admins getAdmins(String adminid) {
        return  adao.getAdmins(adminid);
    }

    public List<Product> getProductList(Paging page, String search) {
        return adao.getProductList(page ,search);
    }

    public List<Order_view> getOrderList(Paging paging, String search) {
        return adao.getOrderList(paging , search);
    }

    public List<Qna> getQnaList(Paging paging, String search) {
        return adao.getQnaList(paging, search);
    }

    public List<Member> getmemberList(Paging paging, String search) {
        return adao.getMemberList(paging, search);
    }

    public void insertProduct(Product product, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String path = context.getRealPath("/product_images");
            File filepath = new File(path);
            if (!filepath.exists()) filepath.mkdirs();

            LocalDateTime today = LocalDateTime.now();
            long t = Long.parseLong(today.format(DateTimeFormatter.ofPattern("yyMMddHHmmss")));
            String f1 = image.getOriginalFilename().substring(0,image.getOriginalFilename().lastIndexOf("."));
            String f2 = image.getOriginalFilename().substring(image.getOriginalFilename().lastIndexOf("."));

            String filename = f1+t+f2;

            File file = new File(path+File.separator+filename);
            try {
                image.transferTo(file);
                product.setImage(f1+f2);
                product.setSavefilename(filename);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        }
        adao.insertProduct(product);
    }

    public Product getProduct(int pseq) {
        return adao.getProduct(pseq);
    }

    public void updateProduct(Product product, MultipartFile image) {
        if(image!=null && !image.isEmpty()){
            String path = context.getRealPath("/product_images");
            LocalDateTime today = LocalDateTime.now();
            long t = Long.parseLong(today.format(DateTimeFormatter.ofPattern("yyMMddHHmmss")));
            String f1 = image.getOriginalFilename().substring(0,image.getOriginalFilename().lastIndexOf("."));
            String f2 = image.getOriginalFilename().substring(image.getOriginalFilename().lastIndexOf("."));
            String filename = f1+t+f2;

            try {
                File removeFile = new File(path+File.separator+product.getSavefilename());
                removeFile.delete();
                File file = new File(path+File.separator+filename);
                product.setImage(f1+f2);
                product.setSavefilename(filename);
                image.transferTo(file);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        adao.updateProduct(product);
    }

    public void deleteProduct(int pseq) {
        Product product = adao.getProduct(pseq);
        String path = context.getRealPath("/product_images");
        File file = new File(path+File.separator+product.getSavefilename());
        file.delete();

        adao.deleteProduct(pseq);
    }

    public void nextResult(List<Integer> odseqList) {
        for(int odseq : odseqList){
            adao.nextResult(odseq);
        }
    }

    public void changeUseYn(String userid, String useyn) {
        adao.changeUseYn(userid, useyn);
    }

    public void writeReply(int qseq, String reply) {
        adao.writeReply(qseq, reply);
    }
}
