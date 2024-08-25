package com.himedia.srShopServer.service;

import com.himedia.srShopServer.dao.CartDao;
import com.himedia.srShopServer.entity.Cart;
import com.himedia.srShopServer.entity.Cart_view;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    private final CartDao cdao;

    public void insertCart(Cart cart) {
        cdao.insertCart(cart);
    }

    public HashMap<String, Object> getCartList(String userid) {
        HashMap<String, Object> result = new HashMap<>();
        List<Cart_view> cartLsit =  cdao.getcartList(userid);
        Integer toalPrice = 0;

        for (Cart_view cart : cartLsit) {
            toalPrice += (cart.getPrice2() * cart.getQuantity()) ;

        }

        result.put( "cartList",cartLsit );
        result.put( "totalPrice",toalPrice );
        return result;
    }

    public int remove(List<Long> ids) {
        cdao.remove(ids);
        return 0;
    }
}
