package com.himedia.srShopServer.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Admins {
    @Id
    private String adminid;
    private String pwd;
    private String name;
    private String phone;
}
