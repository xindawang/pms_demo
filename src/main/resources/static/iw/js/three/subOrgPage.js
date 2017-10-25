$(document).ready(function() {
	$("#subOrgDiv").autocomplete();
});

// 三元列表
orgThreeDetail();
_commit();
function _commit() {
	if (!param("id")) return;
	$.ajax({
		type : "post",
		// @RequestMapping(value = "/custByCorpIdPage/{condition}/{sys}",
		// produces = "text/plain")
		// http://localhost:81/ils/three/custByCorpIdPage/condition;corpId=1;idNoLike=232301199310316915;nameLike=张天宇/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/three/custByCorpIdPage/{condition}/{sys}",
		data : {
			"condition" : {
				"corpId" : param("id"),
				"idNoLike" : $$("idNoLike").value,
				"nameLike" : $$("nameLike").value
			},
			"sys" : {
				"offset" : $$("offset").value,
				"limit" : $$("limit").value,
				"token": $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))
				return;
			console.log(jsonData);
			toView(jsonData, true);
		}
	});
}
// 设置三元
function makeThreeCustRoles() {
	if (!param("id")) return;
			$.ajax({
				type : "post",
				// @RequestMapping(value =
				// "/makeThreeCustRoles/{corpId}/{sysCustId}/{secuCustId}/{aduitCustId}/{sys}",
				// produces = "text/plain")
				// http://localhost:81/ils/three/makeThreeCustRoles/1/2/3/4/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
				url : apphost()
						+ "/ils/three/makeThreeCustRoles/{corpId}/{sysCustId}/{secuCustId}/{aduitCustId}/{sys}",
				data : {
					"corpId" : param("id"),
					"sysCustId" : $$("sysCustId").value,
					"secuCustId" : $$("secuCustId").value,
					"aduitCustId" : $$("aduitCustId").value,
					"sys" : {
						"token": $.cookie("token")
					}
				},
				async : false,
				martrix : true,
				dataType : "json",
				success : function(jsonData) {
					if (!right(jsonData)) return;
/*					if ($("input[id='system']").val()==$("input[id='manager']").val() || $("input[id='system']").val()==$("input[id='logName']").val() || $("input[id='manager']").val()==$("input[id='logName']").val()) tip("三员角色不可重复，请重新选择！！！！") 
*/					console.log(jsonData);
					 location.href="/iw/three/orgPage.html"; 
				}
			});
}
// 详情

function orgThreeDetail() {
	if (!param("id")) return;
	$.ajax({
		type : "post",
		// @RequestMapping(value = "/orgThreeDetail/{corpId}/{sys}", produces =
		// "text/plain")
		// http://localhost:81/ils/three/orgThreeDetail/10/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/three/orgThreeDetail/{corpId}/{sys}",
		data : {
			"corpId" : param("id"),
			"sys" : {
				"token": $.cookie("token")
			}
		},
		async : false,
		martrix : true,
		dataType : "json",
		success : function(jsonData) {
			if (!right(jsonData))return;
			var corp = {"result" : {"corp" : jsonData.result.corp[0]}}

			
			toView(corp);
			toView(jsonData);
		}

	});
}
var custThree;
function isChoice(el){
	if (el.id=="itemSelectSpan1") custThree=1;		 
	if (el.id=="itemSelectSpan2") custThree=2;
	if (el.id=="itemSelectSpan3") custThree=3;
}
// input框赋值
function choice(el) {
		
	var name = $('input:radio:checked').parent().parent().find("td[id='name']").text();
	var id = $('input:radio:checked').parent().parent().find("td[id='id']").text();
	if (custThree == 1) {
		$("input[id='sysCustName']").val(name);
		$("input[id='sysCustId']").val(id);		
	}
	if (custThree == 2) {
		$("input[id='secuCustName']").val(name);
		$("input[id='secuCustId']").val(id);
	};
	if (custThree == 3) {
		$("input[id='aduitCustName']").val(name);
		$("input[id='aduitCustId']").val(id);
	}
	
}

function sysCustIdValueTo(el, value) {
	var threeRole = value.split(",");
	var cust = threeRole[0];
	if ("系统管理员" == threeRole[0].split(":")[0]){
		value = cust.replace("系统管理员:", "").split("|")[0];
	}else if("系统管理员" == threeRole[1].split(":")[0]){
		value = cust.replace("系统管理员:", "").split("|")[0];
	}else{
		value = cust.replace("系统管理员:", "").split("|")[0];
	}	
	valueToWithNoFunc(el, value);
}

function sysCustNameValueTo(el, value) {
	var threeRole = value.split(",");
	var cust = threeRole[0];
	if ("系统管理员" == threeRole[0].split(":")[0]){
		var custId = cust.replace("系统管理员:", "").split("|")[0];
		value = cust.replace("系统管理员:" + custId + "|", "");
	}else if("系统管理员" == threeRole[1].split(":")[0]){
		var custId = cust.replace("系统管理员:", "").split("|")[0];
		value = cust.replace("系统管理员:" + custId + "|", "");
	}else{
		var custId = cust.replace("系统管理员:", "").split("|")[0];
		value = cust.replace("系统管理员:" + custId + "|", "");
	}	
	valueToWithNoFunc(el, value);
}

function secuCustIdValueTo(el, value) {
	var threeRole = value.split(",");
	var cust = threeRole[1];
	if ("审计管理员" == threeRole[0].split(":")[0]){
		value = cust.replace("审计管理员:", "").split("|")[0];
	}else if("审计管理员" == threeRole[1].split(":")[0]){
		value = cust.replace("审计管理员:", "").split("|")[0];
	}else{
		value = cust.replace("审计管理员:", "").split("|")[0];
	}		
	valueToWithNoFunc(el, value);
}

function secuCustNameValueTo(el, value) {
	var threeRole = value.split(",");
	var cust = threeRole[1];
	if ("审计管理员" == threeRole[0].split(":")[0]){
		var custId = cust.replace("审计管理员:", "").split("|")[0];
		value = cust.replace("审计管理员:" + custId + "|", "");
	}else if("审计管理员" == threeRole[1].split(":")[0]){
		var custId = cust.replace("审计管理员:", "").split("|")[0];
		value = cust.replace("审计管理员:" + custId + "|", "");
	}else{
		var custId = cust.replace("审计管理员:", "").split("|")[0];
		value = cust.replace("审计管理员:" + custId + "|", "");
	}	
	valueToWithNoFunc(el, value);
}

function aduitCustIdValueTo(el, value) {
	var threeRole = value.split(",");
	var cust = threeRole[2];
	
	if ("安全管理员" == threeRole[0].split(":")[0]){
		value = cust.replace("安全管理员:", "").split("|")[0];
	}else if("安全管理员" == threeRole[1].split(":")[0]){
		value = cust.replace("安全管理员:", "").split("|")[0];
	}else{
		value = cust.replace("安全管理员:", "").split("|")[0];
	}		
	valueToWithNoFunc(el, value);
}

function aduitCustNameValueTo(el, value) {
	var threeRole = value.split(",");
	var cust = threeRole[2];
	if ("安全管理员" == threeRole[0].split(":")[0]){
		var custId = cust.replace("安全管理员:", "").split("|")[0];
		value = cust.replace("安全管理员:" + custId + "|", "");
	}else if("安全管理员" == threeRole[1].split(":")[0]){
		var custId = cust.replace("安全管理员:", "").split("|")[0];
		value = cust.replace("安全管理员:" + custId + "|", "");
	}else{
		var custId = cust.replace("安全管理员:", "").split("|")[0];
		value = cust.replace("安全管理员:" + custId + "|", "");
	}	
	valueToWithNoFunc(el, value);
}




