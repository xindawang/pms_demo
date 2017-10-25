$("#managerName").val(param("managerName"));
$("#aManagerName").val(param("aManagerName"));
$("#totalSalePrice").val(param("disctSalePrice"));
if(param("parentId") >	 0){
	$("#totalSalePrice").attr("readOnly",true);
}

function makeContract() {
	var totalSalePrice = $$("totalSalePrice").value
	if (param("parentId") > 0)
		totalSalePrice = 0;
	
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/makeContract/{contract}/{proj}/{sys}", produces = "text/plain")
		// 只有一级项目才关心totalSalePrice的值
		// http://localhost:81/ils/org/makeContract/map;id=0;contractNo=123456;signAt=;regAt=;effectAt=/proj;distSalePrice=100000;totalSalePrice=120000/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/makeContract/{contract}/{proj}/{sys}",
		data:{
			"contract": {
				"projId": param("projId"),
				"contractNo": $$("contractNo").value,
				"signAt": $$("signAt").value,	
				"name": $$("name").value,	
				"regAt": $$("regAt").value,
				"effectAt": $$("effectAt").value,
			},	
			"proj": {
				"distSalePrice": param("disctSalePrice"),
				"totalSalePrice": totalSalePrice,
			},
			"sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
	tip("创建合同成功");
			window.location.href = "/iw/supply/myContPage.html";
		}
	});
}