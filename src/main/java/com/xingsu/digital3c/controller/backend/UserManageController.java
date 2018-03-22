package com.xingsu.digital3c.controller.backend;

import com.xingsu.digital3c.common.Const;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.pojo.User;
import com.xingsu.digital3c.pojo.request.LoginRequest;
import com.xingsu.digital3c.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;

/**
 * Created by 14195 on 2018/3/21.
 */
@Controller
@RequestMapping("/manage/user/")
public class UserManageController {
    @Autowired
    private IUserService iUserService;

    @RequestMapping(value="login.do", method = RequestMethod.POST)
    @ResponseBody
    public ServerResponse<User> login(@RequestBody LoginRequest data, HttpSession session){
        ServerResponse<User> response = iUserService.login(data.username, data.password);
        if(response.isSuccess()){
            User user = response.getData();
            if(user.getRole() == Const.Role.ROLE_ADMIN){
                //说明登录的是管理员
                session.setAttribute(Const.CURRENT_USER, user);
                return response;
            }else{
                return ServerResponse.createByErrorMessage("不是管理员，无法登录");
            }
        }
        return response;
    }
}
