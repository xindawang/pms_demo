$(function () {
    $("#swipe").unslider();
});
if (typeof($.cookie('idNo')) == "undefined") {
    $.cookie('idNo', '', {path: "/"});
}
$$("idNo").value = $.cookie('idNo')

if (!$.cookie("sid"))
    $.ajax({
        type: "post",
        // http://172.16.20.6/ils/base/sid;
        url: apphost() + "/ils/base/sid",
        async: false,
        dataType: "json",
        success: function (jsonData) {
            $.cookie('sid', jsonData.result.sid, {path: "/"});
        }
    });

refreshChaptchImg();
function refreshChaptchImg() {
    $$("captchaImg").src = apphost() + "/ils/chkcode/" + $.cookie("sid") + "?r=" + Math.random()
}

$(document).keypress(function (e) {
    // 回车键事件
    if (e.which == 13) login();
});


function login() {
    $.ajax({
        type: "GET",// 请求方式
        url: "/ih/sessions/",// 地址，就是action请求路径
        dataType: "json",// 数据类型text xml json script jsonp
        async: false,
        data: {
            custId: 1
        },
        success: function (msg) {
            if (msg != null) {
                $.cookie('custId', msg.id, {
                    path: "/"
                }) // 对其生命周期进行管理，在所有此目录下cookie皆有效
                $.cookie('loginName', msg.name, {
                    path: "/"
                });
                $.cookie('corpId', msg.corpId, {
                    path: "/"
                });
                $.cookie('corpName', msg.corp.name, {
                    path: "/"
                })
                location.href = "/iw/org/welcome.html";
            }
        }
    });
}



