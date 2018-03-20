package com.xingsu.digital3c.service;


import com.github.pagehelper.PageInfo;
import com.xingsu.digital3c.common.ServerResponse;
import com.xingsu.digital3c.pojo.User;
import com.xingsu.digital3c.pojo.request.LoginRequest;

public interface IUserService {

    ServerResponse<User> login(String username, String password);

    ServerResponse<String> register(LoginRequest data);

    ServerResponse<String> checkValid(String str, String type);

    ServerResponse selectQuestion(String username);

    ServerResponse<String> checkAnswer(String username, String question, String answer);

    ServerResponse<String> forgetResetPassword(String username, String passwordNew, String forgetToken);

    ServerResponse<String> resetPassword(String passwordOld, String passwordNew, User user);

    ServerResponse<User> updateInformation(User user);

    ServerResponse<User> getInformation(Integer userId);

    ServerResponse checkAdminRole(User user);
}
