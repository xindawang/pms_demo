_suppContCommit();
_contCommit();
//供应合同列表
function _suppContCommit(){
	var suppCont = [];
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/newContract/{projId}/{typ}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/newContract/1/供应合同/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/newContract/{projId}/{typ}/{sys}",
		data:{
			  "projId": param("id"),
			  "typ": "供应合同",			
			  "sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (data) {
			if (!right(data)) return;
			data.result.suppCont = data.result.contract; 
			console.log(data);
			toView(data,true);
		}
	});
}

//采购合同列表
function _contCommit(){
	var cont = [];
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/newContract/{projId}/{typ}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/newContract/1/供应合同/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/newContract/{projId}/{typ}/{sys}",
		data:{
				"projId": param("id"),
				"typ": "采购合同",
				"sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (data) {
			if (!right(data)) return;
			data.result.cont = data.result.contract; 
			console.log(data);
			toView(data,true);
		}
	});
}

function projSuppContHref(el) {
	var id = $(el).parent().find("input[name='id']").val();
	location.href = "/iw/_supply/subSuppContDetail.html?id=" + id ;
}

function projContHref(el) {
	var id = $(el).parent().find("input[name='id']").val();
	location.href = "/iw/_supply/subContDetail.html?id=" + id ;
}



projDetail();
var parentStatus, subInvtStatus, parentId, corpId, subCorpId, aCorpId, scretLvl, disctSalePrice,aManagerName,managerName,corpName,aCorpName,aManagerId;

function projDetail(){
	if (!param("no")) return;
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/projDetail/{projNo}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/projDetail/asfaswesadfasfsdd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/projDetail/{projNo}/{sys}",
		data:{
			"projNo": param("no"),
				
	        "sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
		
			if(parentId > 0)
				$(".showOrHideTheSecondCorp").hide();
			
			projId = jsonData.result.projDetail.id;
			aManagerName = jsonData.result.projDetail.aManagerName;
			managerName = jsonData.result.projDetail.managerName;
			corpName = jsonData.result.projDetail.corpName;
			aCorpName = jsonData.result.projDetail.aCorpName;
			aCorpId = jsonData.result.projDetail.aCorpId;
			corpId = jsonData.result.projDetail.corpId;
			aManagerId = jsonData.result.projDetail.aManagerId;
			managerId = jsonData.result.projDetail.managerId;
			toView(jsonData,true);			
			
			
		}
	});
}

function makeSubProject() {
	var scretLvl = $('input[name="projDetail.scretLvl"]:checked').val();
	if(param("no") == "" || param("no") == null || param("no") == undefined){
		param("no","");		
	}
	if(param("id") == "" || param("id") == null || param("id") == undefined){
		param("id","");
	}
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/makeProj/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeProj/map;id=0;parentId=0;name=;shortName=;managerId=;scretLvl=;aCorpId=;zip=;aManagerId=;tel=;fax=;addr=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/newMakeProj/{condition}/{sys}",
		data:{
			"condition": {
				"no": param("no"),
				"id": param("id"),
				"name":$$("name").value,
				"shortName":$$("shortName").value,
				"aCorpId": $$("aCorpId").value,
				"corpId": $.cookie("corpId"),
				"aManagerId":$$("aManagerId").value,
				"managerId":$$("managerId").value,
				"zip":$$("zip").value,
				"scretLvl":scretLvl,
				"tel":$$("tel").value,
				"addr":$$("addr").value,
				"fax":$$("fax").value
				},			
	        "sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (data) {
			var reqParams = {
					name: $$("name").value,
					scretLvl:scretLvl,
					aCorpId: $$("aCorpId").value,
					corpId: $.cookie("corpId")
				}
			var subProjDetailMap = {};
			subProjDetailMap.opName = "修改子项目";
			subProjDetailMap.reqParams = JSON.stringify(reqParams);
			subProjDetailMap.domain = "supply";
			subProjDetailMap.action = "newMakeProj";
			subProjDetailMap.reqURI = "subProjDetail.html";
			if (!right(data)) {
				subProjDetailMap.status = "失败";
				makeBizLog(subProjDetailMap);
				return;
			}
			subProjDetailMap.status = "成功";
			makeBizLog(subProjDetailMap);
			console.log(data);
			location.href = "/iw/supply/projPage.html";
		}
		
		
	});
}

function make() {
	var type = "供应合同";
	location.href = "/iw/_supply/newSuppCont.html?corpId="+ corpId + "&&aCorpId=" + aCorpId + "&&typ=" + type + "&&aCorpName=" + aCorpName + "&&corpName=" + corpName + "&&projId=" + projId + "&&no=" + param("no");
}

function makeContract() {
	var type = "采购合同";
	location.href = "/iw/_supply/newCont.html?corpId=" + corpId + "&&typ=" + type + "&&corpName=" + corpName + "&&managerName=" + managerName + "&&projId=" + projId + "&&managerId=" + managerId + "&&no=" + param("no");	
}

