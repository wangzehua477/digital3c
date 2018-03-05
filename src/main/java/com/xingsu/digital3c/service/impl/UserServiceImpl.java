package com.xingsu.digital3c.service.impl;

import com.xingsu.digital3c.common.Const;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.dao.UserMapper;
import com.xingsu.digital3c.pojo.User;
import com.xingsu.digital3c.pojo.request.LoginRequest;
import com.xingsu.digital3c.service.IUserService;
import com.xingsu.digital3c.util.Coder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Random;
import java.util.UUID;


@Service("iUserService")
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public ServerResponse<User> login(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            return ServerResponse.createByErrorMessage("用户名不存在");
        }

        String sha256Password = Coder.sha256(password + user.getSalt());

        //密码错误
        if(!user.getPassword().equals(sha256Password)){
            return ServerResponse.createByErrorMessage("密码错误");
        }

        user.setPassword(StringUtils.EMPTY);
        return ServerResponse.createBySuccess("登录成功", user);
    }

    @Override
    public ServerResponse<String> register(LoginRequest data) {
        ServerResponse validResponse = this.checkValid(data.username, Const.USERNAME);
        if (!validResponse.isSuccess()) {
            return validResponse;
        }
        User user = new User();
        user.setRole(Const.Role.ROLE_CUSTOMER);
        user.setUsername(data.username);

        //sha256加盐密
        String salt = UUID.randomUUID().toString();
        user.setSalt(salt);
        user.setPassword(Coder.sha256(user.getPassword()) + salt);


        user.setAnswer(null);
        user.setEmail(null);
        user.setPhone(null);
        user.setQuestion(null);

        int resultCount = userMapper.insert(user);
        if (resultCount == 0) {
            return ServerResponse.createByErrorMessage("注册失败");
        }
        return ServerResponse.createBySuccessMessage("注册成功");
    }

    @Override
    public ServerResponse<String> checkValid(String str, String type) {
        if (StringUtils.isNotBlank(type) && StringUtils.isNotBlank(str)) {
            //开始校验
            if (Const.USERNAME.equals(type)) {
                int resultCount = userMapper.checkUsername(str);
                if (resultCount > 0) {
                    return ServerResponse.createByErrorMessage("用户名已存在");
                }
            }
            //todo 待完善
            if (Const.EMAIL.equals(type)) {

            }
        } else {
            return ServerResponse.createByErrorMessage("参数错误");
        }
        return ServerResponse.createBySuccessMessage("校验成功");
    }

    @Override
    public ServerResponse selectQuestion(String username) {
        return null;
    }

    @Override
    public ServerResponse<String> checkAnswer(String username, String question, String answer) {
        return null;
    }

    @Override
    public ServerResponse<String> forgetResetPassword(String username, String passwordNew, String forgetToken) {
        return null;
    }

    @Override
    public ServerResponse<String> resetPassword(String passwordOld, String passwordNew, User user) {
        return null;
    }

    @Override
    public ServerResponse<User> updateInformation(User user) {
        return null;
    }

    @Override
    public ServerResponse<User> getInformation(Integer userId) {
        return null;
    }

    @Override
    public ServerResponse checkAdminRole(User user) {
        return null;
    }

}
