//询价单详情
function callback() {
	makeInquiryDetail();
}
function makeInquiryDetail() {
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeInquiryDetail/{innerInquiryId}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeInquiryDetail/{innerInquiryId}/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/makeInquiryDetail/{innerInquiryId}/{sys}",		        
		data:{
			"innerInquiryId": param("id"),
			"sys": {"token": $.cookie("token")}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			var configChildren = [];
			var InquiryProdPage = [];
			for(var i = 0; curInquiryProd = jsonData.result.InquiryProds[i]; i++) {
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
			console.log(jsonData, "-----------------------------")
			toView(jsonData, true);
		}
	});
}

//创建内部报价单
function makeInnerQuote() {
	//包含所有树的数组
	var modelsArr = [];
	var tbodyConfigChildrenTemplate = $("tbody[name='configChildrenTemplate']");
	for(var i = 1; curTbodyTemp = tbodyConfigChildrenTemplate[i]; i++) {
		//定义接收每棵树的map
		var modelsMap = {};
		var proposalId = $($($(curTbodyTemp)[0]).find("input[name='proposalId']")).val();
		var inquiryProdId = $($($(curTbodyTemp)[0]).find("input[name='id']")).val();

		
		/*{"proposalId": 1, "inquiryPordId": 1, "detail": [{"configId":"1", "num":"2", "price":"100"}, {"configId":"1", "num":"2", "price":"100}]}*/	
		//定义接收这棵树的数组
		var detailArr = [];
		for(var j = 0; curTrTemp = $(curTbodyTemp).children()[j]; j++) {
			//定义接收当前节点数据的map
			var detailMap = {};
			configId = $(curTrTemp).attr("data-id");
			num = $($(curTrTemp).find("input[name='num']")).val();
			price = $($(curTrTemp).find("input[name='price']")).val();
			if(num == null) 
				num = "";
			if(price == null) 
				price = "";
			detailMap.configId = configId;
			detailMap.num = num;
			detailMap.price = price;
			detailArr.push(detailMap);
		}
		modelsMap.proposalId = proposalId;
		modelsMap.inquiryProdId = inquiryProdId;
		modelsMap.detail = detailArr;
		modelsArr.push(modelsMap);
	}
	console.log(modelsArr);
	
	/*prodLibs=[{inquiryProdId=1;num=1;salePrice=1},{inquiryProdId=1;num=1;salePrice=1}]*/
	
	var trInquiryProdPageTemplate = $("tr[name='InquiryProdPageTemplate']");
	//接收所有产品的数组
	var prodArry = [];
	for(var i = 1; curTrTemp = $(trInquiryProdPageTemplate)[i]; i++) {
		//接收当前产品数据的map
		var prodMap = {};
		var inquiryProdId = $($(curTrTemp).find("input[name='id']")).val();
		var num =  $($(curTrTemp).find("input[name='num']")).val();
		var salePrice =  $($(curTrTemp).find("input[name='price']")).val();
		
		prodMap.id = inquiryProdId;
		prodMap.num = num;
		prodMap.supplyPrice = salePrice;
		prodArry.push(prodMap);
	}
	console.log(prodArry);
	
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeInnerQuote/{map}/{prods}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeInnerQuote/condition;id=;quoteNum=;validTo=;discount=/prods;models=[{"proposalId": 1, "inquiryPordId": 1, "detail": [{"configId":"1", "num":"2", "price":"100"}, {"configId":"1", "num":"2", "price":"100}]}, {}];prodLibs=[{inquiryProdId=1;num=1;salePrice=1},{inquiryProdId=1;num=1;salePrice=1}]/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/makeInnerQuote/{map}/{prods}/{sys}",		        
		data:{
			"map": {
				"id": param("id"),
				"quoteNum": $$("quoteNum").value,
				"validTo": $$("validTo").value,
				"discount": $$("discount").value
			},
			"prods": {
				"models": JSON.stringify(modelsArr),
				"prodLibs": JSON.stringify(prodArry),
			},
			"sys": {"token": $.cookie("token")}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			console.log(jsonData);
			if (!right(jsonData)) return;
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

function InnerQuoteTypValueTo(el ,val) {
	if(val != "产品") {
		$(el).next().children().remove();
		$(el).next().next().children().remove();
		$(el).next().next().next().children().remove();
		$(el).next().next().next().next().children().remove();
	}
	valueToWithNoFunc(el, val);
}

function InnerQuoteSaleLeafedValueTo(el ,val) {
	if(val == 0) {
		$(el).next().children().remove();
	}
	valueToWithNoFunc(el, val);
}

function numChangeTo(el) {
	var curPrice = $($(el).parent().parent().find("input[name='price']")).val()
	
	if(curPrice != null) {
		$($(el).parent().parent().find("span[name='totalPrice']")).text(curPrice * $(el).val());	
	} 
}

function numPriceTo(el) {
	var curNum = $($(el).parent().parent().find("input[name='num']")).val()
	$($(el).parent().parent().find("span[name='totalPrice']")).text(curNum * $(el).val());	
}

