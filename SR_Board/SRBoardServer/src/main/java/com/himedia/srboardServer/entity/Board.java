package com.himedia.srboardServer.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Date;

@Entity
@Data
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int num;
    //@Column(name="subject")
    private String title;
    private String content;
    private String userid;
    private String email;
    private String image;
    private String savefilename;
    private String pass;
    private int readcount;
    @CreationTimestamp
    private Date writedate;
}
