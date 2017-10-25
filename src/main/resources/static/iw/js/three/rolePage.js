//弹出模态窗口
//$("#identifier').modal('show');
//$("#identifier').modal('hide');


/*
 * 新增丶修改角色方法
 */
function makeRole(){
		
	$("#detailForm").modal('hide');
	
	$.ajax({	
		type: "post",
		// @RequestMapping(value = "/makeRole/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/thhree/makeRole/map;id=0;name=张三;descr=市场管理员/sys;sid=2FUzudB5V8MX_8UVOiObe4
		url: apphost() + "/ils/three/makeRole/{map}/{sys}",        
		data: {
			"map": {"id": $$("id").value, "name": $$("name").value, "descr": $$("descr").value, "enabled": $$("enabled").value},
			"sys": {"token": $.cookie("token")}
		}, 
		async: false,
		martrix:true,
		dataType: "json",
		success: function (jsonData) {
			    if (!right(jsonData)) return;
			    console.log(jsonData);			
			    _commit();
		}
	});	
   
}
/*
 * 列表显示方法
 */
_commit();
function _commit(){
	$.ajax({ 
		type: "post", 
		 //@RequestMapping(value = "/allRole/{condition}/{sys}", produces = "text/plain")    
		//http://127.0.0.1:8888/ils/three/allRole/condition;enabled=;nameLike=%E7%AE%A1%E7%90%86%E5%91%98/sys;sid=2sEBnt-290w94E1ItjExqb
		url : apphost() + "/ils/three/allRole/{condition}/{sys}" ,
		data: {
			"condition": {"nameLike" : $$("roleName").value,"enabled" : ""},
			"sys": {"token": $.cookie("token")}
		},
		dataType : "json", 
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;			
			toView(jsonData,true);
			for (var i = 2 ; i <= jsonData.result.rolePage.length+1 ; i++){
				var name = $("#roleAll tr:eq("+2+") td:eq(1)").text();
				if(name == "审计管理员" || name == "安全管理员"||name == "系统管理员") {
					$($("#roleAll tr:eq("+i+")").find("button")[0]).css("display","none");  
					$($("#roleAll tr:eq("+i+")").find("button")[1]).css("display","none");  
					$($("#roleAll tr:eq("+i+")").find("button")[3]).css("display","none");  
				}
			}
		}
	});
}	
/*
 * 点击禁用按钮修改状态方法
 */
function modifyEnabled(el){
	var id= $(el).parent().parent().find("[name='id']").text();
	var enabled=$(el).parent().parent().find("td [id='enableds']").text();
	if (typeof(id) == "undefined" || id == 0 || id == "") {
		tip("未找到角色Id。");
		return;
}
	 if(enabled == "启用"){
		 var enabled=0;
	 } else{
		 var enabled=1;
	 }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/disOrEnablePerm/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/disOrEnableRole/map;id=1;enabled=0/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/three/disOrEnableRole/{map}/{sys}", 
		data:{			
			"map": {"id": id, "enabled": enabled},
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		martrix:true,
		dataType: "json",
		success: function (jsonData) {
			
			if (!right(jsonData)) return;
			console.log(jsonData);
			_commit();			
		}
	});
  }
/*
 * 指定ID渲染方法
 */
function roleDetail(el) {
	
	var id = $(el).parent().parent().find("[name='id']").text();
	
	if (typeof(id) == "undefined" || id == 0 || id == "") {
		tip("未找到角色Id。");
		return;
	}
	//@RequestMapping(value = "/role/{id}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/three/role/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	$.ajax({
		type: "post",
		url: apphost() + "/ils/three/role/{id}/{sys}", 		
		data:{			
			"id": id, 
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		martrix:true,
		dataType: "json",
		success: function (jsonData) {
			
			if (!right(jsonData)) return;
			
			toView(jsonData);			
		}
	});
}
/*
 * 指定ID渲染角色下面的用户信息
 */
function custsOfRole(el){
	/*$("tr[name='custsOfRoleTemplate']:visible").text("");*/
    var id = $(el).parent().parent().find("[name='id']").text();
	
	if (typeof(id) == "undefined" || id == 0 || id == "") {
		tip("未找到角色Id。");
		return;
	}
	
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/custsOfRole/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/custsOfRole/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41		
		url: apphost() + "/ils/three/custsOfRole/{id}/{sys}", 
		data:{
			"id": id,
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		dataType: "json",
		martrix:true,
		success: function (jsonData) {
			
			if (!right(jsonData)) return;
			
			toView(jsonData);			
		}
	
	});
	
}
var currRoleId = 0;
var currRoleName = "";
//角色添加权限  列表渲染
function rolePerms(el) {
	var grpPerms = {}; 
	var result = {};
	currRoleId = $(el).parent().parent().find("[name='id']").text();
	currRoleName = $(el).parent().parent().find("[name='name']").text();
	$("#currRoleName").text(currRoleName);
	$("div.aPermGrp").remove();
	//清理dialog
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/rolePerms/{roleId}/{sys}", produces = "text/plain")
		//http://localhost:81/ils/three/rolePerms/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/three/rolePerms/{roleId}/{sys}", 
		data:{
			"roleId": currRoleId,
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		dataType: "json",
		martrix:true,
		success: function (data) {
			if (!right(data)) return;
			// 分组，按照grpName（key）存放value （数组 perm）
			var perms = data.result.perms;
			if (perms.length == 0) return;
			for (var i = 0, perm; i < perms.length; i++) {
				perm = perms[i];
				// 作为checkbox的value使用。
				/*perm.idSelected = JSON.stringify({"id": perm.id, "selected": perm.selected});*/
				perm.idSelected = '{"id":' +  perm.id + ', "selected":' + perm.selected + "}";
				if (grpPerms[perm.grpName]) {// 如果已经含有该grpName，则直接添加该条perm到该grpName
					grpPerms[perm.grpName].push(perm);
				}	
				else // 如果没有，则创建，并把该条perm添加到该grpName中
					grpPerms[perm.grpName] = [perm];
				
			}
			
			//console.log(grpPerms);
			// 构造每个分组的列表模板，并渲染列表
			for (var grpName in grpPerms) {
				var template = $("#grpPermForClone").clone();
				template.attr("id", grpName);
				template.css("display", "block");
				template.addClass("aPermGrp");
				template.attr("name","");
				template.find("[name='grpName']").html(grpName);
				template.find("[name='xxx']").attr("name", grpName);
				template.find("[name='xxxTemplate']").attr("name", grpName + "Template");
				
				$("#grpPermForClone").parent().append(template);
				result = {"status": "succ"};
				result["result"] = {}
				result["result"][grpName] = grpPerms[grpName];
				toView(result);
			}
			console.log(result);
		}
	});
	
}

//修改当前角色的权限
function makeRolePerms(el) {
	var permIds = $("input[name='idSelected']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	console.log(permIds);
	
	if (permIds == "") permIds = 0;
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeRolePerms/{roleId}/{permIds}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/makeRolePerms/2/2,3,4/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/three/makeRolePerms/{roleId}/{permIds}/{sys}",
		data:{
			"roleId": currRoleId,
			"permIds": permIds,
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


