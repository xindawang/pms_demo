readyToOuyQuote();

//待生成外部报价单
function readyToOuyQuote() {
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/readyToOuyQuote/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/readyToOuyQuote/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/readyToOuyQuote/{id}/{sys}",
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
			toView(jsonData);
		}
	});
}

var innerQuoteIdStr = "";
//内部报价单生成产品清单
function prodsByInnerQuote() {
	twoSecondCount();
	innerQuoteIdStr = "";
	//所有选择的内部报价单
	var allCheckedInQuoteTemp = $($("tr[name='innerQuotesTemplate']").find("input[type='checkbox']:checked")).parent().parent();
	for(var i = 0; curCheckedInQuoteTemp = allCheckedInQuoteTemp[i]; i++) {
		var curInnerQuoteId = $(curCheckedInQuoteTemp).find("input[name='id']").val();
		innerQuoteIdStr = curInnerQuoteId + "," + innerQuoteIdStr;
	}
	if(innerQuoteIdStr != "") {
		innerQuoteIdStr = innerQuoteIdStr.substring(0,innerQuoteIdStr.length - 1)
	}else {
		tip("请选择内部报价单");
		return;
	}
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/prodsByInnerQuote/{innerQuoteIdStr}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/prodsByInnerQuote/1,2/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/prodsByInnerQuote/{innerQuoteIdStr}/{sys}",
		data : {
			"innerQuoteIdStr": innerQuoteIdStr,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			var configChildren = [];
			var InquiryProdPage = [];
			for(var i = 0; curInquiryProd = jsonData.result.outInquiryProds[i]; i++) {
				if(curInquiryProd.configName == null || curInquiryProd.configName == "" ) 
					InquiryProdPage.push(curInquiryProd);
				else 
					configChildren.push(curInquiryProd);
			}
			
			for(var i = 0; addNumTemp = configChildren[i]; i++) {
				addNumTemp.numTemp = i;
			}

			jsonData.result.configChildren = configChildren;
			jsonData.result.InquiryProdPage = InquiryProdPage;
			console.log(jsonData, "-----------------------------");
			
			toView(jsonData, true);
		}
	});
}

function curSupplyPriceValueTo(el, val) {
	var curRatio = $("#curRatio").val();
	var totalPrice = curRatio * val / 100;
	$(el).next().children().text(totalPrice);
	valueToWithNoFunc(el, val);
}

function twoSecondCount() {
	setTimeout(function() {
		var allVisiTr = $("#productTree").find("tbody tr:visible")
		var curRatio = $$("curRatio").value;
		var totalSupplyPrice = 0, totalTotalPrice = 0;
		for(var i = 0; curVisiTr = allVisiTr[i]; i++) {
			var supplyPrice = $($(curVisiTr).find("td[name='supplyPrice']")).text();
			var totalPrice = supplyPrice * curRatio / 100;
			$($(curVisiTr).find("span[name='totalPrice']")).text(totalPrice);
			
			totalSupplyPrice = parseFloat(totalSupplyPrice) + parseFloat(supplyPrice);
			totalTotalPrice = parseFloat(totalTotalPrice) + parseFloat(totalPrice);
		}
		$("#totalSupplyPrice").text(totalSupplyPrice);
		$("#totalTotalPrice").text(totalTotalPrice);
	},100)
}

function changeTotalPrice() {
	var allVisiTr = $("#productTree").find("tbody tr:visible")
	var curRatio = $$("curRatio").value;
	var totalSupplyPrice = 0, totalTotalPrice = 0;
	for(var i = 0; curVisiTr = allVisiTr[i]; i++) {
		var supplyPrice = $($(curVisiTr).find("td[name='supplyPrice']")).text();
		var totalPrice = supplyPrice * curRatio / 100;
		$($(curVisiTr).find("span[name='totalPrice']")).text(totalPrice);
		
		totalSupplyPrice = parseFloat(totalSupplyPrice) + parseFloat(supplyPrice);
		totalTotalPrice = parseFloat(totalTotalPrice) + parseFloat(totalPrice);
	}
	$("#totalSupplyPrice").text(totalSupplyPrice);
	$("#totalTotalPrice").text(totalTotalPrice);
}

//生成出口报价单
function makeOutQuote() {
	//包含所有树的数组
	var modelsArr = [];
	var tbodyConfigChildrenTemplate = $("tbody[name='configChildrenTemplate']");
	for(var i = 1; curTbodyTemp = tbodyConfigChildrenTemplate[i]; i++) {
		//定义接收每棵树的map
		var modelsMap = {};
		var proposalId = $($($(curTbodyTemp)[0]).find("input[name='proposalId']")).val();
		var inquiryProdId = $($($(curTbodyTemp)[0]).find("input[name='id']")).val();

		
		/*[{"inquiryPordId": 1, "detail": [{"id":"1","supplyPrice":"100"}, {"id":"1", "supplyPrice":"100}]}, {}]*/	
		//定义接收这棵树的数组
		var detailArr = [];
		for(var j = 0; curTrTemp = $($(curTbodyTemp).find("tr:visible"))[j]; j++) {
			//定义接收当前节点数据的map
			var detailMap = {};
			detailId = $($(curTrTemp).find("input[name='detailId']")).val();
			supplyPrice = $($(curTrTemp).find("span[name='totalPrice']")).text();
			if(supplyPrice == null) 
				supplyPrice = "";
			detailMap.id = detailId;
			detailMap.supplyPrice = supplyPrice;
			detailArr.push(detailMap);
		}
		modelsMap.inquiryProdId = inquiryProdId;
		modelsMap.detail = detailArr;
		modelsArr.push(modelsMap);
	}
	console.log(modelsArr);
	
	/*prodLibs=[{inquiryProdId=1;salePirce=1},{inquiryProdId=1;supplyPrice=1}]*/
	
	var trInquiryProdPageTemplate = $("tr[name='InquiryProdPageTemplate']");
	//接收所有产品的数组
	var prodArry = [];
	for(var i = 1; curTrTemp = $(trInquiryProdPageTemplate)[i]; i++) {
		//接收当前产品数据的map
		var prodMap = {};
		var inquiryProdId = $($(curTrTemp).find("input[name='id']")).val();
		var salePrice =  $($(curTrTemp).find("span[name='totalPrice']")).text();
		
		if(salePrice == null) 
			salePrice = "";
		
		prodMap.inquiryProdId = inquiryProdId;
		prodMap.salePrice = salePrice;
		prodArry.push(prodMap);
	}
	console.log(prodArry);
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeOutQuote/{map}/{innerQuoteIdStr}/{prods}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeOutQuote/id=;quoteNum=;validTo=;quoteDescr=/1,2/prods;models=[{"inquiryPordId": 1, "detail": [{"id":"1","supplyPrice":"100"}, {"id":"1", "supplyPrice":"100}]}, {}];prodLibs=[{inquiryProdId=1;salePirce=1},{inquiryProdId=1;supplyPrice=1}/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/makeOutQuote/{map}/{innerQuoteIdStr}/{prods}/{sys}",
		data : {
			"map": {
				"id": param("id"),
				"quoteNum": $$("quoteNum").value,
				"validTo": $$("validTo").value,
				"quoteDescr": $$("quoteDescr").value
			},
			"innerQuoteIdStr": innerQuoteIdStr,
			"prods": {
				"models": JSON.stringify(modelsArr),
				"prodLibs": JSON.stringify(prodArry),
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


/*双击配套表操作*/
//获得当前点击html元素 并进行操作
var treeIndent = "<span class='tree-indent'></span>";
//非销售配置的子级列表
var curProposalId;
var curRootConfigId;
var curNumTemp;
function saleProposalDetail() {
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/saleProposalDetail/{configId}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/saleProposalDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/model/saleProposalDetail/{configId}/{proposalId}/{sys}",
		data:{
			"configId": curRootConfigId,
			"proposalId": curProposalId,
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
			data.result["detail" + curNumTemp] = myDataArr;
			console.log(data, "------------------")
			toView(data)
			$("tr[name='detail" + curNumTemp + "Template']").slice(0,2).remove();
		}
	});
}

//当前点击行加上点击样式
$('.treelist tr').click(function(){
	$('.treelist tr.tree-node-selected').removeClass('tree-node-selected');
	$(this).addClass('tree-node-selected');		
});

//递归调用隐藏子节点
function hide_sub_lines(current){
	var val = $(current).data('id');		
	var subs = $(current).parent().find('tr[data-parent="'+val+'"]');		
	if(subs.length>0){
		subs.hide();
		$.each(subs,function(index,item){
			hide_sub_lines(item);
		});
	}
	return;
}

//递归调用显示子节点
function show_sub_lines(current){
	var val = $(current).data('id');
	if($(current).find('span.tree-collapsed').length>0){
		return;
	}
	var subs = $(current).parent().find('tr[data-parent="'+val+'"]');		
	if(subs.length>0){
		subs.show();
		$.each(subs,function(index,item){
			show_sub_lines(item);
		});
	}
	return;	
}

//双击当前行的操作
$('.treelist ').on("dblclick",'tr',function(){
	if($(this).find('span.tree-collapsed').length>0){ //展开当前层次
		$(this).find('span.tree-collapsed').removeClass('tree-collapsed').addClass('tree-expanded');
		$(this).find('span.tree-folder').addClass('tree-folder-open');
		show_sub_lines(this);
		
		var datahasreq = $(this).attr("data-hasreq");
		if(datahasreq == 0) {
			$(this).attr("data-hasreq", 1)
			curNumTemp = $(this).find("input[name='numTemp']").val();
			$(this).next().attr("name", "detail" + curNumTemp + "Template");
			curProposalId = $(this).find("input[name='proposalId']").val();
			curRootConfigId = $(this).attr("data-id");
			curClick = $(this);
			saleProposalDetail();
			changeTotalPrice();
			
		}else 
			return;
	}else if($(this).find('span.tree-expanded').length>0){ //收缩当前层次
		$(this).find('span.tree-expanded').removeClass('tree-expanded').addClass('tree-collapsed');
		$(this).find('span.tree-folder').removeClass('tree-folder-open');
		hide_sub_lines(this);
	}
});

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

function outRootConfigIdValueTo(el, val) {
	$(el).parent().parent().attr("data-id", val);
	
	valueToWithNoFunc(el, val);
}






