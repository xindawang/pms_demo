function delConfig(el){
	var id = $("input[name='id']:checked").map(function() {
		return $(this).attr("value");
		})
	if(confirm("你确定要删除吗")){
		id = $(el).parent().parent().find("input[name='id']").val();
		$.ajax({
			type: "post",
			//@RequestMapping(value = "/delConfig/{parentId}/{ids}/{sys}", produces = "text/plain")
			// http://localhost:81/ils/config/delConfig/1/2,3,4/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
			url: apphost() + "/ils/model/delConfig/{parentId}/{ids}/{sys}" ,
			data: {
				"ids": id,
				"parentId" : param("parentId"),
				"sys": {"token": $.cookie("token")}
			},
			async: false,
			martrix: true,
			dataType: "json",
			success: function (jsonData) {
				if (!right(jsonData)) return;
				tip("删除成功");
				window.location.reload();
			}
		});
	}
}

//是否删除配置
function delConfigCheck(){
	
	var id = $("input[name='id']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/, "");
	
	if(confirm("你确定要删除吗")){
		$.ajax({
			type: "post",
			//@RequestMapping(value = "/delConfig/{parentId}/{ids}/{sys}", produces = "text/plain")
			// http://localhost:81/ils/config/delConfig/1/2,3,4/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
			url: apphost() + "/ils/model/delConfig/{parentId}/{ids}/{sys}" ,
			data: {
				"ids": id,
				"parentId" : param("parentId"),
				"sys": {"token": $.cookie("token")}
			},
			async: false,
			martrix: true,
			dataType: "json",
			success: function (jsonData) {
				if (!right(jsonData)) return;
				tip("删除成功");
				window.location.reload();
			}
		});
	}
}
//删除所有
function delAllConfigCheck(){
	
	var ids = $("input[name='id']").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/, "");
	
	if(confirm("你确定要删除吗")){
		$.ajax({
			type: "post",
			//@RequestMapping(value = "/delConfig/{parentId}/{ids}/{sys}", produces = "text/plain")
			// http://localhost:81/ils/config/delConfig/1/2,3,4/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
			url: apphost() + "/ils/model/delConfig/{parentId}/{ids}/{sys}" ,
			data: {
				"ids": ids,
				"parentId" : param("parentId"),
				"sys": {"token": $.cookie("token")}
			},
			async: false,
			martrix: true,
			dataType: "json",
			success: function (jsonData) {
				if (!right(jsonData)) return;
				tip("删除成功");
				window.location.reload();
			}
		});
	}
}

	$("input[name='configDetail.typ']").on("change",function(){
		var value = $(this).val();
		if(value == '产品'){
			$("#product-tr").show();
		}else{
			$("#product-tr").hide();
		}
	});

configChildren();
//下级节点列表
function configChildren() {
	$.ajax({
		type: "post",
		//	@RequestMapping(value = "/configChildren/{parentId}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/configChildren/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/model/configChildren/{id}/{sys}" ,
		data: {
			"id": param("parentId"),
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			for (var i = 0; i <jsonData.result.children.length; i++) {
				var upat = jsonData.result.children[i].upat.toDate();
				jsonData.result.children[i].upat = upat;
				if(jsonData.result.children[i].lvl == 0){
					jsonData.result.children.splice(i,i+1);
				}
			}
			$("[name=bomName]").text(param("name"));
			toView(jsonData);
		}
	});
}
//修改下级节点信息
var configId = "";
function configDetail(el) {
	var unit = [];
	configId = $(el).parent().parent().find("input[name='id']").val();
	$.ajax({
		type: "post",
		//	@RequestMapping(value = "/configDetail/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/corpPage/configDetail;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/model/configDetail/{id}/{sys}" ,
		data: {
			"id": configId,
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			for(var i = 0; i < $($('#unit').find("input[name='unit']")).length ; i++){
				unit = $($('#unit').find("input[name='unit']")[i]).val();
				if(unit == jsonData.result.configDetail.unit){
					$($('#unit').find("input[name='unit']")[i]).attr("checked","checked");
					$('input[name="custom"]').val("");
					break;
				}else{
					$($('#unit').find("input[value='自定义']")).attr("checked","checked");
					$('input[name="custom"]').val(jsonData.result.configDetail.unit);
				}
			}
			if(jsonData.result.configDetail.typ == '产品')
				$("#product-tr").show();
			else
				$("#product-tr").hide();
			if(jsonData.result.configDetail.mustChoosed == '1')
				$("#mustChoosed").prop("checked",true);
			if(jsonData.result.configDetail.forSaled == '1')
				$("#forSaled").prop("checked",true);	
			if(jsonData.result.configDetail.childrenSingled == '1')
				$("#childrenSingled").prop("checked",true);
			toView(jsonData);
		}
	});
}

//创建型号或修改型号
function makeConfig() {
	var mustChoosed; 
	var forSaled; 
	var childrenSingled; 
	var status = $("input[name='configDetail.status']:checked").val();
	var typ = $("input[name='configDetail.typ']:checked").val();
	var designOrgId = $$("orgId").value;
	var unit = $("input[name='unit']:checked").val();
	
	if(unit == "自定义"){
		unit = $('input[name="custom"]').val();
	}
	
	if(unit == undefined || unit == null){
		unit = "";
	}
	
	if(typ != "产品"){
		unit = "";
	}
	
	if ( $("#mustChoosed:checked").val() != null) {
		mustChoosed = true;
	}else{
		mustChoosed = false;
	}
	
	if ( $("#forSaled:checked").val() != null) {
		forSaled = true;
	}else{
		forSaled = false;
	}
	
	if ( $("#childrenSingled:checked").val() != null) {
		childrenSingled = true;
	}else{
		childrenSingled = false;
	}
	
	if ($("#name").val() == "" || $("#name").val() == null || $("#name").val() == undefined) {
		tip("请选择节点名称");
		return;
	}
	
	if ( typ == undefined || typ == "" || typ == null) {
		tip("请选择节点类型");
		return;
	}
	
	if ( status == undefined || status == "" || status == null) {
		tip("请选择状态");
		return;
	}
	
	if ( designOrgId == "" || designOrgId == null || designOrgId == undefined) {
		tip("请选择设计机构");
		return;
	}
	
	if ( $$("seqNo").value == "") {
		tip("请输入顺序号");
		return;
	}
	
	$.ajax({
	    type : "post",
		//@RequestMapping(value = "/makeConfig/{map}/{sys}", produces = "text/plain")
	    // 节点如果为虚拟节点，则 下面几行隐含且传空值：单位， 数量，产品名称，产品代号，NSN，
	    // http://localhost:81/ils/model/makeConfig/map;id=0;modelId=;parentId=0;leafed=0;name=2401A型;typ=L-VCI;seqNo=1;sns=;techStatus=D;prodLibNo=;mustChoosed=1;forSaled=1;childrenSingled=0;status=有效;designOrgId=1;descr=阿斯顿发款卡萨丁;num=4;unit=个/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/model/makeConfig/{map}/{sys}",		        
		data:{
			"map": {
				"id": configId,
				"parentId": param("parentId"),
				"name": $$("name").value,	
				"modelId": param("id"),
				"sns": $$("sns").value,			
				"descr": $$("descr").value,
				"typ": typ,
				"status": status,
				"unit": unit,
				"seqNo": $$("seqNo").value,
				"mustChoosed": mustChoosed,
				"forSaled": forSaled,
				"childrenSingled": childrenSingled,
				"designOrgId": designOrgId,
				"techStatus": "NULL",
				"prodLibNo": $$("prodLibNo").value
			},					
			"sys": {"token": $.cookie("token")}					
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if(!right(jsonData)) return;
			if(configId ==""){
				tip("创建成功");
			}else{
				tip("修改成功");
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
			if (!right(jsonData)) return;
			toView(jsonData,true);
			$("#findCorpName").val("");
		}
	});
}


//机构选中列表赋值
function corpChoice() {
	var  v = $('input:radio:checked').parent().parent().find("td[id='corpNames']").text();
	$("input[id='corpName']").val(v);
	s = $('input:radio:checked').parent().parent().find("td[id='corpId']").text();
	$("input[id='orgId']").val(s);
}

//控制分页控件
function prodLibPaginate() {
	if ($$("prodLibPage-nav")) {
		$("#prodLibPage-nav").pagination({
			items: $$("prodLibTotal").value,
			itemsOnPage: $$("prodLibLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("prodLibOffset").value = $$("prodLibLimit").value * (pageIndex - 1);
				_prodLibCommit();
			}
		});
	}
}

//产品列表
function _prodLibCommit() {
	 $.ajax({ 
	    	type: "post", 
	    	//@RequestMapping(value = "/prodLibPage/{condition}/{sys}", produces = "text/plain")
	    	// http://localhost:81/ils/prodLib/prodLibPage/condition;nameLike=;scretLvl=公开,秘密;status=初始,已报价/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	    	url : apphost() + "/ils/model/prodLibPage/{condition}/{sys}",
	    	data:{
				"condition": { 
					"name": "",
					"scretLvl": "",
					"status": ""
				},
				"sys": {
					"offset": $$("prodLibOffset").value,
					"limit": $$("prodLibLimit").value, 
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

//产品选中列表赋值
function prodLibChoice() {
	var  prodLibName = $('input:radio:checked').parent().parent().find("td[id='prodLibNames']").text();
	$("input[id='prodLibName']").val(prodLibName);
	prodLibNo = $('input:radio:checked').parent().parent().find("td[id='prodLibNos']").text();
	$("input[id='prodLibNo']").val(prodLibNo);
	
	nsn = $('input:radio:checked').parent().parent().find("span[name='nsn']").text();
	$("input[id='nsn']").val(nsn);
	
	prodCode = $('input:radio:checked').parent().parent().find("span[name='prodCode']").text();
	$("input[id='prodCode']").val(prodCode);
	
}
function bomDetail(el) {
	var  id = $(el).parent().parent().find("input[name='id']").val();
	var  name = $(el).parent().parent().find("td[name='name']").text();
	location.href="bomDetail.html?parentId=" + id +"&&id=" + param("id")+"&&name=" + name;
}

//清空弹出框val
function emptyVal() {
	$("#nodeModal input[type='radio']:checked").prop("checked",false);
	$("#nodeModal input[type='text']").val("");
	$("#nodeModal textarea").val("");
	$("#nodeModal input[type='checkbox']").prop("checked",false);
}