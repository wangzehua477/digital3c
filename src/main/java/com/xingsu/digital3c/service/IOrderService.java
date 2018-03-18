package com.xingsu.digital3c.service;

import com.xingsu.digital3c.common.ServerResponse;

/**
 * Created by 14195 on 2018/3/16.
 */
public interface IOrderService {

    ServerResponse getOrderCartProduct(Integer userId);

    ServerResponse createOrder(Integer userId, Integer shippingId);

    ServerResponse getOrderList(Integer id, int pageNum, int pageSize);
}
