package com.xingsu.digital3c.service;


import com.github.pagehelper.PageInfo;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.pojo.Product;
import com.xingsu.digital3c.vo.ProductDetailVo;
import com.xingsu.digital3c.vo.ProductListVo;

import java.util.List;
import java.util.Map;

public interface IProductService {

    ServerResponse<ProductDetailVo> getProductDetail(Integer productId);

    ServerResponse<PageInfo> getProductByKeywordCategory(String keyword, Integer categoryId, int pageNum, int pageSize, String orderBy);

    ServerResponse<List<ProductListVo>> getRecommendProduct();

    ServerResponse<List<ProductListVo>> getRecommendProductByUser(Integer userId);

    Map getProductList(int pageNum, int pageSize);

    ServerResponse manageProductDetail(Integer productId);

    ServerResponse delProduct(Integer productId);

    ServerResponse saveOrUpdateProduct(Product product);

    ServerResponse setSaleStatus(Integer productId, Integer status);
}
