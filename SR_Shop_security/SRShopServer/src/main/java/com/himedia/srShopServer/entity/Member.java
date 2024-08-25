package com.himedia.srShopServer.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = "memberRoleList")
public class Member {
    @Id
    private String userid;
    private String pwd;
    private String name;
    private String phone;
    private String email;
    private String zip_num;
    private String address1;
    private String address2;
    private String address3;

    @CreationTimestamp
    private Timestamp indate;
    @ColumnDefault("Y")
    private String useyn;
    private String provider;

    @ElementCollection(fetch = FetchType.LAZY )
    @Builder.Default
    private List<MemberRole> memberRoleList = new ArrayList<MemberRole>();

}
