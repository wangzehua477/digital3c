package com.xingsu.digital3c.controller.backend;

import com.google.common.collect.Maps;
import com.xingsu.digital3c.common.Const;
import com.xingsu.digital3c.common.ResponseCode;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.pojo.User;
import com.xingsu.digital3c.service.IProductService;
import com.xingsu.digital3c.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * Created by 14195 on 2018/3/21.
 */
@Controller
@RequestMapping("/mange/product/")
public class ProductMangeController {

    @Autowired
    private IUserService iUserService;

    @Autowired
    private IProductService iProductService;

    /**
     * 查询商品列表
     * @param session
     * @param pageNum
     * @param pageSize
     * @return
     */
    @RequestMapping("list.do")
    @ResponseBody
    public Map getList(HttpSession session, @RequestParam(value="pageNum", defaultValue = "1") int pageNum,
                       @RequestParam(value="pageSize", defaultValue = "10") int pageSize) {
        User user = (User) session.getAttribute(Const.CURRENT_USER);
        Map resultMap = Maps.newHashMap();
        if (user == null) {
            resultMap.put("status", 1);
            resultMap.put("msg", "用户未登录，请登录后重试");
            return resultMap;
        }
        if (iUserService.checkAdminRole(user).isSuccess()) {
            return iProductService.getProductList(pageNum, pageSize);
        } else {
            resultMap.put("status", 1);
            resultMap.put("msg", "用户权限不足");
            return resultMap;
        }
    }
}
