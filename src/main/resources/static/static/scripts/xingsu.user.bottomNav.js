$(function () {
    "use strict";
    //
    // var curUser = $ajax.getCurrentUser();
    // if (!curUser)
    //     return;



    var str = "<div class=\"panel-footer\">\n" +
        "                <div style=\"text-align: center;\">\n" +
        "                    <div>\n" +
        "                        <a  href=\"https://www.baidu.com\" target=\"_blank\">百度</a> |\n" +
        "                        <a  href=\"http://3c.jd.com\" target=\"_blank\">京东3C</a> |\n" +
        "                        <a  href=\"https://www.taobao.com\" target=\"_blank\">淘宝</a> |\n" +
        "                        <a  href=\"https://www.zhihu.com\" target=\"_blank\">知乎</a>\n" +
        "                    </div>\n" +
        "                    <p class=\"glyphicon glyphicon-copyright-mark text-muted\">\n" +
        "                        2018 digital3c.com All Right Reserved\n" +
        "                    </p>\n" +
        "                </div>\n" +
        "            </div>";
    $("#bottomNav").html(str);

});