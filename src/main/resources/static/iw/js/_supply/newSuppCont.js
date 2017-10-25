var corpName = param("corpName");
var aCorpName = param("aCorpName");
$("#managerName").val(corpName);
$("#aManagerName").val(aCorpName);
function newMakeContract() {
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/newMakeContract/{contract}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/newMakeContract/contract;projId=0;contractNo=123456;name=asdfasd;signAt=;regAt=;effectAt=;price;corpId=;aCorpId=;typ=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/newMakeContract/{contract}/{sys}",
		data:{
			"contract": {
				"projId": param("projId"),
				"contractNo": $$("contractNo").value,
				"name": $$("name").value,
				"signAt": $$("signAt").value,	
				"regAt": $$("regAt").value,	
				"effectAt": $$("effectAt").value,
				"price": $$("totalSalePrice").value,
				"corpId": param("corpId"),
				"aCorpId": param("aCorpId"),
				"typ": param("typ"),
				
			},				
			"sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			var reqParams = {
					contractNo: $$("contractNo").value,
					name: $$("name").value,
					aCorpId: param("aCorpId"),
					corpId: param("corpId")
				}
			var newSuppContMap = {};
			newSuppContMap.opName = "添加供应合同";
			newSuppContMap.reqParams = JSON.stringify(reqParams);
			newSuppContMap.domain = "supply";
			newSuppContMap.action = "newMakeContract";
			newSuppContMap.reqURI = "newSuppCont.html";
			if (!right(jsonData)) {
				newSuppContMap.status = "失败";
				makeBizLog(newSuppContMap);
				return;
			}
			newSuppContMap.status = "成功";
			makeBizLog(newSuppContMap);
			console.log(jsonData)
			location.href = "/iw/_supply/subProjDetail.html?id=" + param("projId") + "&&no=" + param("no");
		}
	});
}