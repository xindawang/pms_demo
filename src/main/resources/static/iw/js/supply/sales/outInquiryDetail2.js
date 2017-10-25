//外部询价单id
var id = "0";
//创建外部询价单
function makeOutInquiry() {
	var materialTemplate = $("tr[name='materialTemplate']");
	var allFileName = "";
	for(var i = 1; curMaterTemp = materialTemplate[i]; i++) {
		var curMaterTempName = $($(curMaterTemp).find("input[name='name']")).val();
		allFileName = curMaterTempName + "," + allFileName; 
	}
	if(allFileName != "" && allFileName.length > 1) {
		allFileName = allFileName.substring(0, allFileName.length-1);
	}
	if(allFileName == "") 
		allFileName = 1;
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeOutInquiry/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeOutInquiry/map;id=0;contractId=;inquiryNum=;typ=出口;currency=;deliveryAt=;deliveryAddr=;deliveryWay=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/makeOutInquiry/{map}/{materialStr}/{sys}",
		data : {
			"map": {
				"id": id,
				"contractId": param("contractId"),
				"inquiryNum": $$("inquiryNum").value,
				"typ": "出口",
				"currency": $$("currency").value,
				"deliveryAt": $$("deliveryAt").value,
				"deliveryAddr": $$("deliveryAddr").value,
				"deliveryWay": $$("deliveryWay").value
			},
			"materialStr":allFileName,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData)
			id = jsonData.result.inquiry.id;
			toView(jsonData, true);
		}
	});
}

//产品库创建外部询价单
function prodLibmakeOutInquiry() {
	var materialTemplate = $("tr[name='materialTemplate']");
	var allFileName = "";
	for(var i = 1; curMaterTemp = materialTemplate[i]; i++) {
		var curMaterTempName = $($(curMaterTemp).find("input[name='name']")).val();
		allFileName = curMaterTempName + "," + allFileName; 
	}
	if(allFileName != "" && allFileName.length > 1) {
		allFileName = allFileName.substring(0, allFileName.length-1);
	}
	if(allFileName == "") 
		allFileName = 1;
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/prodLibmakeOutInquiry/{map}/{materialStr}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/prodLibmakeOutInquiry/map;id=0;contractId=;inquiryNum=;typ=出口;currency=;deliveryAt=;deliveryAddr=;deliveryWay=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/prodLibmakeOutInquiry/{map}/{materialStr}/{sys}",
		data : {
			"map": {
				"id": id,
				"contractId": param("contractId"),
				"inquiryNum": $$("inquiryNum").value,
				"typ": "出口",
				"currency": $$("currency").value,
				"deliveryAt": $$("deliveryAt").value,
				"deliveryAddr": $$("deliveryAddr").value,
				"deliveryWay": $$("deliveryWay").value
			},
			"materialStr":allFileName,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData)
			id = jsonData.result.inquiry.id;
			toView(jsonData, true);
		}
	});
}

var curSaleProposalId, prodLibNo, num;
function closeOutInquiry() {
	prodLibNo = "";
	
	curSaleProposalId = $($("#selectAdviceModal").find("input[type='radio']:checked")).next().val();
	if(curSaleProposalId == null)
		curSaleProposalId = "";

	num = $($($("#selectAdviceModal").find("input[type='radio']:checked"))).parent().parent().find("input[name='num']").val();
	makeInquiryProd();
}

function closeProdLib() {
	curSaleProposalId = "";
	
	prodLibNo = $($("#productModal").find("input[type='radio']:checked")).next().val();
	
	if(prodLibNo == null)
		prodLibNo = "";
	
	num = $($($("#productModal").find("input[type='radio']:checked"))).parent().parent().find("input[name='num']").val();
	
	makeInquiryProd();
}

//添加询价产品
function makeInquiryProd() {

	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeInquiryProd/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeInquiryProd/map;outInquiryId=0;proposalId=;prodLibNo=;num=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/makeInquiryProd/{map}/{sys}",
		data : {
			"map": {
				"outInquiryId": id,
				"proposalId": curSaleProposalId,
				"prodLibNo": prodLibNo,
				"num": num,
			},
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData)
			var configChildren = [];
			var InquiryProdPage = [];
			for(var i = 0; curInquiryProd = jsonData.result.InquiryProds[i]; i++) {
				if(curInquiryProd.configName == null || curInquiryProd.configName == "" ) 
					InquiryProdPage.push(curInquiryProd);
				else 
					configChildren.push(curInquiryProd);
			}
			
			$("tbody[name='configChildrenTemplate']:visible").remove();
			
			for(var i = 0; curProposalId = configChildren[i]; i++) {
				var configChildrenTemplate = $($("tbody[name='configChildrenTemplate']")[0]).clone();
				configChildrenTemplate.find("tr").attr("name", "detail" + i + "Template");
				configChildrenTemplate.removeAttr("style");
				$($("tbody[name='configChildrenTemplate']")[0]).after(configChildrenTemplate);
				var thisRootConfigId = curProposalId.rootConfigId;
				proposal(thisRootConfigId, i);
			}
			
			jsonData.result.InquiryProdPage = InquiryProdPage;
			toView(jsonData, true);
		}
	});
}

/*双击配套表操作*/
//获得当前点击html元素 并进行操作
var treeIndent = "<span class='tree-indent'></span>";
//型号建议详情
function proposal(thisRootConfigId, curChildDetailNum) {
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/saleProposalDetail/{configId}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/saleProposalDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/model/saleProposalDetail/{configId}/{sys}",
		data:{
			"configId": thisRootConfigId,
			"sys": {"token": $.cookie("token")}
	    },
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			var myDataArr = [];
			for(var i = 0;dataArrItem = jsonData.result.children[i]; i++){
				if(dataArrItem.parentId == 0){
					myDataArr.push(dataArrItem);
				}
			}
			var idArr = [];
			for(var i = 0;dataArrItem = jsonData.result.children[i]; i++){
				idArr.push(dataArrItem.id);
			}
			idArr.sort(function(a, b){
				return a - b;
			});
			for(var j = 0; idNum = idArr[j]; j++){
				for(var i = 0; dataArrItem = jsonData.result.children[i]; i++){
					if(idNum == dataArrItem.parentId){
						myDataArr.splice(idNum, 0, dataArrItem);
					}
				}
			}
			
			var data = {};
			data.result = {};
			data.status = "succ";
			data.dual = "";
			data.result["detail" + curChildDetailNum] = myDataArr;
			console.log(data, "------------------")
			toView(data)
			
		}
	});
}

//分配业务员
function _commit() {
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/custPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/custPage/condition;nameLike=;roleName=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/custPage/{condition}/{sys}",
		data : {
			"condition": {
				"nameLike": "",
				"roleName": "业务员"
			},
			"sys" : {
				"offset" : $$("offset").value,
				"limit" : $$("limit").value,
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData, "546413213")
			toView(jsonData, true);
		}
	});
}

//询价单分配业务员
function assignSaler() {
	salerId = $($("#salesmanModal").find("input[type='radio']:checked")).next().val();
	inquiryProdCheck= $($("#productTree").find("input[type='checkbox']:checked")).next();
	
	var inquiryProdIdStr = "";
	
	for(var i = 0; curInquiry = inquiryProdCheck[i]; i++) {
		inquiryProdId = $(curInquiry).val();
		inquiryProdIdStr += inquiryProdId + ",";
	}
	
	if(inquiryProdIdStr.length > 2)
		inquiryProdIdStr = inquiryProdIdStr.substring(0, inquiryProdIdStr.length-1)
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/assignsaler/{inquiryId}/{salerId}/{inquiryProdIdStr}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/assignSaler/1/1/1,2/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/assignSaler/{inquiryId}/{salerId}/{inquiryProdIdStr}/{sys}",
		data : {
			"inquiryId": id,
			"salerId": salerId,
			"inquiryProdIdStr": inquiryProdIdStr,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData)
			var configChildren = [];
			var InquiryProdPage = [];
			for(var i = 0; curInquiryProd = jsonData.result.InquiryProds[i]; i++) {
				if(curInquiryProd.configName == null || curInquiryProd.configName == "" ) 
					InquiryProdPage.push(curInquiryProd);
				else 
					configChildren.push(curInquiryProd);
			}
			
			for(var i = 0; curProposalId = configChildren[i]; i++) {
				proposal(curProposalId.proposalId);
			}
			
			jsonData.result.InquiryProdPage = InquiryProdPage;
			toView(jsonData, true);
		}
	});
}

//删除询价单产品
var isConfigOrPord, inquiryProdId;
function delConfigPord(el) {
	isConfigOrPord = 0;
	delInquiryPord(el);
}

function delPordPage(el) {
	isConfigOrPord = 1;
	delInquiryPord(el);
}

function delInquiryPord(el) {
	inquiryProdId = $($(el).find("input[name='id']")).val();
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/delInquiryPord/{inquiryProdId}{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/delInquiryPord/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/delInquiryPord/{inquiryProdId}/{sys}",
		data : {
			"inquiryProdId": inquiryProdId,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData)
			tip("删除成功！");
			if(isConfigOrPord == 1)
				$(el).parent().parent().remove();
			else 
				$(el).parent().parent().parent().remove();
		}
	});
}

//删除业务员询价单产品
function delInquiryPordBySalerId(el) {
	aSalerId = $($(el).find("input[name='aSalerId']")).val();
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/delInquiryPordBySalerId/{salerId}{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/delInquiryPordBySalerId/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/delInquiryPordBySalerId/{salerId}/{sys}",
		data : {
			"salerId": aSalerId,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData)
			tip("删除成功！");
			$(el).parent().parent().remove();
		}
	});
}

function outRootConfigIdValueTo(el, val) {
	$(el).parent().parent().parent().attr("data-id", val);
	
	valueToWithNoFunc(el, val);
}

function saveOutInquiry() {
	var id, num, aSalerId;
	var allConfigChildrenTemplate = $("tbody[name='configChildrenTemplate']")
	//循环对根节点 调用修改产品接口
	for(var i = 1; curOneConChildTemp = allConfigChildrenTemplate[i]; i++) {
		curConChildTemp = $($(curOneConChildTemp).children()[0]);
		
		id = $(curConChildTemp.find("input[name='id']")).val();
		num = $(curConChildTemp.find("input[name='num']")).val();
		aSalerId = $(curConChildTemp.find("input[name='aSalerId']")).val();
		modifyInquiryProd(id, num, aSalerId);
	}
	//循环对产品 调用修改产品接口
	var allInquiryPageTemp = $("tr[name='InquiryProdPageTemplate']")
	for(var i = 1; curInquiryPageTemp = allInquiryPageTemp[i]; i++) {
		id = $($(curInquiryPageTemp).find("input[name='id']")).val();
		num = $($(curInquiryPageTemp).find("input[name='num']")).val();
		aSalerId = $($(curInquiryPageTemp).find("input[name='aSalerId']")).val();
		modifyInquiryProd(id, num, aSalerId);
	}
	//循环对子节点 调用修改产品接口
	
	for(var i = 1; curOneConChildTemp = allConfigChildrenTemplate[i]; i++) {
		curConChildTemp = $($(curOneConChildTemp).children()[0]);
							  
		var proposalId = $(curConChildTemp.find("input[name='proposalId']")).val();
		var detail = [];
		for(var j = 1; curOneChildConChildTemp = $(curOneConChildTemp).children()[j]; j++) {
			curChildConChildTemp = $(curOneChildConChildTemp);
			
			var detailMap = {};
			detailMap.configId = $(curChildConChildTemp.find("input[name='id']")).val();
			detailMap.num = $(curChildConChildTemp.find("input[name='num']")).val();
			detail.push(detailMap);
		}
		modifyProposalDetail(proposalId,detail);
	}
	
}

//修改询价产品
function modifyInquiryProd(id, num, aSalerId) {
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/modifyInquiryProd/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeInquiryProd/map;id=0;num=0;aSalerId=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/modifyInquiryProd/{map}/{sys}",
		data : {
			"map": {
				"id": id,
				"num": num,
				"aSalerId": aSalerId
			},
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData)
		}
	});
}

//修改询价产品
function modifyProposalDetail(proposalId,detail) {
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/modifyProposalDetail/{proposalId}/{detail}/{sys}", produces = "text/plain")
        // http://localhost:81/ils/model/modifyProposalDetail/1/[{"configId":"1", "num":"2", "descr":"asd"}, {"configId":"2", "num":"3", "descr":"qwe"}]/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/modifyProposalDetail/{proposalId}/{detail}/{sys}",
		data : {
			"proposalId": proposalId,
			"detail": JSON.stringify(detail),
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData)
			tip("保存成功!")
		}
	});
}

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
		url : "/ils/supply/makeMaterial/map;projId=" + param("projId") + ";bizNo=" + bizNo + ";typ=问题资料;descr=" + $("#showDescr").val() + "/sys;token=" + $.cookie("token"),
		secureuri: false,
		fileElementId: 'file',
		dataType : "text",
		success : function(data, status) {
			data = JSON.parse(data.replaceAll("<pre.[^>]*>|</pre>",""))
			var materialTemplate = $($("tr[name='materialTemplate']")[0]).clone();
			console.log(data)
			var fileOrigName= data.result.material.origName;
			var fileName= data.result.material.name;
			var fileId= data.result.material.id;
			var fileDescr= data.result.material.descr;
			$(materialTemplate.find("span[name='origName']")).text(fileOrigName);
			$(materialTemplate.find("input[name='name']")).val(fileName);
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

function salesIdValueTo(el, val) {
	$(el).parent().parent().attr("data-id", val);
	valueToWithNoFunc(el,val)
}

function salesParentIdValueTo(el, val) {
	$(el).parent().parent().attr("data-parent", val);
	valueToWithNoFunc(el,val)
}

function salesLvlValueTo(el, val) {
	for(var i = 0; i < val; i++) {
		$(el).parent().prepend(treeIndent);
	}
	if(val != 0) {
		$($(el).parent().parent().parent().find("button")).remove();
		$($(el).parent().parent().prev().find("input[type='checkbox']")).remove();
	}
	
	valueToWithNoFunc(el,val)
}

function salesLeafedValueTo(el, val) {
	if(val == 1) {
		$(el).prev().attr("class", "tree-icon tree-file");
		$(el).prev().prev().remove();
	}
	valueToWithNoFunc(el,val)
}















