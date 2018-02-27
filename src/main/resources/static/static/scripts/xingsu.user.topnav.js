$(function () {
    "use strict";
    //
    // var curUser = $ajax.getCurrentUser();
    // if (!curUser)
    //     return;


    
        var str = "<nav class=\"navbar navbar-default\" role=\"navigation\">\n" +
            "        <div class=\"container-fluid\">\n" +
            "            <div class=\"navbar-header\">\n" +
            "                <a class=\"navbar-brand\" href=\"#\">3C数码</a>\n" +
            "            </div>\n" +
            "            <div>\n" +
            "                <!--向右对齐-->\n" +
            "                <p class=\"navbar-text navbar-right\" style='margin-right: 10px'>注册</p>\n" +
            "                <p class=\"navbar-text navbar-right\">你好，请登录</p>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </nav>";
        $("#nav").html(str);
});