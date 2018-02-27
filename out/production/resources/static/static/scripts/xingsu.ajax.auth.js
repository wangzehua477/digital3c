/**
 * 带权限验证的ajax请求
 * 该文件依赖于jQuery、jQuery.cookie、sha1、layer
 */
var isAjaxError = false;
(function () {
    "use strict";

    var user = null;
    var noTokenFlag = false;


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
            // 转化请求的相对路径
            var ajaxUrlPath = $utils.parseUrl(ajaxUrl).path;

            user = $ajax.getCurrentUser();
            var username;
            var token;
            if (args && args.username && args.token) {
                username = args.username;
                token = args.token;
            } else {
                if (user == null) {
                    noToken();
                    return;
                }
                username = user.username ? user.username : user.phoneNumber;
                username = username ? username : user.alipayId;
                token = user.token;
            }

            ajaxUrl = ajaxUrl.replace(/\'/g, "%27"); //单引号不被编码，会引起用户身份验证失败。在这里手工转码
            if (type == "GET") {
                if (ajaxUrl.indexOf('?') > 0) {
                    ajaxUrl += "&temp=" + Math.random();
                } else {
                    ajaxUrl += "?temp=" + Math.random();
                }
            }
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

            var timeout;
            if (args && args.timeout !== null) {
                timeout = args.timeout;
            } else {
                timeout = $config.TimeOut;
            }

            var dataStr = "";
            var userHeader = "";
            var urlSplitArray = ajaxUrl.split("?");

            if (type == "GET" || type == "DELETE") {
                userHeader = type + "\n" + ajaxUrlPath + "\n" + contentType + "\n";

                if (urlSplitArray.length > 1) {
                    userHeader += urlSplitArray[1];
                }
            } else {
                dataStr = JSON.stringify(data);
                dataStr = unescape(dataStr.replace(/\\u/g, "%u"));  //兼容IE8，解决IE8下，JSON.stringify()方法使中文转换成Unicode的问题
                userHeader = type + "\n" + ajaxUrlPath + "\n" + contentType + "\n" + dataStr;
            }

            $.ajax({
                type: type,
                url: replaceUrl(ajaxUrl),
                data: dataStr,
                timeout: timeout,
                async: async,
                contentType: contentType,
                dataType: dataType,
                headers: {
                    "Authorization": username + ":" + b64_hmac_sha1(token, userHeader)
                },
                success: function (data) {
                    if (data.state && data.state == "no-token") {
                        console.log("no-token");
                        console.log(data);

                        if (user.type === $config.UserType.Insitution.key || user.type === $config.UserType.Platform.key) {
                            noToken();
                            return
                        } else {
                            callback(data);
                            return;
                        }
                    }

                    if (data.state && data.state == "no-access") {
                        console.log("no-access");
                        console.log(ajaxUrl);

                        callback(data);
                        $utils.loading.close();
                        return;
                    }

                    if (data.state && data.state == "error") {
                        console.log("exm error");
                        console.log(ajaxUrl);
                        console.log(data);

                        if (window.lvbutc && lvbutc.debug) {
                            alert(data.message);
                        }

                        callback(data);
                        return;
                    }

                    if (data && dataType == "binary") {
                        var windowUrl = window.URL || window.webkitURL;
                        if (typeof windowUrl.createObjectURL === 'function') {
                            callback(windowUrl.createObjectURL(data));
                        } else {
                            console.warn("你的浏览器不支持createObjectURL");
                        }
                        return;
                    }

                    if (!data || !data.state || data.state !== "success") {
                        var errorInfo = {
                            state: "error",
                            code: "0",
                            message: "数据无法识别" + status
                        };

                        console.log("data error");
                        console.log(ajaxUrl);
                        console.log(data);

                        if (window.lvbutc && lvbutc.debug) {
                            alert(errorInfo.message + data.message);
                        }

                        callback(errorInfo);
                        return;
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

                    if (window.lvbutc && lvbutc.debug) {
                        alert(errorInfo.message);
                    }

                    callback(errorInfo);
                }
            });

        },

        /**
         * 上传文件接口
         * @param {string} type 请求类型，限制请求动词为：POST 或 PUT
         * @param {string} uploadUrl 访问地址
         * @param {string} data 物理文件的B64编码字符串
         * @param {function} callback 回调函数
         * @param {object} 其他参数
         */
        ajaxForUpload: function (uploadUrl, data, type, callback, args) {
            // 转化请求的相对路径
            var ajaxUrlPath = $utils.parseUrl(uploadUrl).path;
            user = $ajax.getCurrentUser();
            var username;
            var token;
            if (args && args.username && args.token) {
                username = args.username;
                token = args.token;
            } else {
                if (user == null) {
                    noToken();
                    return;
                }
                username = user.username || user.phoneNumber || user.alipayId;
                token = user.token;
            }

            var contentType;
            if (!args || args.contentType == null) {
                contentType = "image/jpeg";
            } else {
                contentType = args.contentType;
            }

            var userData;
            var dataInfo = atob(data);
            userData = (type === $config.HttpVerbs.PUT ? "PUT" : "POST") + "\n" + ajaxUrlPath.split("?")[0] + "\n" + contentType + "\n" + dataInfo;
            if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
                XMLHttpRequest.prototype.sendAsBinary = function (string) {
                    var bytes = Array.prototype.map.call(string, function (c) {
                        return c.charCodeAt(0) & 0xff;
                    });
                    this.send(new Uint8Array(bytes).buffer);
                };
            }

            var xhr2 = new XMLHttpRequest();
            xhr2.timeout = $config.TimeOut;
            xhr2.open((type === $config.HttpVerbs.PUT ? "PUT" : "POST"), uploadUrl, true);
            xhr2.setRequestHeader('Content-Type', contentType);
            xhr2.setRequestHeader('Authorization', username + ":" + rstr2b64(rstr_hmac_sha1(str2rstr_utf8(token), userData)));

            xhr2.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var data = JSON.parse(this.responseText);
                        if (data.state && data.state == "no-token") {
                            console.log("no-token");
                            noToken();
                            return;
                        }

                        if (data.state && data.state == "no-access") {
                            console.log("no-access");
                            console.log(uploadUrl);
                            layer.alert("用户权限不够", {icon: 2, time: 2000});
                            $utils.loading.close();
                            return;
                        }

                        if (data.state && data.state == "error") {
                            console.log("exm error");
                            console.log(uploadUrl);
                            console.log(data);
                            callback(data);
                            return;
                        }

                        if (!data || !data.state || data.state !== "success") {
                            var errorInfo = {
                                state: "error",
                                code: "0",
                                message: "数据无法识别" + status
                            };
                            console.log("data error");
                            console.log(uploadUrl);
                            console.log(data);
                            callback(errorInfo);
                            return;
                        }
                        callback(data);
                    } else {
                        if (this.status >= 400 || this.status == 0) {
                            var errorInfo = {
                                state: "error",
                                code: this.status,
                                message: "连接出错"
                            };
                            console.log("connect error");
                            console.log(uploadUrl);
                            callback(errorInfo);
                        }
                    }
                }
            };
            xhr2.sendAsBinary(atob(data));
        },

        /**
         * 获取当前用户信息
         */
        getCurrentUser: function (noRedirect) {
            var valid = true;
            var userStr = sessionStorage.getItem($config.CurrentUserInfo);
            if (!userStr) {
                var userCookieStr = $.cookie("currentUser");
                if (userCookieStr)
                    userStr = userCookieStr;
                else
                    valid = false;
            }

            var currentUser = JSON.parse(userStr);
            if (!currentUser) {
                valid = false;
            } else if (currentUser.type != $config.UserType.Client.key) {
                var currentUserSessionIds = JSON.parse(localStorage.getItem($config.CurrentUserSessionIds));
                if (!currentUserSessionIds)
                    currentUserSessionIds = [];
                var currentUserSessionIdsMap = currentUserSessionIds.map(function (value, index) {
                    return {
                        index: index,
                        value: value
                    };
                });

                var currentUserSessionId = currentUserSessionIdsMap.find(function (entry) {
                    return entry.value.userId == currentUser.id && entry.value.uuid == currentUser.uuid;
                });

                if (!currentUserSessionId) {
                    valid = false;
                }
            }

            if (valid) {
                user = currentUser;
                return currentUser;
            } else {
                if (!noRedirect) {
                    noToken();
                }
                return false;
            }
        },
        /**
         * 处理ajax请求的网络错误和服务器错误
         * @param responseData 返回数据
         * @param type 请求类型(POST,PUT,DELETE 或 GET)
         * @param element 响应该事件的元素(用于重试,和回调方法二选一)
         * @param callback 回调方法(用于重试,和响应元素二选一).如果没有指定响应元素和回调方法,则刷新当前页面.
         * @returns {boolean} true:出现错误并已处理;false:没有错误
         */
        checkServiceError: function (responseData, type, element, callback) {
            if (responseData && (typeof(responseData) != "object" || responseData.state == "success"))
                return false;
            if (responseData && $config.UserError.indexOf(responseData.code) >= 0) {
                $utils.loading.hide();
                $utils.remind(responseData.message, "fail");
                return true;
            }
            var message = "";
            var buttonMessage = type == $config.HttpVerbs.GET ? "刷新" : "重试";
            if (responseData && responseData.state == "timeout")
                message = "网络超时";
            else if (responseData && responseData.code == "0")
                message = "操作失败，请检查网络";
            else message = type == $config.HttpVerbs.GET ? "出错了，请刷新后再试" : "出错了，请稍后再试";
            if (message) {
                if (!window.ap || !ap.isAlipay)
                    console.log(message);
                if (!isAjaxError) {
                    isAjaxError = true;
                    ap.confirm({
                        title: message,
                        confirmButtonText: buttonMessage,
                        cancelButtonText: '取消'
                    }, function (result) {
                        isAjaxError = false;
                        if (result.confirm) {
                            if (element)
                                element.trigger("click");
                            else if (callback) callback();
                            else location.reload();
                        }
                        else
                            return;
                    });
                }
            }
            return true;
        }
    };


    // 没有token
    function noToken() {
        if (noTokenFlag) {
            return;
        }

        // 移动端没有layer，以后也可能用(暂时)
        if (typeof (layer) === "undefined")
            return;

        layer.alert("用户身份验证失败，请重新登录", {icon: 2});
        noTokenFlag = true;

        setTimeout(function () {
            var loginHref = $utils.getRedirectUrl("../account/login.html");
            var fromUrl = encodeURIComponent(location.href);
            if (fromUrl) {
                location.href = loginHref + "&from=" + fromUrl;
            }
            else {
                if (parent.parent != null) {
                    parent.parent.location.href = loginHref;
                } else if (parent != null) {
                    parent.location.href = loginHref;
                } else {
                    location.href = loginHref;
                }
            }
        }, 3000);
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