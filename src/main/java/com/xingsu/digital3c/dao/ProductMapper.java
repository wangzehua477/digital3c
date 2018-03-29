package com.xingsu.digital3c.dao;

import com.xingsu.digital3c.pojo.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

@Mapper
public interface ProductMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Product record);

    int insertSelective(Product record);

    Product selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Product record);

    int updateByPrimaryKey(Product record);

    List<Product> selectByNameAndCategoryIds(@Param("productName") String productName, @Param("categoryIdList") List<Integer> categoryIdList);

    List<Product> selectRecommendProduct();

    List<Product> selectList();

    List<Product> selectProductByUser(Integer userId);

    Set<Integer> selectUserIdByProduct(@Param("productId") Integer id, @Param("userId") Integer userId);

    Set<Product> selectRecommendProductByOtherUser(Integer userId);
}