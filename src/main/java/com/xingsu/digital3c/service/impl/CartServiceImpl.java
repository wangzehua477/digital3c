package com.xingsu.digital3c.service.impl;

import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.dao.CartMapper;
import com.xingsu.digital3c.dao.ProductMapper;
import com.xingsu.digital3c.pojo.User;
import com.xingsu.digital3c.service.ICartService;
import com.xingsu.digital3c.vo.CartVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("iCartService")
public class CartServiceImpl implements ICartService {

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public ServerResponse<Integer> getCartProductCount(Integer userId) {
        if(userId == null){
            return ServerResponse.createBySuccess(0);
        }

        return ServerResponse.createBySuccess(cartMapper.selectCartProductCount(userId));
    }

    @Override
    public ServerResponse<CartVo> add(Integer userId, Integer productId, Integer count) {
        return null;
    }

    @Override
    public ServerResponse<CartVo> update(Integer userId, Integer productId, Integer count) {
        return null;
    }

    @Override
    public ServerResponse<CartVo> deleteProduct(Integer userId, String productIds) {
        return null;
    }

    @Override
    public ServerResponse<CartVo> list(Integer userId) {
        return null;
    }

    @Override
    public ServerResponse<CartVo> selectOrUnSelect(Integer userId, Integer productId, Integer checked) {
        return null;
    }
}
