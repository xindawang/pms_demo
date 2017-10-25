/**
 * Created by drc on 17-6-25.
 */
function iotLogin() {
    if ($.cookie('custId') != null) {
        $.ajax({
            type: "GET",// 请求方式
            url: "/ih/sessions/",// 地址，就是action请求路径
            dataType: "json",// 数据类型text xml json script jsonp
            async: false,
            data: {
                custId: $.cookie('custId')
            },
            // success: function (msg) {
            //     if (msg != null) {
            //         $.cookie('custId', msg.id, {
            //             path: "/"
            //         }) // 对其生命周期进行管理，在所有此目录下cookie皆有效
            //         $.cookie('loginName', msg.name, {
            //             path: "/"
            //         });
            //         $.cookie('corpId', msg.corpId, {
            //             path: "/"
            //         });
            //         $.cookie('corpName', msg.corp.name, {
            //             path: "/"
            //         })
            //     }
            // }
        });
    }
}
