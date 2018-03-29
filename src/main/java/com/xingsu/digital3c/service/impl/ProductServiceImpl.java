package com.xingsu.digital3c.service.impl;


import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.xingsu.digital3c.common.Const;
import com.xingsu.digital3c.common.ResponseCode;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.dao.CategoryMapper;
import com.xingsu.digital3c.dao.ProductMapper;
import com.xingsu.digital3c.pojo.Category;
import com.xingsu.digital3c.pojo.Product;
import com.xingsu.digital3c.pojo.User;
import com.xingsu.digital3c.service.ICategoryService;
import com.xingsu.digital3c.service.IProductService;
import com.xingsu.digital3c.util.DateTimeUtil;
import com.xingsu.digital3c.util.PropertiesUtil;
import com.xingsu.digital3c.vo.ProductDetailVo;
import com.xingsu.digital3c.vo.ProductListVo;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service("iProductService")
public class ProductServiceImpl implements IProductService {

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ICategoryService iCategoryService;

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

        productListVo.setStatusDesc(product.getStatus() == Const.ProductStatusEnum.ON_SALE.getCode() ?
                Const.ProductStatusEnum.ON_SALE.getValue() :  Const.ProductStatusEnum.DROP_OFF.getValue());

        return productListVo;

    }


    public ServerResponse<ProductDetailVo> getProductDetail(Integer productId) {
        if (productId == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(), ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }

        Product product = productMapper.selectByPrimaryKey(productId);
        if (product == null) {
            return ServerResponse.createByErrorMessage("产品已下架，或者已删除");
        }

        if (product.getStatus() != Const.ProductStatusEnum.ON_SALE.getCode()) {
            return ServerResponse.createByErrorMessage("产品已下架，或者已删除");
        }

        ProductDetailVo productDetailVo = assembleProductDetailVo(product);
        return ServerResponse.createBySuccess(productDetailVo);

    }

    @Override
    public ServerResponse<PageInfo> getProductByKeywordCategory(String keyword, Integer categoryId, int pageNum, int pageSize, String orderBy) {
        if (StringUtils.isBlank(keyword) && categoryId == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(), ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }

        List<Integer> categoryIdList = new ArrayList<>();

        if (categoryId != null) {
            Category category = categoryMapper.selectByPrimaryKey(categoryId);
            if (category == null && StringUtils.isBlank(keyword)) {
                //没有该分类，并且没有关键字，返回空的集合，不报错
                PageHelper.startPage(pageNum, pageSize);
                List<ProductListVo> productListVoList = Lists.newArrayList();
                PageInfo pageInfo = new PageInfo(productListVoList);
                return ServerResponse.createBySuccess(pageInfo);
            }
            categoryIdList = iCategoryService.selectCategoryAndChildrenById(category.getId()).getData();
        }

        if (StringUtils.isNotBlank(keyword)) {
            keyword = new StringBuilder().append("%").append(keyword).append("%").toString();
        }

        PageHelper.startPage(pageNum, pageSize);
//        //排序处理
//        if (StringUtils.isNotBlank(orderBy)) {
//            if (Const.ProductListOrderBy.PRICE_ASC_DESC.contains(orderBy)) {
//                String[] orderByArray = orderBy.split("-");
//                PageHelper.orderBy(orderByArray[0] + " " + orderByArray[1]);
//            }
//        }
        List<Product> productList = productMapper.selectByNameAndCategoryIds(StringUtils.isBlank(keyword) ? null : keyword,
                categoryIdList.size() == 0 ? null : categoryIdList);

        List<ProductListVo> productListVoList = Lists.newArrayList();
        for(Product product :productList){
            ProductListVo productListVo = assembleProductListVo(product);
            productListVoList.add(productListVo);
        }

        PageInfo pageInfo = new PageInfo(productList);
        pageInfo.setList(productListVoList);

        return ServerResponse.createBySuccess(pageInfo);
    }

    @Override
    public ServerResponse<List<ProductListVo>> getRecommendProduct() {
        List<Product> productList = productMapper.selectRecommendProduct();
        List<ProductListVo> productListVoList = Lists.newArrayList();
        for(Product product : productList){
            ProductListVo productListVo = assembleProductListVo(product);
            productListVoList.add(productListVo);
        }
        return ServerResponse.createBySuccess(productListVoList);
    }

    //根据用户去推荐商品
    @Override
    public ServerResponse<List<ProductListVo>> getRecommendProductByUser(Integer userId) {
        if(userId == null)
            getRecommendProduct();
        //1. 得到该用户的所有购买商品的记录
        List<Product> userProductList = productMapper.selectProductByUser(userId);
        Set<Integer> RPUserSets = Sets.newHashSet();
        for(Product product : userProductList){
            //2. 得到买过该用户商品的所有用户
            Set<Integer> userIdSets = productMapper.selectUserIdByProduct(product.getId(), userId);
            RPUserSets.addAll(userIdSets);
        }
        //3, 寻找那些用户购买过的商品，推荐给该用户
        Set<Product> allRPProduct = Sets.newHashSet();
        for(Integer i : RPUserSets){
            Set<Product> userRPProduct = productMapper.selectRecommendProductByOtherUser(i);
            allRPProduct.addAll(userRPProduct);
        }

        //转成前端所需要的数据
        List<ProductListVo> productListVoList = Lists.newArrayList();
        for(Product product : allRPProduct){
            productListVoList.add(assembleProductListVo(product));
        }

        return ServerResponse.createBySuccess(productListVoList);
    }





    // backend
    @Override
    public Map getProductList(int pageNum, int pageSize) {
        //startPage -- start
        //填充自己的sql查询逻辑
        //pageHepler--收尾
        PageHelper.startPage(pageNum, pageSize);
        List<Product> productList = productMapper.selectList();

        List<ProductListVo> productListVoList = Lists.newArrayList();
        for (Product productItem : productList) {
            ProductListVo productListVo = assembleProductListVo(productItem);
            productListVoList.add(productListVo);
        }

        PageInfo pageResult = new PageInfo(productList);
        pageResult.setList(productListVoList);
        return assembleMap(pageResult);
    }

    @Override
    public ServerResponse manageProductDetail(Integer productId) {
        if (productId == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(), ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }

        Product product = productMapper.selectByPrimaryKey(productId);
        if (product == null) {
            return ServerResponse.createByErrorMessage("产品不存在");
        }

        //VO对象--value object
        //pojo-->bo(business object) --> vo(view object)

        ProductDetailVo productDetailVo = assembleProductDetailVo(product);
        return ServerResponse.createBySuccess(productDetailVo);
    }

    @Override
    public ServerResponse delProduct(Integer productId) {
        if(productId == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(), ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }

        //商品要删除必须要先下架
        Product product = productMapper.selectByPrimaryKey(productId);
        if(product == null){
            return ServerResponse.createByErrorMessage("该商品不存在！");
        }
        if(product.getStatus() <= Const.ProductStatusEnum.ON_SALE.getCode()){
            return ServerResponse.createByErrorMessage("下架的商品才能删除");
        }

        int rowCount = productMapper.deleteByPrimaryKey(productId);
        if(rowCount > 0){
            return ServerResponse.createBySuccess("删除商品成功");
        }

        return ServerResponse.createByErrorMessage("删除商品失败");
    }

    @Override
    public ServerResponse saveOrUpdateProduct(Product product) {
        if (product != null) {
            if (org.apache.commons.lang3.StringUtils.isNotBlank(product.getSubImages())) {
                String[] subImageArray = product.getSubImages().split(",");
                if (subImageArray.length > 0) {
                    product.setMainImage(subImageArray[0]);
                }
            }

            if (product.getId() != null) {
                int rowCount = productMapper.updateByPrimaryKeySelective(product);
                if (rowCount > 0) {
                    return ServerResponse.createBySuccess("更新产品成功");
                }
                return ServerResponse.createBySuccess("更新产品失败");
            } else {
                int rowCount = productMapper.insert(product);
                if (rowCount > 0) {
                    return ServerResponse.createBySuccess("新增产品成功");
                }
                return ServerResponse.createBySuccess("新增产品失败");
            }
        }

        return ServerResponse.createByErrorMessage("新增或更新产品参数不正确");
    }

    @Override
    public ServerResponse setSaleStatus(Integer productId, Integer status) {
        if (productId == null || status == null) {
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.getCode(), ResponseCode.ILLEGAL_ARGUMENT.getDesc());
        }
        Product product = new Product();
        product.setId(productId);
        product.setStatus(status);
        int rowCount = productMapper.updateByPrimaryKeySelective(product);
        if (rowCount > 0) {
            return ServerResponse.createBySuccess("修改商品销售状态成功");
        }
        return ServerResponse.createByErrorMessage("修改商品销售状态失败");
    }

    private Map assembleMap(PageInfo pageResult) {
        Map resultMap = Maps.newHashMap();

        resultMap.put("data", pageResult.getList());
        resultMap.put("total", pageResult.getTotal());
        resultMap.put("status", 0);
        return resultMap;
    }

    private ProductDetailVo assembleProductDetailVo(Product product) {
        ProductDetailVo productDetailVo = new ProductDetailVo();
        productDetailVo.setId(product.getId());
        productDetailVo.setSubtitle(product.getSubtitle());
        productDetailVo.setPrice(product.getPrice());
        productDetailVo.setMainImage(product.getMainImage());
        productDetailVo.setSubImages(product.getSubImages());
        productDetailVo.setCategoryId(product.getCategoryId());
        productDetailVo.setDetail(product.getDetail());
        productDetailVo.setName(product.getName());
        productDetailVo.setStatus(product.getStatus());
        productDetailVo.setStock(product.getStock());

        productDetailVo.setImageHost(PropertiesUtil.getProperty("ftp.server.http.prefix", "ftp://localhost/"));

        Category category = categoryMapper.selectByPrimaryKey(product.getCategoryId());
        if (category == null) {
            //默认根节点
            productDetailVo.setParentCategoryId(0);
        } else {
            productDetailVo.setParentCategoryId(category.getParentId());
            productDetailVo.setCategoryName(category.getName());

            //设置父类名字， 可以优化
            Category category2 = categoryMapper.selectByPrimaryKey(category.getParentId());
            productDetailVo.setParentCategoryName(category2.getName());
        }

        productDetailVo.setCreateTime(DateTimeUtil.dateToStr(product.getCreateTime()));
        productDetailVo.setUpdateTime(DateTimeUtil.dateToStr(product.getUpdateTime()));

        return productDetailVo;
    }

}
