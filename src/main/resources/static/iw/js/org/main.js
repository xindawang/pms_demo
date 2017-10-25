 $(function(){
//轮播图
   $('.flexslider').flexslider({
      directionNav: true,
      pauseOnAction: false
   });
});
function skipPage(url){
	location.href=url;
}

$.ajax({
	type: "post",
	// @RequestMapping(value = "/main/{sys}", produces = "text/plain")
	// http://localhost:81/ils/org/main/sys
	url: apphost() + "/ils/org/main/{sys}",
	data: {
		"sys": {}
	}, 
	async: false,
	martrix: true,
	dataType: "json",
	//孟德利改
	success: function (jsonData) {
		if (!right(jsonData)) return;
		tip("登陆成功");
		var cust = jsonData.result.cust;
		$.cookie('idNo', cust.idNo, {path : "/"});
		$.cookie('custId', cust.id, {path : "/"});
		$.cookie('loginName', cust.name, {path : "/"});
		$.cookie('corpId', jsonData.result.corpId, {path : "/"});
		$.cookie('corpCode', jsonData.result.corpCode, {path : "/"});
		$.cookie('corpName', jsonData.result.corpName, {path : "/"});
		var perms = "";
		var domains = [];
		for (var i = 0; perm = jsonData.result.cust.perms[i]; i++) {
			perms += perm.domain + "." + perm.action + ",";
			domains.push(perm.domain);
		}
		$.cookie('perms', perms, {path : "/"});
		$.cookie('token', jsonData.result.token, {path : "/"});
		
		domains.unique();
		
	}
}); 
	
