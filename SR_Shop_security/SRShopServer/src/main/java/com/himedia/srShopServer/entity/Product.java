package com.himedia.srShopServer.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private int pseq;
    private String name;
    private String kind;
    private int price1;
    private int price2;
    private int price3;
    private String content;
    private String image;
    private String savefilename;
    private String bestyn = "N";
    private String useyn = "Y";

    @CreationTimestamp
    private Timestamp indate;


}
