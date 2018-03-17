/**
 * 带权限验证的ajax请求
 * 该文件依赖于jQuery、jQuery.cookie、sha1、layer
 */
var isAjaxError = false;
(function () {
    "use strict";

    window.$ajax = {
        /**
         * 访问后台接口，如果用户信息失效则跳转到登录页，如果用户没有权限，则进行提示，其余情况执行callback函数
         * @ajaxUrl {string} url 访问地址
         * @data {string} data 请求类型为"POST"和"PUT"时,发送给后台的数据
         * @type {object} type 请求类型
         * @callback {function} callback 回调函数
         * @args {object} 其他参数(例如下载文件的时候，可以传入dataType:binary，contentType:null，async:false，其他的参数根据需要传入)
         */
        ajax: function (ajaxUrl, data, type, callback, args) {
            var dataType = (args && args.dataType) || "json";

            var async = true;
            if (args) {
                if (typeof (args.async) === "boolean") {
                    async = args.async;
                }
            }

            var contentType;
            if (args && args.contentType == null) {
                contentType = null;
            } else {
                contentType = "application/json";
            }

            var forcedLogin = false;
            if(args){
                if(typeof (args.forcedLogin) === "boolean"){
                    forcedLogin = args.forcedLogin;
                }
            }

            var dataStr = "";
            if (type != "GET" && type != "DELETE") {
                dataStr = JSON.stringify(data);
            }

            $.ajax({
                type: type,
                url: replaceUrl(ajaxUrl),
                data: dataStr,
                async: async,
                contentType: contentType,
                dataType: dataType,
                success: function (data) {
                    if(forcedLogin){
                        if(data.status == 10){
                            layer.alert(data.msg, {
                                icon: 2,
                                end: function () {
                                    location.href = "login.html";
                                }}
                            );
                            window.setTimeout(function () {
                                location.href = "login.html";
                            }, 3000);
                            return;
                        }
                    }

                    callback(data);
                },
                error: function (xhr, status, error) {
                    var errorInfo = {
                        state: "error",
                        code: xhr.status,
                        message: "连接出错" + status
                    };

                    if (status == "timeout") {
                        errorInfo.state = "timeout";
                    }

                    console.log("ajax error");
                    console.log(ajaxUrl);
                    console.log(errorInfo);

                    callback(errorInfo);
                }
            });

        }
    }

    function replaceUrl(url) {
        // url中的#已经调用encodeURIComponent编码过
        // url的path中的#再次编码，查询字符串中的#不需要再次编码
        var index = url.indexOf("?");
        if (index < 0) {
            return url.replace(/\%23/g, "%2523");
        }

        var first = url.substring(0, index);
        var last = url.substring(index);
        return first.replace(/\%23/g, "%2523") + last;
    }
}());