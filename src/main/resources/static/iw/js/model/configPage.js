if (param("id")) {
	_configCommit();
} else{
	$("#configPageId").attr("name","myConfigPageTemplate");
	configAllPaginate();
	_configAllCommit();
}
//型号配置列表渲染
function _configAllCommit() {
	$.ajax({ 
    	type: "post", 
    	//RequestMapping(value = "/configPage/{condition}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/model/configPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/model/configPage/{condition}/{sys}",
    	data:{
    		"condition" :{
    			"nameLike": "",	
    		},
    		"sys": {"offset": $$("configOffset").value, "limit": $$("configLimit").value, "token": $.cookie("token")}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
    		console.log(jsonData);
    		for(var i = 0; i < jsonData.result.myConfigPage.length; i++) {
    			var newat = jsonData.result.myConfigPage[i].newat;
    			jsonData.result.myConfigPage[i].newat = toDate(newat);
    		}
    		toView(jsonData,true);
    	}
	});
}
//分页控件
function configAllPaginate() {
	if ($$("configPage-nav")) {
		$("#configPage-nav").pagination({
			items: $$("configTotal").value,
			itemsOnPage: $$("configLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("configOffset").value = $$("configLimit").value * (pageIndex - 1);
				_configAllCommit();
			}
		});
	}
}

//型号配置列表渲染
function _configCommit() {
	$.ajax({ 
    	type: "post", 
    	//@RequestMapping(value = "/configAllByModelId/{modelId}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/model/configAllByModelId/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/model/configAllByModelId/{modelId}/{sys}",
    	data:{
			"modelId": param("id"),	
			
			"sys": {
				"token": $.cookie("token")}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
    		console.log(jsonData);
    		for(var i = 0; i < jsonData.result.myConfigPage.length; i++) {
    			var newat = jsonData.result.myConfigPage[i].newat;
    			jsonData.result.myConfigPage[i].newat = toDate(newat);
    		}
    		toView(jsonData,true);
    	}
	});
}

$("#configNamed").text(param("name"));

$("#configName").text(param("name"));
//创建型号或修改型号
function makeConfig() {
	var mustChoosed; 
	if ( $("#mustChoosed:checked").val() != null) {
		mustChoosed = true;
	}else{
		mustChoosed = false;
	}
	
	var modelName = $$("modelName").value;
	if (modelName == null || modelName == "" || modelName== "undefined") {
		tip("请选择型号");
		return;
	}
	
	var name = $$("name").value;
	if (name == null || name == "" || name== "undefined") {
		tip("请填写型号配置名称!");
		return;
	}
	
	var forSaled; 
	if ( $("#forSaled:checked").val() != null) {
		forSaled = true;
	}else{
		forSaled = false;
	}
	var childrenSingled; 
	if ( $("#childrenSingled:checked").val() != null) {
		childrenSingled = true;
	}else{
		childrenSingled = false;
	}
	var typ = $("input[name='configDetail.typ']:checked").val();
	if ( typ == null || typ == "") {
		tip("请选择节点类型");
		return;
	}
	var status = $("input[name='configDetail.status']:checked").val();
	if ( status == null || status == "" || status == undefined) {
		tip("请选择状态");
		return;
	}
	var techStatus = $("input[name='configDetail.techStatus']:checked").val();
	if ( techStatus == null || techStatus == "" || techStatus == undefined) {
		tip("请选择技术状态标识");
		return;
	}
	var designOrgId = $$("orgId").value;
	/*if ( designOrgId == "" || designOrgId == 0) {
		tip("请选择设计机构");
		return;
	}*/
	/*if ( $$("modelId").value == "" || $$("modelId").value == 0 ) {
		tip("请选择设计机构");
		return;
	}*/
	$.ajax({
	    type : "post",
		//@RequestMapping(value = "/makeConfig/{map}/{sys}", produces = "text/plain")
	    // 节点如果为虚拟节点，则 下面几行隐含且传空值：单位， 数量，产品名称，产品代号，NSN，
	    // http://localhost:81/ils/model/makeConfig/map;id=0;modelId=;parentId=0;leafed=0;name=2401A型;typ=L-VCI;seqNo=1;sns=;techStatus=D;prodLibNo=;mustChoosed=1;forSaled=1;childrenSingled=0;status=有效;designOrgId=1;descr=阿斯顿发款卡萨丁;num=4;unit=个/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/model/makeConfig/{map}/{sys}",		        
		data:{
			"map": {
				"id": id,
				"modelId": $$("modelId").value,
				"name": $$("name").value,	
				"sns": $$("sns").value,			
				"descr": $$("descr").value,
				"typ": typ,
				"status": status,
				"mustChoosed": mustChoosed,
				"forSaled": forSaled,
				"childrenSingled": childrenSingled,
				"techStatus": techStatus,
				"designOrgId": designOrgId,
			},					
			"sys": {"token": $.cookie("token")}					
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			
			if(!right(jsonData)) return;
			console.log(jsonData);
			if(id == ""){
				tip("创建成功!");
			}else{
				tip("修改成功!");
			}
			reloadSecond();
			}
	});
}

//根据机构代码查询所属机构
function _commit() {
	var findCorpName = "";
	if ( $$("findCorpName").value != null &&  $$("findCorpName").value != "" ) {
		findCorpName = $$("findCorpName").value;
	}
	 
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/orgPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/orgPage/condition;status=正常;orgType=;code=00001;lvl=1;nameLike=浦东/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/org/orgPage/{condition}/{sys}" ,
		data: {
			"condition":{"status": "", "orgType": "", "code": "", "lvl": "", "nameLike": findCorpName},
			"sys": {"offset": $$("offset").value, "limit": $$("limit").value, "token": $.cookie("token")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			$("#findCorpName").val("");
			if (!right(jsonData)) return;
			toView(jsonData,true);
		}
	});
}


//机构选中列表赋值
function corpChoice() {
	var  v = $('input:radio:checked').parent().parent().find("td[id='name']").text();
	if (v == "" || v == null) tip("请选择机构名称")
	$("input[id='corpName']").val(v);
	s = $('input:radio:checked').parent().parent().find("td[id='id']").text();
	$("input[id='orgId']").val(s);
}

//页面传参
function href(el) {
	var id = $(el).parent().parent().find("input[name='id']").val();
	var name = $(el).parent().parent().find("input[name='name']").val();
	var modelId = $(el).parent().parent().find("input[name='modelId']").val();
	location.href = "/iw/model/bomDetail.html?parentId=" + id + "&&id=" + modelId + "&&name=" + name;
}
//数据变形
function mustChoosedValueTo(el,val) {
	if (val==0) { 
		valueToWithNoFunc(el, "否");
	}
	if (val==1) { 
		valueToWithNoFunc(el, "是");
	}
}
var id = "";
//型号配置详情
function configDetail(el) {
	id = $(el).parent().parent().find("input[name='id']").val();
	if (!id) return;
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/configDetail/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/corpPage/configDetail;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/model/configDetail/{id}/{sys}" ,
		data: {
			"id": id,
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			var childrenSingled = jsonData.result.configDetail.childrenSingled;
			var mustChoosed = jsonData.result.configDetail.mustChoosed;
			var forSaled = jsonData.result.configDetail.forSaled; 
			if (childrenSingled == 1) {
				$("[name='configDetail.childrenSingled']").attr("checked",true);
			}
			if (mustChoosed == 1) {
				$("[name='configDetail.mustChoosed']").attr("checked",true);
			}
			if (forSaled == 1) {
				$("[name='configDetail.forSaled']").attr("checked",true);
			}
			toView(jsonData,true);
		}
	});
}

//清空弹出框val
function emptyVal() {
	$("#nodeModal input[type='radio']:checked").prop("checked",false);
	$("#nodeModal input[type='text']").val("");
	$("#nodeModal textarea").val("");
	$("#nodeModal input[type='checkbox']").prop("checked",false);
}

function hrefbomPage(el) {
	var id = $(el).parent().parent().find("input[name='id']").val();
	var name = $(el).parent().parent().find("input[name='name']").val();
	var modelName = $(el).parent().parent().find("input[name='modelName']").val();
	location.href = "/iw/model/bomPage.html?id=" + id + "&&configName=" + name + "&&modelName=" + modelName;
}
//选择型号列表
function _modelCommit() {
    $.ajax({ 
    	type: "post", 
    	//http://localhost:81/ils/model/myModelPage/condition;codeLike=;techStatus=/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/model/myModelPage/{condition}/{sys}",
    	data:{
			"condition": { 
				"nameLike": $$("nameLike").value,
			},
			"sys": {
				"offset": $$("modelOffset").value,
				"limit": $$("modelLimit").value, 
				"token": $.cookie("token")}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
    		console.log(jsonData);
    		for(var i = 0; i < jsonData.result.myModelPage.length; i++) {
    			var projAt = jsonData.result.myModelPage[i].projAt;
    			var modeledAt = jsonData.result.myModelPage[i].modeledAt;
    			jsonData.result.myModelPage[i].projAt = toDate(projAt);
    			jsonData.result.myModelPage[i].modeledAt = toDate(modeledAt);
    		}
    		toView(jsonData,true);
    	}
	});
}
//型号列表分页控件
function modelPaginate() {
	if ($$("modelPage-nav")) {
		$("#modelPage-nav").pagination({
			items: $$("modelTotal").value,
			itemsOnPage: $$("modelLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("modelOffset").value = $$("modelLimit").value * (pageIndex - 1);

				_modelCommit();
			}
		});
	}
}
//型号列表选中赋值
function modelChoice() {
	var  v = $('input:radio:checked').parent().parent().find("span[name='name']").text();
	if (v == "" || v == null) tip("请选择型号名称");
	$("input[id='modelName']").val(v);
	
	s = $('input:radio:checked').parent().parent().find("span[name='id']").text();
	$("input[id='modelId']").val(s);
}

