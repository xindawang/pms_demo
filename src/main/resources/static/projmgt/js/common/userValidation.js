// $.cookie('custId', 1, {path : "/"});
var custId= $.cookie('custId');
if (custId == null) {
	alert("用户信息丢失，请重新登录！");
	window.location = "/iw/org/login.html";
}
// else{
// 	// cookie初始化入口，需要在url中增加custId=?，此后custId保存在session中。类似入口还有myTask页面。
// 	$.ajax({
// 	    type: "GET",// 请求方式
// 	    url: "/ih/sessions/",// 地址，就是action请求路径
// 	    dataType: "json",// 数据类型text xml json script jsonp
// 		async: false,
// 	    data: {
// 	        custId: custId
// 	    },
// 	    success: function (msg) {
// 	        if (msg != null) {
// 	            $.cookie('custId', msg.id, {
// 	                path: "/"
// 	            }) // 对其生命周期进行管理，在所有此目录下cookie皆有效
// 	            $.cookie('loginName', msg.name, {
// 	                path: "/"
// 	            });
// 	            $.cookie('corpId', msg.corpId, {
// 	                path: "/"
// 	            });
// 	            $.cookie('corpName', msg.corp.name, {
// 	                path: "/"
// 	            })
// 	        }
// 	    }
// 	});
// }
//每个页面env.js调用
