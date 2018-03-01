package com.xingsu.digital3c.service;


import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.vo.ProductListVo;

import java.util.List;

public interface IProductService {

    ServerResponse<List<ProductListVo>> getProductByCategory(Integer categoryId, Integer limit);
}
