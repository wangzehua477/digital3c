$(function () {
    "use strict";
    //
    // var curUser = $ajax.getCurrentUser();
    // if (!curUser)
    //     return;


    
        var str = "<nav class=\"navbar navbar-default\" role=\"navigation\">\n" +
            "        <div class=\"container-fluid\" style='background-color: #e3e4e5'>\n" +
            "            <div class=\"navbar-header\">\n" +
            "                <a class=\"navbar-brand\" href='/user/view/index.html'><span class=\"glyphicon glyphicon-home\">3C数码</a>\n" +
            "            </div>\n" +
            "            <div>\n" +
            "                <!--向右对齐-->\n" +
            "                <p class=\"navbar-text navbar-right\" style='margin-right: 10px; cursor: pointer;'>我的3C</p>\n" +
            "                <p class=\"navbar-text navbar-right\" style='margin-right: 10px; cursor: pointer;'>我的订单</p>\n" +
            "                <p class=\"navbar-text navbar-right\" style='cursor: pointer'>购物车</p>\n" +
            "                <p class=\"navbar-text navbar-right\" style='margin-right: 10px;color: red; cursor: pointer;'>免费注册</p>\n" +
            "                <p class=\"navbar-text navbar-right\" style='cursor: pointer'>你好，请登录</p>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </nav>";
        $("#nav").html(str);
});