function callback() {
	contractDetail();
}	

$("#myproj li").click(function() {
	var hrefVal = $($(this).find("a")).attr("href");
	
	if(hrefVal == "#basic") {
		
	}else if(hrefVal == "#inquiry") {
		inquiryPage();
		inquiryPaginate();
		
	}else if(hrefVal == "#salebill") {
		
	}else if(hrefVal == "#innerContract") {
		innerContractCommit();
		innerContractPaginate();
	}else if(hrefVal == "#supplybill") {
		
	}else if(hrefVal == "#plan") {
		
	}
})

//详情渲染
function contractDetail() {
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/contractDetail/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/contractDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/contractDetail/{id}/{sys}",
		data : {
			"id": param("id"),
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
			
			   //数据拆分
			   //项目基本资料
			   var proDetail = {};
			   proDetail.status = "succ";
			   proDetail.result = {};
			   proDetail.result.projDetail = jsonData.result.proj;
			   proDetail.result.dual = "";
			   right(proDetail);  
			  // console.log(proDetail);	 
			   toView(proDetail);
			   var signAt = jsonData.result.contract.signAt;
			   jsonData.result.contract.signAt = toDate(signAt);
			   
			   var effectAt = jsonData.result.contract.effectAt;
			   jsonData.result.contract.effectAt = toDate(effectAt);
			   console.log(jsonData);
			   //出口合同基本资料详情
			   toView(jsonData);
			   contractId =  jsonData.result.contract.id;
			   contractName =  jsonData.result.contract.name;
			   $("#contractId").text(jsonData.result.contract.contractNum);
			   $("#contractName").text(contractName);
				
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
var abc = "{'status':'succ', 'result':{'material': {'bizNo':'0jOZO9lJZ4nW5gA-Lu1StF','corpId':2,'createrId':78,'descr':'','extName':'.xls','id':31,'name':'20170613981600902090.xls','newat':null,'no':'3z7WcobepdWrEV8U1NJGTY','origName':'exportexcel (1).xls','projId':15,'typ':'出口合同资料','upat':null} }}"
	//新增文件
	var url, questionNo, bizNo;

	function makeMaterial() {
		if(param("questionNo") != "") {
			bizNo = param("questionNo");
		}else {
			bizNo = "";
		}
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
				var fileId= data.result.material.id;
				var fileDescr= data.result.material.descr;
				$(materialTemplate.find("span[name='origName']")).text(fileName);
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
	
	for (var j = 0; j < $("[name='myModelTemplate']").length ; j++) {
		if ( $("[name='clone'] [name='id']").eq(j).val() == id ) {
			tip("不能指定相同的型号");
			return;
		}
	}
	i++;
	var clone =
		"<tr name='modelTemplate'>" +
		"<input  name='id' value="+id+" type='hidden'/>" +
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


//修改出口合同
function makeContract() {
	var modelId="";
	var materialStr = "";
	//循环取页面modelIds
	for (var i = 1; i < $("[name='modelTemplate']").length ;i++) {
		alert($("input[name='id']").eq(i).val());
		id = $("input[name='id']").eq(i).val();
		 modelId += id + ","
		var modelIds = modelId.substring(0,modelId.length-1);
	}
	if (modelIds == "" || modelIds == null || modelIds == undefined) {
		tip("请选择关联型号！！")
	}
	var materialStrname = 1;
	//循环取页面materialStr
	for (var i = 1; i < $("[name='materialTemplate']").length ;i++) {
		var origName = $("input[name='name']").eq(i).val();
		materialStr += origName + ","
		 materialStrname = materialStr.substring(0,materialStr.length-1);
	}
	
	if (materialStrname == "" || materialStrname == null || materialStrname == undefined) {
		tip("请上传合同附件！！")
	}
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeContract/{map}/{materialStr}/{sys}", produces = "text/plain")
		 //出口合同       
		// http://localhost:81/ils/supply/makeContract/map;id=0;projId=1;contractNo=;name=;cate=出口合同;typ=;corpId=;managerId=;aParty=;aManager=;phone=;fax=;email=;signAt=;signer=;signAddr=;supplyPrice=;salePrice=;descr=;modelIds=;income=;grossProfit=;effectAt=;effectDescr=;executeCycle=;executeDescr=;prepayRate=/name.doc,name.doc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/makeContract/{map}/{materialStr}/{sys}",
		data : {
			"map" : {
				"id" : param("id"),
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
				"modelIds": modelIds,
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
		}
	});
}

function goToOutInquiryDetail() {
	location.href='outInquiryDetail.html?contractId=' + param("id") + "&&projId=" + param("projId"); 
}


//合同签订
function signContract() {
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/signContract/{map}{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/signContract/map;id=0;signAt=;signer=;signAddr=;effectAt=;executeCycle=;prepayRate=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/signContract/{map}/{sys}",
		data : {
			"map" : {
				"id" : contractId,
				"signAt": $$("signAts").value,
				"signer" : $$("signers").value,
				"signAddr": $$("signAddrs").value,
				"effectAt" : $$("effectAts").value,
				"executeCycle" : $$("executeCycles").value,
				"prepayRate" : $$("prepayRates").value
			},
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
			tip("创建成功");
		}
	});
}

//外部询价单列表
function inquiryPage() {
	$.ajax({
	    type : "post",
	    // @RequestMapping(value = "/inquiryPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/inquiryPage/condition;projId=;contractId=;typ=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/inquiryPage/{condition}/{sys}",		        
		data:{
			"condition": { 
				"projId": param("projId"),
				"contractId": param("id"),
				"typ": ""
			},
			"sys": {
				"offset": $$("inquiryOffset").value,
				"limit": $$("inquiryLimit").value, 
				"token": $.cookie("token")
			}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   toView(jsonData, true);
			   console.log(jsonData, "=============")
		}
	});
}

function inquiryPaginate() {
	if ($$("inquiryPage-nav")) {
		$("#inquiryPage-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("inquiryLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("inquiryOffset").value = $$("inquiryLimit").value * (pageIndex - 1);

				inquiryPage();
			}
		});
	}
}

function innerContractDetail(){
	window.location.href = "/iw/supply/sales/innerContractDetail.html?id=" + param("id") + "&&projId=" + param("projId");
}


//项目经理列表
function _custPageCommit() {
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

				_custPageCommit();
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

//内部合同列表
function innerContractCommit(){
	$.ajax({
		type : "post",
		//@OrgAuthen( PERM = true, name = "内部合同列表")
		//@ResponseBody
		//@RequestMapping(value = "/innerContractPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/innerContractPage/condition;projId=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/innerContractPage/{condition}/{sys}",
	  	data:{
				"condition": { 
					"outContractId": param("id"),
				},
				"sys": {
					"offset": $$("innerContractOffset").value,
					"limit": $$("innerContractLimit").value, 
					"token": $.cookie("token")}
	  	},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			   console.log(jsonData);	
			   toView(jsonData,true);
		}
	});
}
//内部合同列表分页控件
function innerContractPaginate() {
	if ($$("innerContractPage-nav")) {
		$("#innerContractPage-nav").pagination({
			items: $$("innerContractTotal").value,
			itemsOnPage: $$("innerContractLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("innerContractOffset").value = $$("innerContractLimit").value * (pageIndex - 1);

				innerContractCommit();
			}
		});
	}
}


//内部报价单列表
function allInnerQuote() {
	$.ajax({
	    type : "post",
	    //     @OrgAuthen( PERM = true, name = "内部报价单列表")        @ResponseBody
        //@RequestMapping(value = "/allInnerQuote/{contractId}/{sys}", produces = "text/plain")
        // http://localhost:81/ils/supply/allInnerQuote/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/allInnerQuote/{contractId}/{sys}",		        
		data:{
			"contractId": param("id"),
			"sys": {
				"token": $.cookie("token")
			}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			for(var i = 0; i < jsonData.result.allInnerQuote.length; i++) {
    			var newat = jsonData.result.allInnerQuote[i].newat
    			jsonData.result.allInnerQuote[i].newat = toDate(newat);
    		}
			   toView(jsonData, true);
		}
	});
}
