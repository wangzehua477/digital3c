$(function () {
    "use strict";
    var str = "<ul id='navUl' class='layui-nav'> " +
        "<li class='layui-nav-item navLi' ><a href='index.html'>Home</a> </li> " +
        "<li class='layui-nav-item navLi'> <a href='productList.html'>商品管理</a> </li> " +
        "<li class='layui-nav-item navLi'> <a href='categoryList.html?categoryId=100001'>类别管理</a> </li> " +
        "<li class='layui-nav-item navLi'> <a href='orderList.html'>订单管理</a> </li> " +
        "</ul>";
    $("#topNav").html(str);

    var matchFile = $utils.parseUrl(location.pathname).file;
    console.log($utils.parseUrl(location.pathname))
    $.each($(".navLi"), function (index, value) {
        var localHref = $(".navLi a").eq(index).attr("href");
        var end = localHref.indexOf("?") == -1 ? localHref.length : localHref.indexOf("?");
        if(matchFile == localHref.substring(0, end)){
            $(this).addClass("layui-this");
            $(this).siblings().remove("layui-this");
        }
    });

    var ajaxUrl = "../../user/get_information.do";
    $ajax.ajax(ajaxUrl, null, $config.HttpVerbs.GET, function (result) {
        if(result.status == 10) {
            $("#navUl").append("<li class='layui-nav-item layui-edge-right layui-layout-right navLi' > <a href='login.html'>登录</a> </li>");
        }
        sessionStorage.setItem("currentUser", JSON.stringify(result));
    });

});