$(function(){
	$("#swipe").unslider();
	 if(typeof($.cookie('idNo')) == "undefined"){
		 $.cookie('idNo','',{path : "/"});
	 }
		 $$("idNo").value = $.cookie('idNo')
});
//刷新验证码
refreshChaptchImg();
$.ajax({
		type: "post",
		// http://172.16.20.6/ils/admin/sid;
		url: apphost() + "/ils/base/sid",
		async: false,
		dataType: "json",
		success: function (jsonData) {
			$.cookie('sid', jsonData.result.sid,{path : "/"});
			
				$$("idNo").value = $.cookie('idNo')
		}
	});
	refreshChaptchImg();
	function refreshChaptchImg() {
		$$("captchaImg").src =  apphost() + "/ils/chkcode/" + $.cookie("sid") + "?r=" + Math.random();
	}
	
	
	$(document).keypress(function(e) {  
	    // 回车键事件
	       if(e.which == 13) login(); 
	});
	//登陆
	function login() {
		$.ajax({
		     type: "post",
		     // @RequestMapping(value = "/login/{map}/{sys}", produces = "text/plain")
		     // http://localhost:81/ils/org/login/map;idNo=系统管理员;pass=jinyan123;chkcode=1608;sid=2FirU7AKR6VrA-AlT8gkxx/sys
		     url: apphost() + "/ils/admin/login/{map}/{sys}",
		     data: {
		             "map": {"idNo": $$("idNo").value, "pass": $$("pass").value, "sid": $.cookie("sid"), "chkcode": $$("chkcode").value},
		             "sys": {}
		     }, 
		     async: false,
		     martrix: true,
		     dataType: "json",
		     success: function (jsonData) {
		    	 $.cookie('idNo', $$("idNo").value,{path : "/"});
	             if (!right(jsonData)) return;
	             $.cookie('adminName', jsonData.result.adminName, {path : "/"});
	             $.cookie('roles', jsonData.result.roles, {path : "/"});
	             location.href = "/iw/admin/welcome.html";
		     }
		}); 
	}