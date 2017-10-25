$(function(){
	$("#swipe").unslider();
});
 if(typeof($.cookie('idNo')) == "undefined"){
	 $.cookie('idNo','',{path : "/"});
 }
	 $$("idNo").value = $.cookie('idNo')
//获取sid 并存入cookie
if (!$.cookie("sid")) 
	$.ajax({
		type: "post",
		// http://172.16.20.6/ils/base/sid;
		url: apphost() + "/ils/base/sid",
		async: false,
		dataType: "json",
		success: function (jsonData) {
			$.cookie('sid', jsonData.result.sid, {path : "/"});
		}
	});
//刷新验证码
refreshChaptchImg();
function refreshChaptchImg() {
	$$("captchaImg").src =  apphost() + "/ils/chkcode/" + $.cookie("sid") + "?r=" + Math.random()
}

$(document).keypress(function(e) {
	// 回车键事件
	if (e.which == 13) login();
});

//认证人员登陆
function login() {
	$.ajax({
		type: "post",
		// @RequestMapping(value = "/login/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/login/map;idNo=系统管理员;pass=jinyan123;chkcode=1608;sid=2FirU7AKR6VrA-AlT8gkxx/sys
		url: apphost() + "/ils/org/login/{map}/{sys}",
		data: {
			"map": { "idNo": $$("idNo").value, "pass": $$("pass").value, "chkcode": $$("chkcode").value, "sid": $.cookie("sid")},
			"sys": {}
		}, 
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			var reqParams = {
					idNo:  $$("idNo").value,
					chkcode:  $$("chkcode").value
				}
			var logMap = {};
			logMap.opName = "用户登录";
			logMap.reqParams = JSON.stringify(reqParams);
			logMap.domain = "cert";
			logMap.action = "login";
			logMap.reqURI = "login.html";
			
			if (!right(jsonData)) return;
			
			tip("登陆成功")
			$.cookie('idNo', $$("idNo").value,{path : "/"});
			$.cookie('custId', jsonData.result.cust.id, {path : "/"});
			$.cookie('loginName', jsonData.result.cust.name, {path : "/"});
			$.cookie('corpId', jsonData.result.corpId, {path : "/"});
			$.cookie('corpCode', jsonData.result.corpCode, {path : "/"});
			$.cookie('corpName', jsonData.result.corpName, {path : "/"});
			var perms = "";
			for (var i = 0; perm = jsonData.result.cust.perms[i]; i++) perms += perm.domain + "." + perm.action + ",";
			$.cookie('perms', perms, {path : "/"});
			$.cookie('token', jsonData.result.token, {path : "/"});
			logMap.status = "成功";
			makeBizLog(logMap);
			console.log(jsonData)
			location.href = "/iw/cert/welcome.html";
		}
	}); 
	
}