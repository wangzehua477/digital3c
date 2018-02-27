/**
 * 该文件依赖于jQuery、jQuery.cookie、sha1、layer
 */
(function () {
    "use strict";

    window.$ajax = {
        /**
         * 访问后台接口，如果用户信息失效则跳转到登录页，如果用户没有权限，则进行提示，其余情况执行callback函数
         * @ajaxUrl {string} type 请求类型
         * @data {string} url 访问地址
         * @type {object} data 请求类型为"POST"和"GET"时,发送给后台的数据
         * @callback {function} callback 回调函数
         * @args {object} 其他参数(例如下载文件的时候，可以传入dataType:binary，contentType:null，async:false，其他的参数根据需要传入)
         */
        ajax: function (ajaxUrl, data, type, callback, args) {
            ajaxUrl = ajaxUrl.replace(/\'/g, "%27"); //单引号不被编码，会引起用户身份验证失败。在这里手工转码。
            if (type == "GET") {
                if (ajaxUrl.indexOf('?') > 0) {
                    ajaxUrl += "&temp=" + Math.random();
                } else {
                    ajaxUrl += "?temp=" + Math.random();
                }
            }

            var dataType = (args && args.dataType) || "json";

            var async = true
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

            var dataStr = "";
            var userHeader = "";
            var urlSplitArray = ajaxUrl.split("?");

            if (type == "GET" || type == "DELETE") {
                if (args && args.dataType == "binary") {
                    userHeader = type + "\n" + urlSplitArray[0] + "\n" + "\n";
                } else {
                    userHeader = type + "\n" + urlSplitArray[0] + "\n" + "application/json" + "\n";
                }

                if (urlSplitArray.length > 1) {
                    userHeader += urlSplitArray[1];
                }
            } else {
                dataStr = JSON.stringify(data);
                dataStr = unescape(dataStr.replace(/\\u/g, "%u"));  //兼容IE8，解决IE8下，JSON.stringify()方法使中文转换成Unicode的问题
                userHeader = type + "\n" + urlSplitArray[0] + "\n" + "application/json" + "\n" + dataStr;
            }

            $.ajax({
                type: type,
                url: replaceUrl(ajaxUrl),
                data: dataStr,
                async: async,
                contentType: contentType,
                dataType: dataType,
                success: function (data) {
                    callback(data);
                },
                error: function (xhr, status, error) {
                    var errorInfo = {
                        state: "error",
                        code: xhr.status,
                        message: "连接出错" + status
                    };
                    console.log("ajax error");
                    console.log(ajaxUrl);
                    console.log(errorInfo);
                    callback(errorInfo);
                }
            });
        },
    };

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