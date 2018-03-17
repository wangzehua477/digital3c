package com.xingsu.digital3c.service;

import com.github.pagehelper.PageInfo;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.pojo.Shipping;

/**
 * Created by 14195 on 2018/3/16.
 */
public interface IShippingService {
    ServerResponse add(Integer id, Shipping shipping);

    ServerResponse<PageInfo> list(Integer id, int pageNum, int pageSize);

    ServerResponse del(Integer id, Integer shippingId);

    ServerResponse update(Integer id, Shipping shipping);

    ServerResponse select(Integer id, Integer shippingId);
}
