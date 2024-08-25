package com.himedia.srShopServer;

import com.himedia.srShopServer.dao.OrderService;
import com.himedia.srShopServer.entity.Admins;
import com.himedia.srShopServer.entity.Cart;
import com.himedia.srShopServer.service.AdminService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class TestController {

    @Autowired OrderService os;

    @Test
    public void testMethod1() {
        int oseq = os.insertOrders("scott");
        List<Long> cseq = new ArrayList<>();
        cseq.add(42L);

        os.insertOrderDetail(oseq ,cseq );
    }

    @Autowired AdminService as;

    @Test
    public void testMethod2() {
        Admins admn1 = new Admins();
        admn1.setName("admin");
        admn1.setPwd("admin");

        Admins admin = as.getAdmins("admin");

        Assertions.assertThat(admn1.getName()).isEqualTo(admin.getName());
        Assertions.assertThat(admn1.getPwd()).isEqualTo(admin.getPwd());

    }

}
