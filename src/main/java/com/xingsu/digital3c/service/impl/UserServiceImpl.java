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
        user.setPassword(Coder.sha256(data.password + salt));


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
        //防止横向越权，要校验这个用户的旧密码
        int resultCount = userMapper.checkPassword(Coder.sha256(passwordOld + user.getSalt()), user.getId());
        if (resultCount == 0) {
            return ServerResponse.createByErrorMessage("旧密码错误");
        }

        user.setPassword(Coder.sha256(passwordNew + user.getSalt()));
        int updateCount = userMapper.updateByPrimaryKeySelective(user);
        if (updateCount > 0) {
            return ServerResponse.createBySuccessMessage("密码更新成功");
        }
        return ServerResponse.createByErrorMessage("密码更新失败");
    }

    @Override
    public ServerResponse<User> updateInformation(User user) {
        //username 不能被更新
        //email需要进行校验，检验新的email是不是已经存在
        int resultCount = userMapper.checkEmailByUserId(user.getEmail(), user.getId());
        if (resultCount > 0) {
            return ServerResponse.createByErrorMessage("email已存在");
        }
        User updateUser = new User();
        updateUser.setId(user.getId());
        updateUser.setEmail(user.getEmail());
        updateUser.setPhone(user.getPhone());
        updateUser.setQuestion(user.getQuestion());
        updateUser.setAnswer(user.getAnswer());

        int updateCount = userMapper.updateByPrimaryKeySelective(updateUser);
        if (updateCount > 0) {
            return ServerResponse.createBySuccess("更新个人信息成功", updateUser);
        }
        return ServerResponse.createByErrorMessage("更新个人信息失败");

    }

    @Override
    public ServerResponse<User> getInformation(Integer userId) {
        User user = userMapper.selectByPrimaryKey(userId);
        if (user == null) {
            return ServerResponse.createByErrorMessage("找不到当前用户");
        }
        user.setPassword(StringUtils.EMPTY);
        return ServerResponse.createBySuccess(user);
    }

    @Override
    public ServerResponse checkAdminRole(User user) {
        return null;
    }

}
