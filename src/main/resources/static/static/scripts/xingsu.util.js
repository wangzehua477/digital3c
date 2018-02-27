(function () {
    "use strict";

    window.$utils = {
        /**
         * 绑定对象数组到某个下拉框(select)节点
         * @param {node} HTML Select节点
         * @param {source} 对象数组
         * @param {keyField} 键
         * @param {valueField} 值
         * @param {handle} 在真正的绑定前处理key、value的函数
         */
        bind: function (node, source, keyField, valueField, handle) {
            function getField(fields) {
                var length = fields.length;
                for (var i = 0; i < length; i++) {
                    var field = fields[i];
                    var fieldValue = source[0][field];
                    if (fieldValue || fieldValue === "") {
                        return field;
                    }
                }
                return null;
            }

            function getField1(fields) {
                for (var i in fields) {
                    var field = fields[i];
                    for (var item in source) {
                        var fieldValue = source[item][field];
                        if (fieldValue || fieldValue === "") {
                            return field;
                        }
                    }
                }
                return null;
            }

            if (!(node instanceof HTMLSelectElement)) {
                throw new TypeError("node必须是HTMLSelectElement节点");
            }

            var length = source.length;
            var keyFields = ["code", "key", "id"];
            var valueFields = ["name", "value", "display"];

            if (length) {
                for (var i = 0; i < length; i++) {
                    var item = source[i];

                    //不绑定不再使用的字典项(inuse==false)
                    if (typeof (item) === "string") {
                        if (source[item].inuse === false)
                            continue;
                    }
                    else {
                        if (source.inuse != undefined && source.inuse === false)
                            continue;
                    }

                    if (!keyField) {
                        keyField = getField(keyFields);
                    }

                    var keyValue = item[keyField];
                    if (!keyField || (keyValue !== "" && !keyValue)) {
                        console.log(item);
                        console.log(keyField);
                        throw new Error("请给出正确的keyField");
                    }

                    if (!valueField) {
                        valueField = getField(valueFields);
                    }

                    var valueValue = item[valueField];
                    if (!valueField || (valueValue !== "" && !valueValue)) {
                        throw new Error("请给出正确的valueField");
                    }

                    if (handle) {
                        var result = handle(keyValue, valueValue);
                        keyValue = result.key;
                        valueValue = result.value;
                    }

                    var option = new Option(valueValue, keyValue);
                    node.options.add(option);
                }
            } else {
                for (var item in source) {
                    //不绑定不再使用的字典项(inuse==false)
                    if (typeof (item) === "string") {
                        if (source[item].inuse === false)
                            continue;
                    }
                    else {
                        if (source.inuse != undefined && source.inuse === false)
                            continue;
                    }

                    if (!keyField) {
                        keyField = getField1(keyFields);
                    }

                    var keyValue = source[item][keyField];
                    if (!keyField || (keyValue !== "" && !keyValue)) {
                        console.log(item);
                        console.log(source[item]);
                        throw new Error("请给出正确的keyField");
                    }

                    if (!valueField) {
                        valueField = getField1(valueFields);
                    }

                    var valueValue = source[item][valueField];
                    if (!valueField || (valueValue !== "" && !valueValue)) {
                        throw new Error("请给出正确的valueField");
                    }

                    if (handle) {
                        var result = handle(keyValue, valueValue);
                        keyValue = result.key;
                        valueValue = result.value;
                    }

                    var option = new Option(valueValue, keyValue);
                    if (keyValue !== "" || valueValue !== "")
                        node.options.add(option);
                }
            }
        },

        /**
         * 复制对象属性
         * 把对象source中的属性和值复制到target对象中
         */
        copy: function (source, target) {
            if (!source || !target) {
                throw new TypeError("source或target不能为空");
            }

            for (var item in source) {
                target[item] = source[item];
            }
        },

        /**
         * 把url字符串转换为url对象
         * @param {string} url url字符串
         * @returns {object} url对象
         */
        parseUrl: function (url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length,
                        i = 0,
                        s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = decodeURIComponent(s[1]);
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        },

        /**
         * 把s转换成Boolean类型的值
         * @param {object} s 任意值
         * @returns {boolean} Boolean值
         */
        parseBoolean: function (s) {
            if (s == null) {
                return false;
            }

            if (typeof (s) === "object") {
                return true;
            }

            if (typeof (s) === "boolean") {
                return s;
            }

            var str = s.toString();
            if (!str) {
                return false;
            }

            if (str.toLowerCase() === "false") {
                return false;
            } else {

            }

            var f = parseFloat(str);
            if (isNaN(f)) {
                return true;
            } else {
                return !!f;
            }
        },

        /**
         * 把s转换成Date类型的值（本系统中的日期字符串格式均为：yyyy-MM-dd HH:mm:ss）
         * @param {object} str 字符串
         * @returns {boolean} Date类型
         */
        parseDate: function (str) {
            var strArray = str.split(" ");
            var dateArray = strArray[0].split("-");
            return new Date(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10) - 1, parseInt(dateArray[2], 10));
        },

        /**
         * 替换url中的参数值
         * @param {string} url url
         * @param {object} params 参数对象
         * @return {string} 新的url
         */
        reviseUrlParams: function (url, params) {
            var urlObject = $utils.parseUrl(url);
            for (var p in params) {
                urlObject.params[p] = params[p];
            }

            var queryString = "";
            for (var p in urlObject.params) {
                if (queryString) {
                    queryString += "&";
                }
                queryString = queryString + p + "=" + encodeURIComponent(urlObject.params[p]);
            }
            queryString = "?" + queryString;

            return urlObject.path + queryString;
        },

        /**
         * 创建一个url参数，这个参数类似于：[start],[end]
         * @param {string} start 起始值
         * @param {string} end 终止值
         * @return {string}
         */
        createRangeParam: function (start, end) {
            if ((start == undefined || start == null) && (end == undefined || end == null)) {
                return ",";
            }

            var param = "";
            if (start == "") {
                param = ",";
            } else {
                param = start + ",";
            }

            if (end != "") {
                param += end;
            }

            return param;
        },

        // 检查手机号码（严格检查）
        checkPhone: function (phone) {
            var regex = /^1[34578]\d{9}$/;
            return regex.test(phone);
        },

        // 检查手机号码（不严格的检查）
        checkPhone2: function (phone) {
            var regex = /^1\d{10}$/;
            return regex.test(phone);
        },

        // 检查邮箱（严格检查）
        checkEmail: function (email) {
            var pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            return email.search(pattern) != -1;
        },

        // 检查邮箱（不严格的检查）
        checkEmail2: function (email) {
            if (!email)
                return false;

            if (email.indexOf("@") >= 0)
                return true;

            return false;
        },

        // 检查是否是汉字
        checkZhcn: function (input) {
            var regex = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
            return regex.test(input);
        },

        // 检查物流单号
        checkExpressNum: function (input) {
            var regex = /^[A-Za-z\u4e00-\u9fa5\s\d]+(·[A-Za-z\u4e00-\u9fa5\s\d]+)*$/;
            return regex.test(input);
        },

        // 检查是否是数字
        checkNumber: function (input) {
            var regex = /^[0-9]+(·[0-9]+)*$/;
            return regex.test(input);
        },

        // 校验日期格式
        checkDate: function (date) {
            var regex = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/;
            return regex.test(date);
        },

        // 检查身份证号码
        checkIdCardNumber: function (number) {
            var validator = new IDValidator();
            return validator.isValid(number);
        },

        // 检验金额（精确到小数点后两位）
        checkAmount: function (amount) {
            var regex = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
            return regex.test(amount);
        },

        /**
         * 检查字段数据是否合法
         * @param fieldName {string} 字段名称
         * @param fieldDesc {string} 字段描述
         * @param required {boolean} 是否是必须字段
         * @param minLength {int} 字段最小长度
         * @param maxLength {int} 字段最大长度
         * @param callback {function} 回调函数
         */
        validField: function (fieldName, fieldDesc, required, minLength, maxLength, callback) {
            var $fieldName = $("#" + fieldName);
            var fieldValue = $fieldName.val();
            var fieldValueLength = fieldValue.length;

            if (!required) {
                if (fieldValueLength === 0) {
                    return {result: true, value: fieldValue};
                }
            }

            if (fieldValueLength == 0) {
                return {result: false, message: "请选择/输入" + fieldDesc};
            }

            if (fieldValueLength < minLength || fieldValueLength > maxLength) {
                //$fieldName.focus();

                var msg;
                if (minLength == 0) {
                    msg = fieldDesc + "的最大长度为：" + maxLength;
                } else if (minLength == maxLength) {
                    msg = fieldDesc + "的长度为" + maxLength;
                } else {
                    msg = fieldDesc + "的长度在" + minLength + "～" + maxLength + "之间";
                }

                return {result: false, message: msg};
            }

            if (callback) {
                var vr = callback(fieldValue);
                if (!vr.result) {
                    //$fieldName.focus();
                    return {result: false, message: vr.message};
                }
            }

            return {result: true, value: fieldValue};
        },

        /**
         * 生成带版本号的url
         * @param {string} url原始url
         */
        getRedirectUrl: function (url) {
            var version = sessionStorage.getItem("clientVersion");
            if (url.indexOf("_v=" + version) >= 0) {
                return url;
            }

            if (url.indexOf("?") >= 0) {
                url += "&";
            } else {
                url += "?";
            }
            url += "_v=" + encodeURIComponent(version);
            return url;
        },

        /**
         * 处理字符串，如果输入null或undefined，返回空字符串，否则返回原样字符串
         * @param {string} s 需要处理的输入
         * @returns {string} 处理后的字符串
         */
        toStr: function (s, defaultS) {
            if (typeof (s) === "boolean")
                return s.toString();
            if (!defaultS) defaultS = "";
            return !s ? defaultS : s.toString();
        },

        /**
         * 把字符串转换为Camel命名方式
         * @param {string} s 输入的字符串
         * @return {string}
         */
        toCamel: function (s) {
            if (typeof (s) != "string")
                return s;

            if (!s || s.length < 2)
                return s;

            var arr = s.split(/\W/g);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    if (arr[i].length > 1) {
                        var arrStr = arr[i];
                        arr[i] = arrStr[0].toUpperCase() + arrStr.substring(1);
                    } else {
                        arr[i] = arr[i].toUpperCase();
                    }
                }
            }

            s = arr.join("");
            return s[0].toLowerCase() + s.substring(1);
        },

        /**
         * 把字符串转换为Pascal命名方式
         * @param s {string} 输入的字符串
         * @return {string}
         */
        toPascal: function (s) {
            if (typeof (s) != "string")
                return s;

            if (!s || s.length < 2)
                return s;

            return s[0].toUpperCase() + s.substring(1);
        },

        /*
         * 截取字符串
         * @param {string} s 输入的字符串
         * @param {int} maxLength 最大长度
         * @param {string} postfix 后缀
         * @return {string}
         */
        cutOfString: function (s, maxLength, postfix) {
            if (typeof (s) != "string")
                return s;

            if (!s) {
                return "";
            }

            if (s.length > maxLength) {
                if (postfix == null || postfix == undefined)
                    postfix = "...";
                return s.substr(0, maxLength) + postfix;
            } else {
                return s;
            }
        },

        // 生成随机数
        random: function (len) {
            var array = [];
            var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            var length = chars.length;
            for (var i = 0; i < len; i++) {
                var j = Math.ceil(Math.random() * length);
                array[i] = chars[j];
            }
            return array.join("");
        },

        // 截取字节
        cutByteLenth: function (str) {
            var byteLenth = 0,
                length = str.length,
                array = [];

            for (var i = 0; i < length; i++) {
                if (str.charCodeAt(i) > 255) {
                    byteLenth += 2;
                } else {
                    byteLenth++;
                }
                array.push(str[i]);

                if (byteLenth > 12) {
                    array.splice(i, 1, "..");
                    break;
                }
            }

            return array.join("");
        },

        /**
         * 把对象(有key、name属性)的属性转换成键值对数组
         * @param obj 目标对象
         * @return 属性数组
         */
        propertiesToArray: function (obj) {
            var arrayOfPros = [];
            var fields = ["key", "name", "desc"];
            var fieldsLength = fields.length;

            for (var pro in obj) {
                if (typeof (obj[pro]) != "function") {
                    var proObj = obj[pro];
                    var item = {};
                    for (var i = 0; i < fieldsLength; i++) {
                        var field = fields[i];
                        if (proObj.hasOwnProperty(field)) {
                            item[field] = proObj[field];
                        }
                    }
                    arrayOfPros.push(item);
                }
            }

            return arrayOfPros;
        },

        /**
         * 用于获取属性key中带有下划线的对象的特定属性值
         * @param source原始对象
         * @param keyValue 属性key的值
         * @param valueField 要获取值的属性名称
         */
        getBy: function (obj, keyValue, valueField) {
            if (!obj) {
                return null;
            }

            if (keyValue == null)
                return null;

            // 兼容$config.PhotoType
            var keyIndex = keyValue.indexOf(":");
            if (keyIndex > 0) {
                keyValue = keyValue.substring(keyIndex + 1);
            }

            var proValue = null;
            for (var pro in obj) {
                var item = obj[pro];
                if (item.key === keyValue || item.value === keyValue) {
                    proValue = item;
                    break;
                }
            }

            if (!proValue || !valueField) {
                return proValue;
            }

            if (typeof (valueField) !== "string") {
                throw new Error("valueField must be string");
            }

            return proValue[valueField];
        },

        /**
         * 获取远程操作对象
         */
        getRemotingObject: function () {
            var remotingValue = sessionStorage.getItem($config.REMOTING_KEY);
            if (!remotingValue) {
                return false;
            }

            var remotingObj = JSON.parse(remotingValue);
            return remotingObj ? remotingObj : false;
        },

        /**
         * 创建时间对象，之所以单独拿出来是为了以兼容IE8的方式创建时间对象
         * 在需要用到时间基准的地方将后台返回的当前时间字符串变为时间对象
         * @param {string} s 日期字符串
         * 传入参数timeString的格式类似于“2016-07-19 14:51:34”（如果分隔符变化可考虑扩展本方法传分隔符参数）
         */
        createTimeObject: function (s) {
            if (!s)
                return null;

            var ymd = s.substring(0, 10).split("-");
            var hms = s.substring(11).split(":");

            return new Date(ymd[0], parseInt(ymd[1], 10) - 1, ymd[2], hms[0], hms[1], hms[2]);
        },
        /**
         * loading
         */
        loading: {
            /**
             * 开始显示loading,适用于layer
             */
            start: function () {
                $utils.loading.layerIndex = layer.load(2, {
                    shade: [0.4, '#393D49'],
                    content: '<div style="padding-top:8px; margin-left:50px; width:70px;">加载中...</div>'
                });
            },
            /**
             * 关闭loading,适用于layer
             */
            close: function () {
                try {
                    layer.close($utils.loading.layerIndex);
                } catch (ex) {
                }
            },

            /**
             * 开始显示支付宝loading
             * @param message
             */
            show: function (message) {
                message = message || "正在加载";
                setTimeout(function () {
                    if (window.ap && ap.isAlipay) {
                        ap.showLoading({
                            content: message
                        });
                    } else {
                        console.warn(String.format("$utils.show(\"{0}\")", message));
                    }
                }, 10);
            },

            /**
             * 隐藏支付宝loading
             */
            hide: function (delay) {
                if (!delay)
                    delay = 100;

                setTimeout(function () {
                    if (window.ap && ap.isAlipay) {
                        ap.hideLoading();
                    } else {
                        console.warn(String.format("$utils.hide(\"{0}\")", delay));
                    }
                }, delay);
            }
        },

        /**
         * 支付宝弹窗控件（错误信息提示）
         */
        remind: function (message, type) {
            if (window.ap && ap.isAlipay) {
                ap.showToast({
                    content: message,
                    type: type || "none",
                    duration: 2000
                });
            } else {
                console.warn(String.format("$utils.remind(\"{0}\")", message));
            }
        },

        /**
         * 比较日期差
         * @param start 起始日期
         * @param end 终止日期
         */
        diffDays: function (start, end) {
            var startDate = this.parseDate(start);
            var endDate = this.parseDate(end);
            var DAY_TIMES = 24 * 60 * 60 * 1000;
            return parseInt((endDate - startDate) / DAY_TIMES, 10) + 1;
        },

        /**
         * 比较月份差
         * @param start 起始日期
         * @param end 终止日期
         */
        diffMonths: function (start, end) {
            var startDate = this.parseDate(start);
            var endDate = this.parseDate(end);

            var startYear = startDate.getFullYear();
            var startMonth = startDate.getMonth() + 1;
            var endYear = endDate.getFullYear();
            var endMonth = endDate.getMonth() + 1;

            var months = 0;
            if (startYear === endYear) {
                months = endMonth - startMonth;
            } else {
                months = (endYear - startYear) * 12 - startMonth + endMonth;
            }
            return months + 1;
        },

        /**
         * @param start 开始日期
         * @param end 终止日期
         * @param granularity day或month
         */
        rangeDates: function (start, end, granularity) {
            Date.prototype.addDay = function (day) {
                var that = this;
                return new Date(Date.parse(that) + 86400000 * day);
            };

            var startDate = this.parseDate(start);
            var endDate = this.parseDate(end);

            var array = [];

            switch (granularity) {
                case "day":
                    array.push(startDate);
                    var days = this.diffDays(start, end);
                    for (var i = 1; i < days; i++) {
                        startDate = startDate.addDay(1);
                        array.push(startDate);
                    }
                    break;
                case "month":
                    var startYear = startDate.getFullYear();
                    var startMonth = startDate.getMonth();
                    var endYear = endDate.getFullYear();
                    var endMonth = endDate.getMonth();
                    var m = endYear - startYear;
                    if (m === 0) {
                        for (var j = startMonth; j <= endMonth; j++) {
                            array.push(new Date(startYear, j, 1));
                        }
                    } else if (m <= 1) {
                        for (var k = startMonth; k < 12; k++) {
                            array.push(new Date(startYear, k, 1));
                        }

                        for (var k = 0; k <= endMonth; k++) {
                            array.push(new Date(endYear, k, 1));
                        }
                    } else if (m > 1) {
                        for (var k = startMonth; k < 12; k++) {
                            array.push(new Date(startYear, k, 1));
                        }

                        for (var k = 0; k < 12; k++) {
                            array.push(new Date((startYear + 1), k, 1));
                        }

                        for (var k = 0; k <= endMonth; k++) {
                            array.push(new Date(endYear, k, 1));
                        }
                    }
                    break;
            }

            return array;
        },

        /**
         * 数组求和
         * @param array int[]
         */
        sum: function (array) {
            var result = 0;
            var length = array.length;
            for (var i = 0; i < length; i++) {
                result += array[i];
            }
            return result;
        },

        /**
         * 倒计时
         * @param start 开始时间
         * @param end   结束时间
         * @param span  时间跨度(小时)
         */
        countDown: function (start, end, span) {
            if (start == null) {
                return "error";
            }
            var startTime = (new Date(start.replace(/\-/g, "/"))).getTime();
            var endTime = (new Date(end.replace(/\-/g, "/"))).getTime();
            var date = span * 60 * 60 * 1000 - (endTime - startTime);

            var days = Math.floor(date / (24 * 3600 * 1000));

            var leave1 = date % (24 * 3600 * 1000);
            var hours = Math.floor(leave1 / (3600 * 1000));

            var leave2 = leave1 % (3600 * 1000);
            var minutes = Math.floor(leave2 / (60 * 1000));

            var str = "";
            if (days)
                str += days + "天";

            if (hours)
                str += hours + "小时";

            if (minutes)
                str += minutes + "分钟";

            if (!days && !hours && !minutes)
                str += "1分钟";

            return str;
        },

        // 尝试解决iphone上修改title有时失败
        setTitle: function (title) {
            document.title = title;
            var mobile = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(mobile)) {
                var iframe = document.createElement('iframe');
                iframe.style.visibility = 'hidden';
                iframe.setAttribute('src', 'loading.png');
                var iframeCallback = function () {
                    setTimeout(function () {
                        iframe.removeEventListener('load', iframeCallback);
                        document.body.removeChild(iframe);
                    }, 0);
                };
                iframe.addEventListener('load', iframeCallback);
                document.body.appendChild(iframe);
            }
        },

        /**
         * 把检测项目按名字的字母顺序排列
         */
        sortItems: function (array) {
            var array1 = [];
            var array2 = [];

            for (var i = 0; i < array.length; i++) {
                var temp = array[i];
                if (temp.name.charCodeAt(0) > 255) {
                    temp.pinyin = pinyinUtil.getFirstLetter(temp.name);
                    array2.push(temp)
                } else {
                    array1.push(temp);
                }
            }

            array1.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

            array2.sort(function (a, b) {
                return a.pinyin.localeCompare(b.pinyin, {co: "pinyin"});
            });

            return array1.concat(array2);
        },

        /**
         * 简单的键值对（字典）
         */
        Map: function (name) {
            var _keys = [];
            var _values = {};
            var _name = name || null;
            var _changedFn;

            function _callChangedFn(e) {
                if (_changedFn) {
                    _changedFn(e);
                }
            }

            return {
                keys: _keys,
                values: _values,
                init: function (k, v, n) {
                    _keys = k;
                    _values = v;

                    this.keys = _keys;
                    this.values = _values;

                    var _args = {
                        sender: _name,
                        keys: k,
                        func: "init"
                    }
                    _callChangedFn(_args);
                },
                get: function (key) {
                    var _key = key + "";
                    return _values[_key];
                },
                put: function (key, value) {
                    var _key = key + "";
                    var target = _values[_key];
                    if (target == null || target == undefined) {
                        _keys.push(_key);
                    }

                    _values[_key] = value;

                    var _args = {
                        sender: _name,
                        key: key,
                        func: "put"
                    }
                    _callChangedFn(_args);
                },
                remove: function (key) {
                    var _key = key + "";
                    var index = _keys.indexOf(_key);
                    if (index < 0) {
                        return;
                    }

                    _keys.splice(index, 1);
                    delete _values[_key];

                    var _args = {
                        sender: _name,
                        key: key,
                        func: "remove"
                    }
                    _callChangedFn(_args);
                },
                clear: function () {
                    if (this.isEmpty()) {
                        return;
                    }

                    _keys = [];
                    _values = [];

                    var _args = {
                        sender: _name,
                        func: "clear"
                    }
                    _callChangedFn(_args);
                },
                containsKey: function (key) {
                    var _key = key + "";
                    return _keys.indexOf(_key) >= 0;
                },
                each: function (fn) {
                    if (typeof fn != "function") {
                        throw new TypeError('fn must be a function');
                    }

                    var len = _keys.length;
                    for (var i = 0; i < len; i++) {
                        var k = _keys[i];
                        fn(k, _values[k], i);
                    }
                },
                isEmpty: function () {
                    return _keys.length == 0;
                },
                size: function () {
                    return _keys.length;
                },
                changed: function (fn) {
                    if (fn == null || fn == undefined) {
                        return;
                    }

                    if (typeof fn != "function") {
                        throw new TypeError('fn must be a function');
                    }

                    _changedFn = fn;
                },
                onChanged: function () {
                    var _args = {
                        sender: _name,
                        func: "onChanged"
                    }
                    _callChangedFn(_args);
                }
            };
        },

        /**
         * 调整图片大小（适应显示区域）
         *
         * @param $picElement               Element img元素
         * @param areaHeight                int     区域高度
         * @param areaWidth                 int     区域宽度
         * @param autoMargin                bool    调整边距
         * return 图片显示宽高信息
         * height   int 图片显示高度
         * width    int 图片显示宽度
         */
        reSizePicture: function ($picElement, areaHeight, areaWidth, autoMargin) {
            if (!$picElement || !areaHeight || !areaWidth)
                return null;

            var picHeight = ($picElement[0] && $picElement[0].naturalHeight) ? $picElement[0].naturalHeight : $picElement.height();
            var picWidth = ($picElement[0] && $picElement[0].naturalWidth) ? $picElement[0].naturalWidth : $picElement.width();
            if (!picHeight || !picWidth)
                return null;

            var sizeInfo = {};
            var heightRatio = parseFloat(picHeight / areaHeight);
            var widthRatio = parseFloat(picWidth / areaWidth);
            if (heightRatio <= 1 && widthRatio <= 1) {
                sizeInfo.height = picHeight;
                sizeInfo.width = picWidth;
            } else {
                var ratio = Math.max(heightRatio, widthRatio);
                sizeInfo.height = parseInt(picHeight / ratio);
                sizeInfo.width = parseInt(picWidth / ratio);
            }

            $picElement.attr("width", sizeInfo.width);
            $picElement.attr("height", sizeInfo.height);
            if (autoMargin) {
                var marginUpAndDown = "auto";
                var marginLeftAndRight = "auto";
                if (parseInt((areaHeight - sizeInfo.height) / 2) > 0)
                    marginUpAndDown = parseInt((areaHeight - sizeInfo.height) / 2).toString() + "px";
                if (parseInt((areaWidth - sizeInfo.width) / 2) > 0)
                    marginLeftAndRight = parseInt((areaWidth - sizeInfo.width) / 2).toString() + "px";

                $picElement.css({margin: String.format('{0} {1}', marginUpAndDown, marginLeftAndRight)});
            }

            return sizeInfo;
        },

        /**
         * 深拷贝对象和数组
         */
        cloneObj: function (obj) {
            var str, newobj = obj.constructor === Array ? [] : {};
            if (typeof obj !== 'object') {
                return;
            } else if (window.JSON) {
                str = JSON.stringify(obj),
                    newobj = JSON.parse(str);
            } else {
                for (var i in obj) {
                    newobj[i] = typeof obj[i] === 'object' ?
                        cloneObj(obj[i]) : obj[i];
                }
            }
            return newobj;
        }

    };
}());