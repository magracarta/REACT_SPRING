package com.himedia.spServer.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Member {
    @Id
    private String nickname;
    private String email;
    private String pwd;
    private String phone;
    private String provider;
    private String snsid;
    private String profileimg;
    private String profilemsg;

}
