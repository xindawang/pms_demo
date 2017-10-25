//项目列表
var status = "";
_commit();
projPaginate();
function _commit() {
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/myProjPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/myProjPage/condition;nameLike=;scretLvl=公开,秘密;status=初始,已报价/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/myProjPage/{condition}/{sys}",
		data:{
			"condition": {
				"nameLike": $$("nameLike").value, 
				"status": "",
				"scretLvl": ""},
				
	        "sys": {
	        	"offset": $$("offset").value,
	    		"limit": $$("limit").value, 
	    		"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);		
			toView(jsonData,true);
			if(jsonData.result.myProjPage.length > 0) {
				if(jsonData.result.myProjPage[0].parentId > 0 && $.cookie("corpId") == jsonData.result.myProjPage[0].corpId) {
					$(".totalSupplyPriceDisPlay").show();
					$(".disctSupplyPriceDisPlay").show();
				}
			}
		}
		
	});
}

function projPaginate() {
	if ($$("projPage-nav")) {
		$("#projPage-nav").pagination({
			items: $$("projTotal").value,
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("offset").value = $$("limit").value * (pageIndex - 1);
				_commit();
			}
		});
	}
}

//项目流标
function failProj(el) {	
	var no = $(el).parent().parent().find("[name='no']").val();
	if (confirm("是否确认流标？")){
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/failProj/{no}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/failProj/asdfaskwe23sd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/failProj/{no}/{sys}",
		data:{
			"no": no,
	        "sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			var reqParams = {
					no: no,
					nameLike: $$("nameLike").value,
				}
			var projPageMap = {};
			projPageMap.opName = "项目流标";
			projPageMap.reqParams = JSON.stringify(reqParams);
			projPageMap.domain = "supply";
			projPageMap.action = "failProj";
			projPageMap.reqURI = "projPage.html";
			if (!right(jsonData)) {
				projPageMap.status = "失败";
				makeBizLog(projPageMap);
				return;
			}
			projPageMap.status = "成功";
			makeBizLog(projPageMap);
			console.log(jsonData)
			_commit();
		}
	});
	}
}	
//页面传参
function projPageHref(el) {
	var no = $(el).parent().find("[name='no']").val();
	var id = $(el).parent().find("[name='id']").val();
	var parentId = $(el).parent().find("[name='parentId']").val();
	if(parentId == 0){
		location.href = "/iw/_supply/projDetail.html?id=" + id + "&&no=" + no;
		return;
	}
		location.href = "/iw/_supply/subProjDetail.html?id=" + id + "&&no=" + no;
}

	

