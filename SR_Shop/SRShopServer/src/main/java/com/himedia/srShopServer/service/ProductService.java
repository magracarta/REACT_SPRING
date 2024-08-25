package com.himedia.srShopServer.service;

import com.himedia.srShopServer.dao.ProductDao;
import com.himedia.srShopServer.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductDao pdao;

    public List<Product> getBestProduct() {
        return pdao.getBestProduct();
    }

    public List<Product> getNewProduct() {
        return pdao.getNewProduct();
    }

    public List<Product> getListKind(String kind) {
        return pdao.getListKind(kind);
    }

    public Product getProduct(int pseq) {
        return pdao.getProduct(pseq);
    }
}
