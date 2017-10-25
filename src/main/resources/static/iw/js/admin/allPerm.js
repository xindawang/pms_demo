//列表
_commit();
function _commit() {
	$.ajax({
		type : "post",
		// @RequestMapping(value = "/allPerm/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/admin/allPerm/condition;enabled=1;nameLike=列表;grpNameLike=用户;actionLike=Page;domainLike=UserController/sys;sid=2FirU7AKR6VrA-AlT8gkxg
		url: apphost() + "/ils/admin/allPerm/{condition}/{sys}",
		data: {
			//"map": {"loginName": $$("loginName").value, "corpCode": $$("corpCode").value, "pass": $$("pass").value, "chkcode": $$("chkcode").value, "sid": $.cookie("sid")},
			"condition": {"nameLike": $$("nameLike").value, "domainLike": $$("domainLike").value, "actionLike": $$("actionLike").value, "grpNameLike": $$("grpNameLike").value},
			"sys": { "sid": $.cookie("sid")}
		},
		async: false,
		martrix: true,
		dataType : "json",
		success : function(jsonData) {
			if (!right(jsonData)) return;
			$("tr[name='allPermTemplate']:visible").remove();
			console.log(jsonData);
			toView(jsonData);
		}
	});
}

//重置搜索条件
function reset(){
	$(".form-group input").val("");
	_commit();
}
//清空input输入框
function clean(){
	$("form input").val("");
}

//修改  添加
function makePerm(el) {
	if( $$("name").value.length = null || $$("name").value.length < 2 || $$("name").value.length > 10 ){
		$$("name").focus();
		tip("名称不能为空，且字符长度为2~10之间");
		return;
	}
	if( $$("domain").value.length = null || $$("domain").value.length < 2 || $$("domain").value.length > 15 ){
		$$("domain").focus();
		tip("领域不能为空，且字符长度为2~15之间");
		return;
	}
	if( $$("grpName").value.length = null || $$("grpName").value.length < 2 || $$("grpName").value.length > 10 ){
		$$("grpName").focus();
		tip("组名不能为空，且字符长度为2~10之间");
		return;
	}

	if( $$("descr").value.length = null ){
		$$("descr").focus();
		tip("描述长度不能超多33个字符");
		return;
	}
	var id = $(el).parent().parent().find("div [id='id']").val();
	var enabled = $(el).parent().parent().find("div [id='enableds']").val();
	if( id == null || id == 0 || id == "" ){
		id = -1;
	}else{
		id = id;
	}
	$.ajax({
		
		type : "post",
		// @RequestMapping(value = "/makePerm/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/admin/makePerm/map;id=0;corpId=1001;name=张三;descr=市场管理员;enabled=1;newat=2016-10-10;upat=2016-10-15;enabled=0/sys;sid=2FirU7AKR6VrA-AlT8gkxg
		url: apphost() + "/ils/admin/makePerm/{map}/{sys}",
		data : {
			"map": {"id": id, "name": $$("name").value, "domain": $$("domain").value , "grpName": $$("grpName").value , "action" : $$("action").value, "descr":  $$("descr").value , "enabled": enabled },
			"sys": {"sid": $.cookie("sid")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success : function(jsonData) {
			if(!right(jsonData)) return;
			console.log(jsonData);
			$("#detailForm").modal("hide");
			_commit();
		}
	});
}
//根据ID修改数据 展示
function findPerm(el) {
	$(".modal-dialog  input").val("");
	var id = $(el).parent().parent().find("td [name='id']").text();
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/findPerm/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/admin/findPerm/map;id=1;/sys;sid=2FirU7AKR6VrA-AlT8gkxg
		url: apphost() + "/ils/admin/findPerm/{map}/{sys}",
		data : {
			"map": {"id": id},
			"sys": {"sid": $.cookie("sid")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success : function(jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData);
		}
	});
}

// 禁用  启用
function disOrEnablePerm(el) {
	var id = $(el).parent().parent().find("td [name='id']").text();
	var enabled = $(el).parent().parent().find("td [id='enabled']").text();
	if ( typeof(id) == "undefined" || id == 0 || id == "" ) {
		tip("未找到角色Id。");
		return;
	}
	if( enabled == "启用" ){
		var enabled = 0;
	}else{
	 	var enabled = 1;
	}
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/disOrEnablePerm/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/admin/disOrEnablePerm/map;id=1;enabled=0/sys;sid=2FirU7AKR6VrA-AlT8gkxg
		url: apphost() + "/ils/admin/disOrEnablePerm/{map}/{sys}",
		data : {
			"map": {"id": id, "enabled": enabled},
			"sys": {"sid": $.cookie("sid")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success : function(jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			_commit();
		}
	});
}

