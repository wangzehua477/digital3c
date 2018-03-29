package com.xingsu.digital3c.dao;

import com.xingsu.digital3c.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    int checkUsername(String username);

    User selectByUsername(String username);

    User selectLogin(@Param("username") String username, @Param("password") String password);

    int checkEmailByUserId(@Param("email") String email, @Param("userId") Integer userId);

    int checkPassword(@Param("password") String password, @Param("userId") Integer userId);

    String selectQuestionByUsername(String username);

    int checkAnswer(@Param("username") String username, @Param("question") String question, @Param("answer") String answer);

    int updatePasswordByUsername(@Param("username") String username, @Param("passwordNew") String sha256Password, @Param("salt") String salt);

    Integer selectUserBySha256Password(String sha256Password);
}