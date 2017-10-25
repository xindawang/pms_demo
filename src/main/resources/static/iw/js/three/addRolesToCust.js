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
//根据用户idNo修改用户角色列表
var currCustId = 0;
function hisRolesByIdNo(){
	var idNo = $$("idNo").value;
	if(idNo.length != 18 ){
		tip("您输入号码格式不正确");
		return;
	}

	var selects = $("#rightSide option");
	selects.splice(0,1);
	if (selects.length > 0) selects.remove();
	
	selects = $("#leftSide option");
	selects.splice(0,1);
	if (selects.length > 0) selects.remove();
	
	$.ajax({
			type: "post",
			// http://localhost:81/ils/three/hisRolesByIdNo/230103197110206818/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
			url: apphost() + "/ils/three/hisRolesByIdNo/{idNo}/{sys}",        
			data:{
				"idNo": $$("idNo").value,
				"sys":{"token": $.cookie("token")}
			},
			async: false,	
			martrix: true,
			dataType: "json",
			success: function (jsonData) {
				if (!right(jsonData)) return;
				 console.log(jsonData)
				  $("#currCustName").text(jsonData.result.custName);
				  currCustId = jsonData.result.custId;
				  if(jsonData.result.otherRoles.length>0) $('#userRoleSetting').show();
				  if(jsonData.result.hisRoles.length>0) $('#userRoleSetting').show();
				  var hisRoles = jsonData.result.hisRoles;
					var otherRoles = jsonData.result.otherRoles;
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
function makeCustRoles(el) {
	var roleIds = $("#rightSide option").map(function() {
		return $(this).val();
	}).get().join(",").replace(/^,/,"");
	
	if (roleIds == "")  roleIds = 0;
	$.ajax({
		type : "post",
		// http://localhost:81/ils/three/makeCustRoles/2/2,3,4/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/three/makeCustRoles/{currCustId}/{roleIds}/{sys}",
		data:{
			"currCustId": currCustId,
			"roleIds": roleIds,
			"sys":{"token": $.cookie("token")}
		},
		
		dataType : "json",
		async : false,
		martrix: true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
		    window.location.reload();
		}
	});
}

