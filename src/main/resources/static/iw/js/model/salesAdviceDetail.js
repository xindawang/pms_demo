function _modelCommit() {
    $.ajax({ 
    	type: "post", 
    	//http://localhost:81/ils/model/myModelPage/condition;codeLike=;techStatus=/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/model/myModelPage/{condition}/{sys}",
    	data:{
			"condition": { 
				"codeLike": $$("codeLike").value,
				"techStatus": "",
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


function _configCommit() {
	var modeId = $$("modelId").value;
	if(modeId == "" || modeId == undefined){
		tip("请先选择型号");
		return;
	}else {
		$.ajax({ 
	    	type: "post", 
	    	//RequestMapping(value = "/configPageByModelId/{modelId}/{sys}", produces = "text/plain")
	    	// http://localhost:81/ils/model/configPageByModelId/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	    	url : apphost() + "/ils/model/configPageByModelId/{modelId}/{sys}",
	    	data:{
					"modelId": modeId,	
				"sys": {
					"offset": $$("configOffset").value,
					"limit": $$("configLimit").value, 
					"token": $.cookie("token")}
	    	},
	    	dataType : "json",
	    	async: false,
	    	martrix:true,
	    	success: function (jsonData) {
	    		if (!right(jsonData)) return;
	    		console.log(jsonData);
	    		if (jsonData.result.myConfigPage.length == 0) {
	    			tip("所选型号无关联配置,请重新选择型号!")
	    			return;
	    			}
	    		toView(jsonData,true);
	    	}
		});
	}	
}

function configPaginate() {
	if ($$("configPage-nav")) {
		$("#configPage-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("configLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("configOffset").value = $$("configLimit").value * (pageIndex - 1);
				_configCommit();
			}
		});
	}
}
//型号列表
function modelChoice() {
	var  v = $('input:radio:checked').parent().parent().find("span[name='name']").text();
	$("input[id='modelName']").val(v);
	if (v == null || v == undefined || v == "") tip("请选择型号名称！");
	s = $('input:radio:checked').parent().parent().find("span[name='id']").text();
	$("input[id='modelId']").val(s);
}


//关联型号配置
var rootConfigId = "";
function configChoice() {
	var  v = $('input:radio[id="configId"]:checked').parent().parent().find("span[name='name']").text();
	$("input[id='configName']").val(v);
	if (v == null || v == undefined || v == "") tip("请选择型号配置表名称名称！");
	rootConfigId = $('input:radio[id="configId"]:checked').parent().parent().find("span[name='id']").text();
	if(rootConfigId > 0) {
		newProposalDetail();
	}
	
	$("input[id='configId']").val(rootConfigId);
}

var treeIndent = "<span class='tree-indent'></span>";

//新建型号建议详情
function newProposalDetail() {
	$($.find("tr[name='detailTemplate']").splice(1, $.find("tr[name='detailTemplate']").length-1)).remove()
	$.ajax({ 
		type: "post", 
		//	@RequestMapping(value = "/newProposalDetail/{configId}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/newProposalDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/model/newProposalDetail/{configId}/{sys}",
		data:{
			"configId": rootConfigId,
			"sys": {"token": $.cookie("token")}
	    },
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			var myDataArr = [];
			for(var i = 0;dataArrItem = jsonData.result.detail[i]; i++){
				if(dataArrItem.parentId == 0){
					myDataArr.push(dataArrItem);
				}
			}
			var idArr = [];
			for(var i = 0;dataArrItem = jsonData.result.detail[i]; i++){
				idArr.push(dataArrItem.id);
			}
			idArr.sort(function(a, b){
				return a - b;
			});
			for(var j = 0; idNum = idArr[j]; j++){
				for(var i = 0; dataArrItem = jsonData.result.detail[i]; i++){
					if(idNum == dataArrItem.parentId){
						myDataArr.splice(idNum, 0, dataArrItem);
					}
				}
			}
			
			console.log(myDataArr, "===")
			var data = {};
			data.result = {};
			data.status = "succ";
			data.dual = "";
			data.result.detail = myDataArr;
			console.log(data)
			toView(data)
	
		}
	});
}

function salesIdValueTo(el, val) {
	$(el).parent().attr("data-id", val);
	valueToWithNoFunc(el,val)
}

function salesParentIdValueTo(el, val) {
	$(el).parent().attr("data-parent", val);
	valueToWithNoFunc(el,val)
}

function salesTypValueTo(el, val) {
	if(val == "产品") {
		$(el).next().children().show();
		$(el).prev().children().show();
		$(el).parent().find("input[name='descr']").show();
	}
	valueToWithNoFunc(el,val)
}

function salesMustChoosedValueTo(el, val) {
	if(val == 1) val = "必须"
	else if(val == 0) val = "非必须"
	valueToWithNoFunc(el,val)
}

function salesConfigStatusValueTo(el, val) {
	if(val == "无效") {
		$(el).parent().attr("class","disabled");
		$(el).next().children().hide();
		$(el).prev().children().hide();
		$(el).prev().prev().prev().children().hide();
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

function salesLvlValueTo(el, val) {
	for(var i = 0; i < val; i++) {
		$(el).parent().prepend(treeIndent);
	}
	valueToWithNoFunc(el,val)
}

function salesChildrenSingledValueTo(el, val) {
	if(val == 0)
		val = "否";
	else if(val == 1)
		val = "是";
	valueToWithNoFunc(el,val)
}

function decrement(el, val) {
	var decOrIncNum = $(el).next().val();
	if(decOrIncNum > 0) 
		$(el).next().val(--decOrIncNum)
	if(decOrIncNum == 0) {
		$(el).parent().parent().parent().attr("data-hasnum", 0);
		$($(el).parent().parent().parent().find("input[name='price']")).attr("readonly", "readonly");
		$($(el).parent().parent().parent().find("input[name='descr']")).attr("readonly", "readonly");
	}
}

function increment(el, val) {
	var decOrIncNum = $(el).prev().val();
	$(el).prev().val(++decOrIncNum)
	$(el).parent().parent().parent().attr("data-hasnum", 1);
	$($(el).parent().parent().parent().find("input[name='price']")).removeAttr("readonly");
	$($(el).parent().parent().parent().find("input[name='descr']")).removeAttr("readonly");
}

//创建或修改型号建议
function makeProposalAndDetail() {
	if($("#proposalName").val() == "") {
		tip("请输入销售建议清单名称");
		return;
	}else if(rootConfigId == 0) {
		tip("请选择关联型号配置");
		return;	
	} else {
		var detailsArr = [];
		//取出页面页面中数量大于零的数据
		for(var i = 0; curHasNum = $("tr[name='detailTemplate']")[i]; i++) {
			if($(curHasNum).attr("data-hasnum") == 1) {
				if($(curHasNum).find("input[name='price']").val() == "" || $(curHasNum).find("input[name='price']").val() == null) {
					tip("请输入单价！");
					return;
				} else {
					var hasNumMap = {}; 
					hasNumMap.configId = $(curHasNum).find("input[name='id']").val();
					hasNumMap.num = $(curHasNum).find("input[name='num']").val();
					hasNumMap.price = $(curHasNum).find("input[name='price']").val();
					hasNumMap.descr = $(curHasNum).find("input[name='descr']").val();
					detailsArr.push(hasNumMap);
				}
			}
		}
		
		console.log(detailsArr);
		var id;
		if(param("id") == "") 
			id = 0;
		else if(param("id") != "")
			id = param("id");
			
		$.ajax({ 
			type: "post", 
			//@RequestMapping(value = "/makeProposalAndDetail/{proposal}/{detail}/{sys}", produces = "text/plain")
			// http://localhost:81/ils/model/makeProposalAndDetail/proposal;id=0;name=ddsdsesf;rootConfigId=1/details;array=[{"configId"=1, "num"=2, "price"=100}, {"configId"=2, "num"=3, "price"=1000}]/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
			url : apphost() + "/ils/model/makeProposalAndDetail/{proposal}/{detail}/{sys}",
			data:{
				"proposal": {
					"id": id,
					"name": $("#proposalName").val(),
					"rootConfigId": rootConfigId,
					"status": $($.find("input[type='radio']:checked")).val()
				},
				"detail": JSON.stringify(detailsArr),
				"sys": {"token": $.cookie("token")}
		    },
			dataType : "json",
			async: false,
			martrix:true,
			success: function (jsonData) {
				console.log(jsonData);
				if (!right(jsonData)) return;
				if(id == 0){
					tip("创建成功!");
				}else{
					tip("修改成功!");
				}
				backSecond();
			}
		});
	}	
}


//型号建议详情
if(param("id") != "")
	proposal();

function proposal() {
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/proposal/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/proposal/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/model/proposal/{id}/{sys}",
		data:{
			"id": param("id"),
			"sys": {"token": $.cookie("token")}
	    },
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			var myDataArr = [];
			for(var i = 0;dataArrItem = jsonData.result.detail[i]; i++){
				if(dataArrItem.parentId == 0){
					myDataArr.push(dataArrItem);
				}
			}
			var idArr = [];
			for(var i = 0;dataArrItem = jsonData.result.detail[i]; i++){
				idArr.push(dataArrItem.id);
			}
			idArr.sort(function(a, b){
				return a - b;
			});
			for(var j = 0; idNum = idArr[j]; j++){
				for(var i = 0; dataArrItem = jsonData.result.detail[i]; i++){
					if(idNum == dataArrItem.parentId){
						myDataArr.splice(idNum, 0, dataArrItem);
					}
				}
			}
			
			var data = {};
			data.result = {};
			data.status = "succ";
			data.dual = "";
			data.result.detail = myDataArr;
			data.result.proposal = jsonData.result.proposal;
			
			rootConfigId = jsonData.result.proposal.rootConfigId;
			
			toView(data)
			
		}
	});
}

function salesNumValueTo(el, val) {
	if(val == 0) {
		$(el).parent().parent().parent().attr("data-hasnum", 0);
		$($(el).parent().parent().parent().find("input[name='price']")).attr("readonly", "readonly");
		$($(el).parent().parent().parent().find("input[name='descr']")).attr("readonly", "readonly");
	}else {
		$(el).parent().parent().parent().attr("data-hasnum", 1);
		$($(el).parent().parent().parent().find("input[name='price']")).removeAttr("readonly");
		$($(el).parent().parent().parent().find("input[name='descr']")).removeAttr("readonly");
	}
	valueToWithNoFunc(el,val)
}

