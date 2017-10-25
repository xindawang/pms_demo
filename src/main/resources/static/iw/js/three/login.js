$(function(){
	$("#swipe").unslider();
	$("#selectuser").divselect();
});


 if(typeof($.cookie('corpCode')) == "undefined"){
	 $.cookie('corpCode','',{path : "/"});
 }
	 $$("corpCode").value = $.cookie('corpCode')

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
	$$("captchaImg").src =  apphost() + "/ils/chkcode/" + $.cookie("sid") + "?r=" + Math.random();
}

$(document).keypress(function(e) {  
    // 回车键事件
    if (e.which == 13) login(); 
});
/*
function login() {
	$.ajax({
		type: "post",
		// @RequestMapping(value = "/login/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/login/map;loginName=系统管理员;corpCode=00001;pass=jinyan123;chkcode=1608;sid=2FirU7AKR6VrA-AlT8gkxx/sys
		url: apphost() + "/ils/three/login/{map}/{sys}",
		data: { 
			"map": {"loginName": $$("loginName").value, "corpCode": $$("corpCode").value, "pass": $$("pass").value, "chkcode": $$("chkcode").value, "token": $.cookie("token")},
			"sys": {}
		}, 
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			tip("登陆成功")
			if (!right(jsonData)) return;
			$.cookie('corpCode', $$("corpCode").value, {path : "/"});
			$.cookie('loginName', jsonData.result.corp.loginName, {path : "/"});
			$.cookie('corpName', jsonData.result.corp.name, {path : "/"});
			location.href = "/iw/three/welcome.html";
		}
	}); 
}*/