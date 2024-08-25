package com.himedia.srShopServer.dto;

import lombok.Data;

@Data
public class Paging {
    private int page=1;
    private int startNum;
    private int dispayRow =5;

    public void calPaging(){
        startNum = (page -1)*dispayRow;
    }
}
