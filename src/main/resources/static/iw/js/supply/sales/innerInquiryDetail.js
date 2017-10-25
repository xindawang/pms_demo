function callback(){
	assignInnerInquiryDetail();
}

var inquiryNum;

//型号管理列表
function assignInnerInquiryDetail() {
	$.ajax({ 
    	type: "post", 
    	//@RequestMapping(value = "/assignInnerInquiryDetail/{outInquiryId}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/supply/assignInnerInquiryDetail/{outInquiryId}/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/supply/assignInnerInquiryDetail/{outInquiryId}/{sys}",
    	data:{
			"outInquiryId": param("outInquiryId"),
			"sys": {
				"token": $.cookie("token")}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
			   
			   outContractId =  jsonData.result.outInquiry.contractId;
			   outInquiryId =  jsonData.result.outInquiry.id;
			   
				for(var i = 0; i < jsonData.result.innerInquirys.length; i++) {
	    			var projAt = jsonData.result.innerInquirys[i].newat
	    			jsonData.result.innerInquirys[i].newat = toDate(projAt);
	    		}
				var projAt = jsonData.result.outInquiry.newat
				jsonData.result.outInquiry.newat = toDate(projAt);
				
				var configChildren = [];
				var InquiryProdPage = [];
				for(var i = 0; curInquiryProd = jsonData.result.InquiryProds[i]; i++) {
					if(curInquiryProd.configName == null || curInquiryProd.configName == "" ) 
						InquiryProdPage.push(curInquiryProd);
					else 
						configChildren.push(curInquiryProd);
				}
				jsonData.result.configChildren = configChildren;
				jsonData.result.InquiryProdPage = InquiryProdPage;
				 console.log(jsonData);
				toView(jsonData, true);
			   
    	}
	});
}

/*双击配套表操作*/
//获得当前点击html元素 并进行操作
var treeIndent = "<span class='tree-indent'></span>";
//非销售配置的子级列表
var curRootConfigId;
var curProposalId;
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

function outRootConfigIdValueTo(el, val) {
    $(el).parent().parent().parent().attr("data-id", val);
    
    valueToWithNoFunc(el, val);
}
var inquiryProdStr;
function _commit() {
	$.ajax({ 
    	type: "post", 
    	//@RequestMapping(value = "/custPage/{condition}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/org/custPage/condition;nameLike=;roleName=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/org/custPage/{condition}/{sys}",
    	data:{
			"condition": {
				"nameLike" : $("#nameLike").val(),
				"roleName" : "业务员",
			},
			"sys": {
				"offset": $$("custsOffset").value,
				"limit": $$("custsLimit").value, 
				"token": $.cookie("token")
			}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
				toView(jsonData, true);
				
				inquiryProdStr = $("[name='InquiryProdPageTemplate'] input[name='id']:checked").map(function() {
					return $(this).attr("value");
				}).get().join(",").replace(/^,/,"");
    	}
	});
}

function custPaginate() {
	if ($$("custsPage-nav")) {
		$("#custsPage-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("custsLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("custsOffset").value = $$("custsLimit").value * (pageIndex - 1);

				_commit();
			}
		});
	}
}

function saveOutInquiry() {
	var productId, num, aSalerId;
	var allConfigChildrenTemplate = $("tbody[name='configChildrenTemplate']")
	//循环对根节点 调用修改产品接口
	for(var i = 1; curOneConChildTemp = allConfigChildrenTemplate[i]; i++) {
		curConChildTemp = $($(curOneConChildTemp).children()[0]);
		
		productId = $(curConChildTemp.find("input[name='id']")).val();
		num = $(curConChildTemp.find("input[name='num']")).val();
		/*aSalerId = $(curConChildTemp.find("input[name='aSalerId']")).val();*/
		modifyInquiryProd(productId, num);
	}
	//循环对产品 调用修改产品接口
	var allInquiryPageTemp = $("tr[name='InquiryProdPageTemplate']")
	for(var i = 1; curInquiryPageTemp = allInquiryPageTemp[i]; i++) {
		productId = $($(curInquiryPageTemp).find("input[name='id']")).val();
		num = $($(curInquiryPageTemp).find("input[name='num']")).val();
		/*aSalerId = $($(curInquiryPageTemp).find("input[name='aSalerId']")).val();*/
		modifyInquiryProd(productId, num);
	}
	//循环对子节点 调用修改产品接口
	
	for(var i = 1; curOneConChildTemp = allConfigChildrenTemplate[i]; i++) {
		curConChildTemp = $($(curOneConChildTemp).children()[0]);
							  
		var proposalId = $(curConChildTemp.find("input[name='proposalId']")).val();
		var detail = [];
		for(var j = 2; curOneChildConChildTemp = $(curOneConChildTemp).children()[j]; j++) {
			
			curChildConChildTemp = $(curOneChildConChildTemp);
			
			var detailMap = {};
			detailMap.configId = $(curChildConChildTemp.find("input[name='id']")).val();
			detailMap.num = $(curChildConChildTemp.find("input[name='num']")).val();
			detail.push(detailMap);
		}
		if(detail.length > 0)
			modifyProposalDetail(proposalId,detail);
	}
	
}

//修改询价产品
function modifyInquiryProd(productId, num) {
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/modifyInquiryProd/{map}/{sys}", produces = "text/plain")
		//http://localhost:81/ils/supply/modifyInquiryProd/map;id=0;num=0/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/modifyInquiryProd/{map}/{sys}",
		data : {
			"map": {
				"id": productId,
				"num": num
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
			tip("保存成功!")
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

//创建内部询价单
function makeInnerInquiry() {
	salerId = $('input:radio:checked').parent().parent().find("input[name='custId']").val();
	if($$("inquiryNum").value == "" || $$("inquiryNum").value == undefined){
		tip("请输入内部询价单号")
		return;
	}
	if(inquiryProdStr == "" || $$("inquiryNum").value == undefined){
		tip("请勾选相关产品")
		return;
	}
	if(salerId == "" || salerId == undefined){
		tip("请选择业务员")
		return;
	}
	$.ajax({ 
    	type: "post", 
    	//@RequestMapping(value = "/makeInnerInquiry/{map}/{inquiryProdStr}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/supply/makeInnerInquiry/map;id=0;outContractId=;outInquiryId=;inquiryNum=;salerId=;/1,2/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/supply/makeInnerInquiry/{map}/{inquiryProdStr}/{sys}",
    	data:{
			"map": {
				"id": 0,
				"outContractId": outContractId,
				"outInquiryId":  outInquiryId,
				"inquiryNum": $$("inquiryNum").value,
				"salerId": salerId
			},
			"inquiryProdStr": inquiryProdStr,
			"sys": {
				"token": $.cookie("token")}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
				toView(jsonData, true);
				
				$$("inquiryNum").value("");
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

