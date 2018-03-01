package com.xingsu.digital3c.service.impl;


import com.google.common.collect.Lists;
import com.xingsu.digital3c.common.ResponseCode;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.dao.CategoryMapper;
import com.xingsu.digital3c.dao.ProductMapper;
import com.xingsu.digital3c.pojo.Category;
import com.xingsu.digital3c.pojo.Product;
import com.xingsu.digital3c.service.ICategoryService;
import com.xingsu.digital3c.service.IProductService;
import com.xingsu.digital3c.util.PropertiesUtil;
import com.xingsu.digital3c.vo.ProductListVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.net.URLEncoder;
import java.util.List;

@Service("iProductService")
public class ProductServiceImpl implements IProductService {

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ICategoryService iCategoryService;

    public ServerResponse<List<ProductListVo>> getProductByCategory(Integer categoryId, Integer limit) {
        if (categoryId == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(), ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }

        Category category = categoryMapper.selectByPrimaryKey(categoryId);
        if (category == null) {
            //没有该分类，返回空的集合，不报错
            List<ProductListVo> productListVoList = Lists.newArrayList();
            return ServerResponse.createBySuccess(productListVoList);
        }
        List<Integer> categoryIdList = iCategoryService.selectCategoryAndChildrenById(category.getId()).getData();

        List<Product> productList = productMapper.selectByCategoryIds(categoryIdList, limit);

        List<ProductListVo> productListVoList = Lists.newArrayList();
        for(Product product :productList){
            ProductListVo productListVo = assembleProductListVo(product);
            productListVoList.add(productListVo);
        }

        return ServerResponse.createBySuccess(productListVoList);
    }

    private ProductListVo assembleProductListVo(Product product) {
        ProductListVo productListVo = new ProductListVo();
        productListVo.setId(product.getId());
        productListVo.setName(product.getName());
        productListVo.setCategoryId(product.getCategoryId());

        productListVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix", "ftp://localhost/"));
        productListVo.setMainImage(product.getMainImage());
        productListVo.setPrice(product.getPrice());
        productListVo.setSubtitle(product.getSubtitle());

        productListVo.setStatus(product.getStatus());

        return productListVo;

    }

}
