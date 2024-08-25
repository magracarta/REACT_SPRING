package com.himedia.srShopServer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order_detail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int odseq;
    private int oseq;
    private int pseq;
    private int quantity;

    private int result=1;



}
