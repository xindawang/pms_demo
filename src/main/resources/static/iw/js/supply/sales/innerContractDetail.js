function callback() {
	contractDetail();
}	

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
			   toView(proDetail);
//			   var signAt = jsonData.result.contract.signAt;
//			   jsonData.result.contract.signAt = toDate(signAt);
			   
//			   var effectAt = jsonData.result.contract.effectAt;
//			   jsonData.result.contract.effectAt = toDate(effectAt);
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

function makeInnerContract(){
	var materialStr = "";
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
	
	console.log(materialStrname);
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeInnerContract/{map}/{materialStr}/{sys}", produces = "text/plain")
		//内部合同
		 // http://localhost:81/ils/supply/makeInnerContract/map;id=0;projId=1;outContractId=;contractNum=;name=;cate=内部合同;typ=;managerId=;amanagerId=/name.doc,name.doc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/makeInnerContract/{map}/{materialStr}/{sys}",
		data : {
			"map" : {
				id: 0,
				projId: param("projId"),
				outContractId: param("id"),
				contractNum: $$("contractNum").value,
				name: $$("name").value,
				cate: "内部合同",
				typ: $$("typ").value,
				managerId: $$("managerId").value,
				amanagerId: $.cookie("custId"),
				descr: $$("descr").value
				
			},
			"materialStr": materialStrname,
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
			   tip("添加成功");
			   backSecond();
			   $("input[id='managerId']").val("");
			   $("input[id='managerName']").val("");
			   
		}
	});
	
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

function chooseCust(){
	
		var id = $('input:radio:checked').parent().parent().find("[id='custId']").val();
		$("input[id='managerId']").val(id);
		var name = $('input:radio:checked').parent().parent().find("[id='name']").text();
		$("input[id='managerName']").val(name);

}


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
		url : "/ils/supply/makeMaterial/map;projId=" + param("projId") + ";typ=内部合同资料;descr=" + $("#showDescr").val() + "/sys;token=" + $.cookie("token"),
		secureuri: false,
		fileElementId: 'file',
		dataType : "text",
		success : function(data, status) {
			data = JSON.parse(data.replaceAll("<pre.[^>]*>|</pre>",""))
			var materialTemplate = $($("tr[name='materialTemplate']")[0]).clone();
			console.log(data)
			var name= data.result.material.name;
			var fileName= data.result.material.origName;
			var fileId= data.result.material.id;
			var fileDescr= data.result.material.descr;
			$(materialTemplate.find("span[name='origName']")).text(fileName);
			$(materialTemplate.find("input[name='id']")).val(fileId);
			$(materialTemplate.find("span[name='descr']")).text(fileDescr);
			$(materialTemplate.find("input[name='name']")).val(name);
			materialTemplate.removeAttr("style"); 
			$("#appendMaterialTemplate").append(materialTemplate)
		}
	});
	
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

