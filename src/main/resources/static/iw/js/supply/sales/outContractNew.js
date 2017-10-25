function callback() {
	projDetail();
}	

//详情渲染
function projDetail() {
	$.ajax({
		type : "post",
		// 	RequestMapping(value = "/projDetail/{projNo}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/projDetail/asfaswesadfasfsdd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/projDetail/{projNo}/{sys}",
		data : {
			"projNo": param("projId") ,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData);
			toView(jsonData, true);
		}
	});
}

//详情渲染
function projDetail() {
	$.ajax({
		type : "post",
		// 	RequestMapping(value = "/projDetail/{projNo}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/projDetail/asfaswesadfasfsdd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/projDetail/{projNo}/{sys}",
		data : {
			"projNo": param("projId") ,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData);
			toView(jsonData, true);
		}
	});
}

//型号管理列表
function _commit() {
  $.ajax({ 
  	type: "post", 
  	//http://localhost:81/ils/model/myModelPage/condition;codeLike=;techStatus=/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
  	url : apphost() + "/ils/model/myModelPage/{condition}/{sys}",
  	data:{
			"condition": { 
				"nameLike": $$("nameLike").value
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
  			toView(jsonData,true);
  	}
	});
}

//型号分页控件
function modelPaginate() {
	if ($$("modelPage-nav")) {
		$("#modelPage-nav").pagination({
			items: $$("modelTotal").value,
			itemsOnPage: $$("modelLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("modelOffset").value = $$("modelLimit").value * (pageIndex - 1);

				_commit();
			}
		});
	}
}
var abc = "{'status':'succ', 'result':{'material': {'bizNo':'0jOZO9lJZ4nW5gA-Lu1StF','corpId':2,'createrId':78,'descr':'','extName':'.xls','id':31,'name':'20170613981600902090.xls','newat':null,'no':'3z7WcobepdWrEV8U1NJGTY','origName':'exportexcel (1).xls','projId':15,'typ':'问题资料','upat':null} }}"
	//新增文件
	var url, questionNo, bizNo;

function makeMaterial() {
	if(param("questionNo") != "") 
		bizNo = param("questionNo");
	else 
		bizNo = "";
	myAjaxFileUpload();
	}

function myAjaxFileUpload() {
		$.ajaxFileUpload({
			url : "/ils/supply/makeMaterial/map;projId=" + param("projId") + ";bizNo=" + bizNo + ";typ=出口合同资料;descr=" + $("#showDescr").val() + "/sys;token=" + $.cookie("token"),
			secureuri: false,
			fileElementId: 'file',
			dataType : "text",
			success : function(data, status) {
				data = JSON.parse(data.replaceAll("<pre.[^>]*>|</pre>",""))
				var materialTemplate = $($("tr[name='materialTemplate']")[0]).clone();
				console.log(data)
				var fileName= data.result.material.origName;
				var name= data.result.material.name;
				var fileId= data.result.material.id;
				var fileDescr= data.result.material.descr;
				$(materialTemplate.find("span[name='origName']")).text(fileName);
				$(materialTemplate.find("input[name='name']")).val(name);
				$(materialTemplate.find("input[name='id']")).val(fileId);
				$(materialTemplate.find("span[name='descr']")).text(fileDescr);
				materialTemplate.removeAttr("style"); 
				$("#appendMaterialTemplate").append(materialTemplate)
			}
		});
}

//下载资料
function downMaterial(el) {
	var curFileId = $($(el).find("input[name='id']")).val();
	//http://localhost:81/ils/supply/downMaterial/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	location.href = apphost() + "/ils/supply/downMaterial/" + curFileId + "/sys;token=" + $.cookie("token");
}

//删除资料
function delMaterial(el) {
	var id = $($(el).find("input[name='id']")).val();
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/delMaterial/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/delMaterial/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/delMaterial/{id}/{sys}",		        
		data:{
			"id": id,
			"sys": {"token": $.cookie("token")}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			$(el).parent().parent().remove();
		}
	});
}

//增加关联型号
var modelId = "";
var i = 0 ;
function modelChoice() {
	var id = $('input:radio:checked').parent().parent().find("input[name='id']").val();
	var name = $('input:radio:checked').parent().parent().find("td[name='name']").text();
	if (id == "" || id == null || id == undefined) return;
	if (name == "" || name == null || name == undefined) return;
	
	for (var j = 0; j < $("[name='modelTemplate']").length ; j++) {
		if ( $("[name='clone'] [name='id']").eq(j).val() == id ) {
			tip("不能指定相同的型号");
			return;
		} 
	}
	i++;
	var clone =
		"<tr name='modelTemplate'>" +
		"<input name='id' type='hidden' value= "+ id +" />" +
		"<td>" + i + "</td>"+
		"<td>" + name + "</td>" +				
		"<td><button type='button' class='btn btn-danger' onclick='deleteModel(this)'>" +
			"<span class='icon-remove'></span> 删除</button>" +
		"</td></tr>";
	
	$("[name=clone]").append(clone);
}

//删除关联型号
function deleteModel(el) {
	if(confirm("确认要删除此行记录？")){
	$(el).parent().parent().remove();
	}
}

//创建出口合同
function makeContract() {
	var modelId="";
	var materialStr = "";
	var modelIds = "";
	//循环取页面modelIds
	for (var i = 1; i < $("[name='clone'] [name='modelTemplate']").length ;i++) {
		var id = $("input[name='id']").eq(i).val();
		modelId += id + ",";
		modelIds = modelId.substring(0,modelId.length-1);
	}
	/*if (modelIds == "" || modelIds == null || modelIds == undefined) {
		tip("请选择关联型号！！")
	}*/
	//循环取页面materialStr
	var materialStrname = 1;
	for (var i = 1; i < $("[name='materialTemplate']").length ;i++) {
		var origName = $("input[name='name']").eq(i).val();
		materialStr += origName + ",";
		materialStrname = materialStr.substring(0,materialStr.length-1);
	}
	if (materialStrname == "" || materialStrname == null || materialStrname == undefined) {
		tip("请上传合同附件！！")
	}
	$.ajax({
		type : "post",
		//出口合同
		// http://localhost:81/ils/supply/makeContract/map;id=0;projId=1;contractNum=;name=;cate=出口合同;typ=;corpId=;managerId=;aParty=;aManager=;phone=;fax=;email=;descr=/
		//name.doc,name.doc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41	
		url : apphost() + "/ils/supply/makeContract/{map}/{materialStr}/{sys}",
		data : {
			"map" : {
				"id" : "",
				"projId": param("projId"),
				"contractNum" : $$("contractNum").value,
				"name": $$("name").value,
				"cate" : "出口合同",
				"typ" : $$("typ").value,
				"corpId" : "",
				"managerId": $$("managerId").value,
				"aParty": $$("aParty").value,
				"aManager": $$("aManager").value,
				"phone": $$("phone").value,
				"fax": $$("fax").value,
				"email": $$("email").value,
				"descr": $$("descr").value,
				"modelIds": modelIds
			},
			"materialStr": materialStrname,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData);
			tip("创建成功")
			backSecond();
		}
	});
}
//项目经理列表
function _custCommit() {
	$.ajax({
		type : "post",
		// @RequestMapping(value = "/custPage/{condition}/{sys}",
		// produces = "text/plain")
		// http://localhost:81/ils/org/custPage/condition;nameLike=;roleName=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/custPage/{condition}/{sys}",
		data : {
			"condition" : {
				"nameLike" : $$("nameLike").value,
				"roleName": "项目经理"
			},
			"sys" : {
				"offset" : $$("custOffset").value,
				"limit" : $$("custLimit").value,
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))
				return;
			toView(jsonData, true);
		}
	});

}

function custPaginate() {
	if ($$("custPage-nav")) {
		$("#custPage-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("custOffset").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("custOffset").value = $$("custLimit").value * (pageIndex - 1);

				_custCommit();
			}
		});
	}
}

//选中按钮取值
function chooseCust() {
	var managerId = $('input:radio:checked').parent().parent().find("input[name='custId']").val();
	var name = $('input:radio:checked').parent().parent().find("td[id='name']").text();
	$("#managerId").val(managerId);
	$("#managerName").val(name);

}