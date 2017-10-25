supplyItemDetail();
//供应物项详情
function supplyItemDetail() {
	var jattrs;
	if (!param("no")) return;
	
	$.ajax({		
		type: "post",
		//@RequestMapping(value = "/supplyItemDetail/{no}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/supplyItemDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/cert/supplyItemDetail/{no}/{sys}",
		data:{
			"no": param("no"),			
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		martrix:true,
		dataType: "json",
		success: function (data) {
			if (!right(data)) return;
			console.log(data);
			toView( {"result": {"item": data.result.item} });
			jattrs = null == data.result.item.jattrs ? {} : JSON.parse(data.result.item.jattrs);
			toViewAttrs(data.result.attrs, jattrs);
		}
			
	});
}
//同意认证物项
function certItemSucc() {
	$.ajax({		
		type: "post",
		
		//@RequestMapping(value = "/certItem/{conclude}/{sys}", produces = "text/plain")
        // http://localhost:81/ils/cert/certItem/conclude;no=;certStatus=认证通过/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/cert/certItem/{conclude}/{sys}",
		data:{
			"conclude": {
				"no": param("no"),
				"certStatus": "认证通过"
			},
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		martrix:true,
		dataType: "json",
		success: function (data) {
			var reqParams = {
					no:  param("no"),
					certStatus:  "认证通过",
				}
			var logMap = {};
			logMap.opName = "同意认证";
			logMap.reqParams = JSON.stringify(reqParams);
			logMap.domain = "cert";
			logMap.action = "certItem";
			logMap.reqURI = "supplyItemDetail.html";
			
			if (!right(data)) {
				logMap.status = "失败";
				makeBizLog(logMap);
				return;
			}
			logMap.status = "成功";
			makeBizLog(logMap);
			tip("认证成功")
			console.log(data);
		}
			
	});
}
//拒绝认证物项
function certItemFail() {
	var refusalReason = $("input[name='refusalReason']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	$.ajax({		
		type: "post",
		//@RequestMapping(value = "/certItem/{conclude}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/cert/certItem/conclude;no=;certStatus=已拒绝;refusalReason=回复值不准确;certInfo=附加说明：认证拒绝的附加信息/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/cert/certItem/{conclude}/{sys}",
		data:{
			"conclude": {
				"no": param("no"),
				"certStatus": "已拒绝",
				"refusalReason": refusalReason,
				"certInfo": $$("certInfo").value
			},
			"sys": {"token": $.cookie("token")}
		},
		async: false,	
		martrix:true,
		dataType: "json",
		success: function (data) {
			var reqParams = {
					no:  param("no"),
					certStatus:  "已拒绝",
					refusalReason: refusalReason
				}
			var logMap = {};
			logMap.opName = "拒绝认证";
			logMap.reqParams = JSON.stringify(reqParams);
			logMap.domain = "cert";
			logMap.action = "certItem";
			logMap.reqURI = "supplyItemDetail.html";
			
			if (!right(data)) {
				logMap.status = "失败";
				makeBizLog(logMap);
				return;
			}
			logMap.status = "成功";
			makeBizLog(logMap);
			console.log(data);
			location.herf = "/iw/cert/certingItemPage.html";
		}
		
	});
}

