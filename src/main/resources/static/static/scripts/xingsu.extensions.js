(function () {
    "use strict";

    /**
    * 扩展Array.indexOf函数
    */
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }

            for (; from < len; from++) {
                if ((from in this) && this[from] === elt) {
                    return from;
                }
            }

            return -1;
        };
    }

    /**
     * 去掉数组元素中重复项
     */
    if (!Array.prototype.unique) {
        Array.prototype.unique = function () {
            var res = [], hash = {};
            for (var i = 0, elem; (elem = this[i]) != null; i++) {
                if (!hash[elem]) {
                    res.push(elem);
                    hash[elem] = true;
                }
            }
            return res;
        };
    }

    /**
     * 为Array扩展find函数
     */
    if (!Array.prototype.find) {
        Array.prototype.find = function (predicate) {
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            var o = Object(this);
            var len = o.length >>> 0;
            var thisArg = arguments[1];
            var k = 0;

            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                k++;
            }

            return undefined;
        };
    }

    /**
     * 为Array扩展filter函数
     */
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fun /* , thisArg*/) {
            "use strict";

            if (this === void 0 || this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
                throw new TypeError();

            var res = [];
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i];

                    // NOTE: Technically this should Object.defineProperty at
                    //       the next index, as push can be affected by
                    //       properties on Object.prototype and Array.prototype.
                    //       But that method's new, and collisions should be
                    //       rare, so use the more-compatible alternative.
                    if (fun.call(thisArg, val, i, t))
                        res.push(val);
                }
            }

            return res;
        };
    }

    /**
    * 为String增加format函数
    */
    if (!String.format) {
        String.format = function () {
            if (arguments.length <= 1) {
                throw new Error("arguments length must be greater than 1");
            }

            var params = [];
            for (var i = 0, length = arguments.length; i < length; i++) {
                params.push(arguments[i]);
            }

            var statement = params.shift();
            return statement.replace(/\{(\d+)\}/g, function (value, index) {
                return params[index];
            });
        };
    }

    /**
     * 为String增加startsWith函数
     */
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (prefix) {
            return this.slice(0, prefix.length) === prefix;
        };
    }

    /**
     * 为String增加endsWith
     */
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

    /**
    * 扩展Console对象，使浏览器支持Console
    */
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
    var method;
    var noop = function () { };
    while (length--) {
        method = methods[length];
        if (!console[method]) {
            console[method] = noop;
        }
    }

    /**
     * 为Date对象增加format函数
     */
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                    //月份
            "d+": this.getDate(),                         //日期
            "h+": this.getHours(),                        //小时
            "m+": this.getMinutes(),                      //分
            "s+": this.getSeconds(),                      //秒
            "q+": Math.floor((this.getMonth() + 3) / 3),  //季度
            "S": this.getMilliseconds()                   //毫秒
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }

        return fmt;
    };

})();