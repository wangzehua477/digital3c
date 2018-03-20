package com.xingsu.digital3c.service;


import com.github.pagehelper.PageInfo;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.vo.ProductDetailVo;
import com.xingsu.digital3c.vo.ProductListVo;

import java.util.List;

public interface IProductService {

    ServerResponse<ProductDetailVo> getProductDetail(Integer productId);

    ServerResponse<PageInfo> getProductByKeywordCategory(String keyword, Integer categoryId, int pageNum, int pageSize, String orderBy);
}
