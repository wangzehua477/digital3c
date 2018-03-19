package com.xingsu.digital3c.service;

import com.xingsu.digital3c.common.ServerResponse;

import java.util.Map;

/**
 * Created by 14195 on 2018/3/16.
 */
public interface IOrderService {

    ServerResponse getOrderCartProduct(Integer userId);

    ServerResponse createOrder(Integer userId, Integer shippingId);

    ServerResponse getOrderList(Integer id, int pageNum, int pageSize);

    ServerResponse getOrderDetail(Integer id, Long orderNo);

    ServerResponse pay(Long orderNo, Integer id, String path);

    ServerResponse aliCallback(Map<String, String> params);

    ServerResponse queryOrderPayStatus(Integer id, Long orderNo);
}
