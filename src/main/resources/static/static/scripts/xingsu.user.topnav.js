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
            "                <a id='register' href='register.html' class=\"navbar-text navbar-right\" style='margin-right: 10px;color: red; cursor: pointer;'>免费注册</a>\n" +
            "                <a id='login' href='login.html' class=\"navbar-text navbar-right\" style='cursor: pointer'>你好，请登录</a>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </nav>";
        $("#topNav").html(str);

        var ajaxUrl = "../../user/get_information.do";
        $ajax.ajax(ajaxUrl, null, $config.HttpVerbs.GET, function (result) {
            if(result.status != 10){
                $("#login").text("你好，" + result.data.username);
                $("#register").addClass("hidden");
                $("#login").attr("href", "personalCenter.html");
            }
            sessionStorage.setItem("currentUser", JSON.stringify(result));
        });
});