
//选择框移动
$("#rightBtn").click(function() {
	var selects = $("#leftSide option:selected");
	selects.clone().appendTo("#rightSide");
	selects.remove();
});
//选择框移动
$("#leftBtn").click(function() {
	var selects = $("#rightSide option:selected");
	selects.clone().appendTo("#leftSide");
	selects.remove();
});
//选择框移动所有
$("#rightAllBtn").click(function() {
	var selects = $("#leftSide option[value!='']");
	selects.clone().appendTo("#rightSide");
	selects.remove();
});
//选择框移动所有
$("#leftAllBtn").click(function() {
	var selects = $("#rightSide option");
	selects.clone().appendTo("#leftSide");
	selects.remove();
});
 


//列表
var roleName = "型号管理员";
//获取角色名
function namLikeValue(el) {
	roleName = $(el).text();
	_commit();
}
//用户列表
_commit();
function _commit() {
	$.ajax({
		type : "post",
		//	@RequestMapping(value = "/custPageByRole/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/admin/custPageByRole/condition;roleName=型号管理员;nameLike=张三/sys;offset=0;lim
		url: apphost() + "/ils/admin/custPageByRole/{condition}/{sys}",
		data: {
			"condition": {
				"roleName" : roleName,
				"nameLike" : $$("nameLike").value,
					},
			"sys": {
				"offset": $$("offset").value,
				"limit": $$("limit").value, 
				"sid": $.cookie("sid")}
		},
		async: false,
		martrix: true,
		dataType : "json",
		success : function(jsonData) {
			if (!right(jsonData)) return;
			$("#nameLike").val("");
			console.log(jsonData);
			toView(jsonData,true);
		}
	});
}

//当前用户可管理的型号权限
var custId = 0;
function hisRoles(el){
	 custId = $(el).parent().parent().find('input[name="custId"]').val();
	
	var selects = $("#rightSide option");
	selects.splice(0,1);
	if (selects.length > 0) selects.remove();
	selects = $("#leftSide option");
	selects.splice(0,1);
	if (selects.length > 0) selects.remove();
	$.ajax({
			type: "post",
			// @RequestMapping(value = "/hisModels/{custId}/{roleName}/{sys}", produces = "text/plain")
			// http://localhost:81/ils/three/hisRoles/1/型号管理员/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
			url: apphost() + "/ils/admin/hisModels/{custId}/{roleName}/{sys}",        
			data:{
				"custId": custId,
				"roleName": roleName,
				"sys":{"sid": $.cookie("sid")}
			},
			async: false,	
			martrix: true,
			dataType: "json",
			success: function (data) {
				if (!right(data)) return;
				console.log(data);
				var hisModels = data.result.hisModels;
				var otherModels = data.result.otherModels;
				$("#rightSide").html("");
				$("#leftSide").html("");
				for(var i = 0,hisRole,roleIds;i < hisModels.length; i++ ){
						hisRole = hisModels[i].name;
						roleIds = hisModels[i].id;
					var  template = "<option value=" + roleIds + ">" + hisRole + "</option>";
					$("#rightSide").append(template);
				}
				for(var i = 0,otherRole;i < otherModels.length; i++ ){
					 otherRole = otherModels[i].name;
					 otherRoleId = otherModels[i].id;
					var  template = "<option value=" + otherRoleId + ">" + otherRole + "</option>";
					$("#leftSide").append(template);
				}
			}
			
	});
}



//修改当前用户管理型号权限
function makeCustModels() {
	var modelIds = $("#rightSide option").map(function() {
		return $(this).val();
	}).get().join(",").replace(/^,/,"");
	
	console.log(modelIds);
	
	if (modelIds == "") modelIds = 0;
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeCustModels/{custId}/{modelIds}/{roleName}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/admin/makeCustModels/2/2,3,4/型号管理员/sys;sid=2FirU7AKR6VrA-AlT8gkxg
		url : apphost() + "/ils/admin/makeCustModels/{custId}/{modelIds}/{roleName}/{sys}",
		data:{
			"custId": custId,
			"modelIds": modelIds,
			"roleName": roleName,
			"sys":{"sid": $.cookie("sid")}
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
