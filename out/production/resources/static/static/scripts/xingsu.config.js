(function () {
    "use strict";

    window.$config = {
        //服务器端系统配置信息
        SystemConfig:"SystemConfig",

        // 列表页默认显示的条数
        DefaultPageSize: 10,

        // 访问sessionStorage设置或获取当前用户信息。
        CurrentUserInfo: "CurrentUserInfo",

        // 当前用户搜索历史
        CurrentSearchHistory: "CurrentSearchHistory",

        // 当前订单(草稿)详情
        CurrentOrderDraft: "CurrentOrderDraft",

        // 最后添加或编辑的样品信息
        LastSampleInfo: "LastSampleInfo",

        // 当前检测对象信息
        CurrentTestObject: "CurrentTestObject",

        // 当前样品信息
        CurrentSample: "CurrentSample",

        // 本次选中的检测项目
        SelectedItems: "SelectedItems",

        // 分组检测项目下的分组本次选中的检测项目
        SelectedGroupItems: "SelectedGroupItems",

        // 本次选中的综合检测项目
        SelectedIntegratedItems: "SelectedIntegratedItems",

        // 再来一单功能标记（start/ongoing/undefined，为start时表示再来一单页面需要复制订单）
        OneMoreOrderFlag: "OneMoreOrderFlag",

        // 自定义检测项目列表
        CustomItems: "CustomItems",

        // 当前在聊天的用户
        CurrentChattingClients:"CurrentChattingClients",

        // 访问localStorage设置或获取当前用户发送推荐短信的计数信息。
        UserRecommendationCountsInfo:"UserRecommendationCountsInfo",

        // 设置获取localStorage中CurrentUserIds
        CurrentUserSessionIds:"CurrentUserSessionIds",

        //超时时间保护（毫秒）
        TimeOut: 5000
    }
}());