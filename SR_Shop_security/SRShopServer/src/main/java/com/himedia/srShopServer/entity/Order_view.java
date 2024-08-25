package com.himedia.srShopServer.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
public class Order_view {
    @Id
    private int odseq;
    private int oseq;
    @CreationTimestamp
    private Timestamp indate;
    private String userid;
    private String mname;
    private String zip_num;
    private String address1;
    private String address2;
    private String phone;
    private int pseq;
    private String pname;
    private int price2;
    private int quantity;
    private int result;

}
