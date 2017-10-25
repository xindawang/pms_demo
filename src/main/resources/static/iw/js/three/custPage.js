/** 用户参与角色  开始 */

$("#rightBtn").click(function() {
	var selects = $("#leftSide option:selected");
	selects.clone().appendTo("#rightSide");
	selects.remove();
});

$("#leftBtn").click(function() {
	var selects = $("#rightSide option:selected");
	selects.clone().appendTo("#leftSide");
	selects.remove();
});

$("#rightAllBtn").click(function() {
	var selects = $("#leftSide option[value!='']");
	selects.clone().appendTo("#rightSide");
	selects.remove();
});

$("#leftAllBtn").click(function() {
	var selects = $("#rightSide option");
	selects.clone().appendTo("#leftSide");
	selects.remove();
});
 
/** 用户参与角色  结束 */

function add() {
	location.href="/iw/three/custDetail.html";
}

//检查当前用户的角色
var currCustId = 0;
var currCustName = "";
function hisRoles(el) {
	currCustId = $(el).parent().parent().find("[name='id']").val();

	currCustName = $(el).parent().parent().find("[name='name']").text();
	
	$("#currCustName").text(currCustName);

	// 清理右边选择框
	var selects = $("#rightSide option");
	selects.splice(0,1);
	if (selects.length > 0) selects.remove();
	
	selects = $("#leftSide option");
	selects.splice(0,1);
	if (selects.length > 0) selects.remove();
	
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/hisRoles/{custId}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/hisRoles/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/three/hisRoles/{custId}/{sys}",
		data: {
			"custId": currCustId,
			"sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (data) {
			if (!right(data)) return;
			console.log(data);
			var hisRoles = data.result.hisRoles;
			var otherRoles = data.result.otherRoles;
			$("#rightSide").html("");
			$("#leftSide").html("");
			for(var i = 0,hisRole,roleIds;i < hisRoles.length; i++ ){
					hisRole = hisRoles[i].name;
					roleIds = hisRoles[i].id;
					if(hisRole == "审计管理员" || hisRole == "安全管理员" || hisRole == "系统管理员") continue;
				var  template = "<option value=" + roleIds + ">" + hisRole + "</option>";
				$("#rightSide").append(template);
			}
			for(var i = 0,otherRole;i < otherRoles.length; i++ ){
				 otherRole = otherRoles[i].name;
				 otherRoleId = otherRoles[i].id;
				 if(otherRole == "审计管理员" || otherRole == "安全管理员" || otherRole == "系统管理员") continue;				
				var  template = "<option value=" + otherRoleId + ">" + otherRole + "</option>";
				$("#leftSide").append(template);
			}
		}
	});
}

//修改当前用户的角色
function makeCustRoles() {
	var roleIds = $("#rightSide option").map(function() {
		return $(this).val();
	}).get().join(",").replace(/^,/,"");
	
	console.log(roleIds);
	
	if (roleIds == "") roleIds = 0;
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeCustRoles/{custId}/{roleIds}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/makeCustRoles/2/2,3,4/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/three/makeCustRoles/{custId}/{roleIds}/{sys}",
		data:{
			"custId": currCustId,
			"roleIds": roleIds,
			"sys":{"token": $.cookie("token")}
		},
		dataType : "json",
		async : false,
		martrix:true,
		success : function(jsonData) {

			if (!right(jsonData)) return;

			console.log(jsonData);

			window.location.reload();
		}
	});
}
/*
 * 列表显示
 */
_commit();
function _commit() {
	
	var scretLvl = $("input[name='custScretLvl']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	var status = $("input[name='custStatus']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/custPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/custPage/condition;
		url : apphost() + "/ils/three/custPage/{condition}/{sys}",
		data:{
			"condition": {
				"nameLike": $$("custName").value, 
				"status": status,
				"scretLvl": scretLvl},
				
	        "sys": {"offset": $$("offset").value,
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
		}
	});
}	
/*
 * 去当前选中行ID传参
 */
function cust(el,val) {
    var id = $(el).parent().parent().find("[name='id']").val();
    location.href = "/iw/three/custDetail.html?id=" + id;
}
//重置密码
function resetPass(el){
	var idNo = $(el).parent().parent().find("[name='idNo']").text();
	$.ajax({ 
		type: "post", 
		 //@RequestMapping(value = "/resetPass/{idNo}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/resetPass/230103197110206819/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/three/resetPass/{idNo}/{sys}",
		data:{
			"idNo": idNo, 				
	        "sys": {"token": $.cookie("token")}	        		    		    
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
		}
	});
}


