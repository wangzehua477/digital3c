package com.xingsu.digital3c.controller.portal;

import com.github.pagehelper.PageInfo;
import com.xingsu.digital3c.common.Const;
import com.xingsu.digital3c.common.ResponseCode;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.pojo.Shipping;
import com.xingsu.digital3c.pojo.User;
import com.xingsu.digital3c.service.IShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * Created by 14195 on 2018/3/16.
 */

@Controller
@RequestMapping("/shipping/")
public class ShippingController {

    @Autowired
    private IShippingService iShippingService;

    /**
     * 新增收货地址
     * @param session
     * @return
     */
    @RequestMapping(value = "add.do", method = RequestMethod.POST)
    @ResponseBody
    public ServerResponse add(HttpSession session, @RequestBody Shipping shipping){
        User currentUser = (User) session.getAttribute(Const.CURRENT_USER);
        if(currentUser == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(),ResponseCode.NEED_LOGIN.getDesc());
        }

        return iShippingService.add(currentUser.getId(), shipping);
    }

    /**
     * 查找地址列表
     * @param pageNum
     * @param pageSize
     * @param session
     * @return
     */
    @RequestMapping(value = "list.do", method = RequestMethod.GET)
    @ResponseBody
    public ServerResponse<PageInfo> list(@RequestParam(value="pageNum", defaultValue = "1") int pageNum,
                                         @RequestParam(value="pageSize", defaultValue = "10") int pageSize,
                                         HttpSession session){
        User currentUser = (User) session.getAttribute(Const.CURRENT_USER);
        if(currentUser == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(),ResponseCode.NEED_LOGIN.getDesc());
        }
        return iShippingService.list(currentUser.getId(), pageNum, pageSize);
    }

    /**
     * 删除收货地址
     * @param session
     * @param shippingId
     * @return
     */
    @RequestMapping(value = "del.do", method = RequestMethod.DELETE)
    @ResponseBody
    public ServerResponse del(HttpSession session, Integer shippingId){
        User currentUser = (User) session.getAttribute(Const.CURRENT_USER);
        if(currentUser == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(),ResponseCode.NEED_LOGIN.getDesc());
        }
        return iShippingService.del(currentUser.getId(), shippingId);
    }

    /**
     * 更新收货地址
     * @param session
     * @param shipping
     * @return
     */
    @RequestMapping(value = "update.do", method = RequestMethod.PUT)
    @ResponseBody
    public ServerResponse update(HttpSession session, @RequestBody  Shipping shipping){
        User currentUser = (User) session.getAttribute(Const.CURRENT_USER);
        if(currentUser == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(),ResponseCode.NEED_LOGIN.getDesc());
        }
        return iShippingService.update(currentUser.getId(), shipping);
    }

    /**
     * 查找某个地址详情
     * @param session
     * @param shippingId
     * @return
     */
    @RequestMapping(value = "select.do")
    @ResponseBody
    public ServerResponse select(HttpSession session, Integer shippingId){
        User currentUser = (User) session.getAttribute(Const.CURRENT_USER);
        if(currentUser == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.getCode(),ResponseCode.NEED_LOGIN.getDesc());
        }
        return iShippingService.select(currentUser.getId(), shippingId);
    }
}
