//指定ID渲染
var jattrs;
var grpCateCodeVal;
var cateCodeVal;
var itemNameCode="";
var grpCode;
supplyItemDetail();
if(param("no") == 0) {
	grpCateAll();
}else{
	itemNameCode = $("#itemNameCode").val();
	grpCateAllByItemNameCode();
	grpCode = $("#grpCateCode").val().split("_")[0];
	cateAllByGrpCode();
	$("#grpCateCode").val(grpCateCodeVal);
	$("#cateCode").val(cateCodeVal);
}

var itemDisplay = $("#itemnamesModal").css("display")
function supplyItemDetail() {
	var unit = [];
	if (!param("no")) {
		$("#mrcSetting").css("display","none");
		return;
	}
	$("#mrcSetting").css("display","bolck");
	$.ajax({		
		type: "post",
		//@RequestMapping(value = "/supplyItemDetail/{no}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/supplyItemDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/org/supplyItemDetail/{no}/{sys}",
		data:{
			"no": param("no"),			
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		martrix:true,
		dataType: "json",

		success: function (data) {
			if (!right(data)) return;
			console.log(data);
			toView( {"result": {"supplyItem": data.result.supplyItem} });
			grpCateCodeVal = data.result.supplyItem.cateGrpCode+ "_" + data.result.supplyItem.cateGrpName;
			cateCodeVal =  data.result.supplyItem.cateCode + "_" + data.result.supplyItem.cateName;
			jattrs = null == data.result.supplyItem.jattrs ? {} : JSON.parse(data.result.supplyItem.jattrs);
			toViewAttrs(data.result.attrs, jattrs);
			lvl = data.result.supplyItem.scretLvl;
			if(lvl == "内部") {
				$("input:radio[value='内部']").attr('checked',true);
			}
			if(lvl == "秘密") {
				$("input:radio[value='秘密']").attr('checked',true);
			}
			if(lvl == "机密") {
				$("input:radio[value='机密']").attr('checked',true);
			}
			if(lvl == "核心") {
				$("input:radio[value='核心']").attr('checked',true);
			}
			if(lvl == "非密") {
				$("input:radio[value='非密']").attr('checked',true);
			}
			if(lvl == "一般商密") {
				$("input:radio[value='一般商密']").attr('checked',true);
			}
			if(lvl == "核心商密") {
				$("input:radio[value='核心商密']").attr('checked',true);
			}
			
			for(var i = 0; i < $($('#unit').find("input[name='unit']")).length ; i++){
				unit = $($('#unit').find("input[name='unit']")[i]).val();
				if(unit == data.result.supplyItem.unit){
					$($('#unit').find("input[name='unit']")[i]).attr("checked","checked");
					$('input[name="custom"]').val("");
					return;
				}else{
					$($('#unit').find("input[value='自定义']")).attr("checked","checked");
					$('input[name="custom"]').val(data.result.supplyItem.unit);
				}
			}
			
		}
			
	});
}

var currAttrCode, currReplyCode, currDrawCode, selectedReplyVal, currReplyThreePoint;

function showModal(el) {
	 var itemDisplay = $("#replyModal").css("display");
	    if(itemDisplay == 'none'){
	            $("input[id='replyValLike']").val("");
	    }
	$(".currentReply").removeClass("currentReply");
	$(el).parent().find("input").addClass("currentReply");
	
	currAttrCode = $(".currentReply").attr("name").replace(/\..*/, "");
	
	currReplyCode = $(".currentReply").attr("name").replace(/.[^\.]*\./, "");
	$("#currAttrName").html($(el).parent().parent().parent().find("[name='" + currAttrCode + ".name']").html());
	$("#currReplyName").html($(el).parent().parent().parent().find("[name='" + currAttrCode + "." + currReplyCode + ".name']").html());
	
	pageTag = 'replyModalPageTag';

	$('#replyModal').modal('show');
	_replyCommit();
	currReplyThreePoint = el;
	
}

function _replyCommit() { 
	$.ajax({ 
		type: "post", 
		// @RequestMapping(value = "/replyPage/{condition}/{sys}", produces = "text/plain")
        // http://localhost:81/ils/org/replyPage/condition;code=;replyValLike=/sys
		url : apphost() + "/ils/org/replyPage/{condition}/{sys}",
		data:{			
			"condition": {"replyCode": currReplyCode, "replyValLike": $$("replyValLike").value},			
	        "sys": {"offset": $$("replyOffset").value, "limit": $$("replyLimit").value}			
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData,true);
			
			selectedReplyVal = $(currReplyThreePoint).parent().find("input").val();

			if (selectedReplyVal != "") {
				var replyValSpans = $("tr[name='replyPageTemplate'] span");
				for (var i = 0; replySpan = replyValSpans[i]; i++)  {
					if ($(replySpan).html() == selectedReplyVal) {
						$(replySpan).parent().parent().find("input[type=radio]").attr("checked",true);
						break;
					}
				}
			}
		}
	});
}

function setCurrentReplyVal(el) {
	$(".currentReply").val($($(el).parent().parent().find('input:checked')).parent().parent().find("span[name='val']").text());
	if (null == jattrs[currAttrCode]) jattrs[currAttrCode] = {};
	jattrs[currAttrCode][currReplyCode] = $(".currentReply").val();
	$('#replyModal').modal('hide');
}

function showDrawModal(el) {
	$(".currentDraw").removeClass("currentDraw");
	$(el).parent().find("input").addClass("currentDraw");
	
	currAttrCode = $(".currentDraw").attr("name").replace(/\..*/, "");
	
	$("#currAttrName").html($(el).parent().parent().parent().find("[name='" + currAttrCode + ".name']").html());
	
	pageTag = 'drawModalPageTag';
	paginateInit();
	$('#drawModal').modal('show');
	
	_commit();
	
}

function drawPage() {
	$.ajax({ 
		type: "post", 
		// @RequestMapping(value = "/drawPage/{condition}/{sys}", produces = "text/plain")
        // http://localhost:81/ils/org/drawPage/condition;code=;replyValLike=/sys
		url : apphost() + "/ils/org/drawPage/{condition}/{sys}",
		data:{			
			"condition": {"attrCode": currAttrCode, "codeLike": $$("codeLike").value},			
	        "sys": {"offset": $$("offset").value, "limit": $$("limit").value}			
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

function setCurrentDrawVal(el) {
	$(".currentDraw").val($(el).parent().parent().find('input:checked').val());
	if (null == jattrs[currAttrCode]) jattrs[currAttrCode] = {};
	jattrs[currAttrCode]["draw"] = $(".currentDraw").val();
	$('#drawModal').modal('hide');
}
//我的供应商列表显示
function _supplyCommit() {
  var itemDisplay = $("#supplierModal").css("display");
    if(itemDisplay == 'none'){
            $("input[id='nameLike']").val("");
    }
	$.ajax({ 
		type: "post", 
		// @RequestMapping(value = "/replyPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/supplyPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/mySupplyPage/{condition}/{sys}",
		data:{			
			"condition": {"nameLike": $$("nameLike").value},			
			"sys": {"offset": $$("supplyOffset").value, "limit": $$("supplyLimit").value, "token": $.cookie("token")}			
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

function supplyPaginate() {
	if ($$("supplyPage-nav")) {
		$("#supplyPage-nav").pagination({
			items: $$("supplyTotal").value,
			itemsOnPage: $$("supplyLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("supplyOffset").value = $$("supplyLimit").value * (pageIndex - 1);
				_supplyCommit();
			}
		});
	}
}
function replyPagePaginate() {
	if ($$("replyPage-nav")) {
		$("#replyPage-nav").pagination({
			items: $$("replyTotal").value,
			itemsOnPage: $$("replyLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("replyOffset").value = $$("replyLimit").value * (pageIndex - 1);
				_replyCommit();
			}
		});
	}
}

var pageTag = "";

function paginateInit() {
    var paginateHtml = '<input type="hidden" name="total" id="total" value=0>';
    paginateHtml += '<input type="hidden" name="offset" id="offset" value=0>';
    paginateHtml += '<input type="hidden" name="limit" id="limit" value=3>';
    paginateHtml += '<div class="row-fluid"><div id="page-nav" style="padding: 18px;"></div></div>';

    if (pageTag == "replyModalPageTag") {
    	$("#drawModalPaginate").html("");
    	$("#replyModalPaginate").html(paginateHtml);
    } else if (pageTag == "drawModalPageTag") {
    	$("#replyModalPaginate").html("");
    	$("#drawModalPaginate").html(paginateHtml);
    }
    
}
//重置分页
function _commit(){
   if(pageTag == "replyModalPageTag") replyPage();
   else if(pageTag == "drawModalPageTag") drawPage();
   paginate();
};
//物项名称代码列表
function _itemNameCommit() {    
	 var itemDisplay = $("#itemnamesModal").css("display");
	    if(itemDisplay == 'none'){
	            $("input[id='itemNameLike']").val("");
	    }
	//大类
	var grpCateCode = $("#grpCateCode").val().split("_")[0];
	//小类
	var cateCode = $("#cateCode").val().split("_")[0];
	//禁用选择物项名称 
	/*if( typeof (grpCateCode) == "undefined" ) {
		$("#itemSelectSpan").attr("onclick","tip('请先选择大小类。');return false;");
		$("#itemSelectSpan").attr("data-target","");
		return;
	}*/
	$.ajax({ 
		type: "post", 
		//@OrgAuthen( PERM = false, name = "物项名称列表")        @ResponseBody
        //@RequestMapping(value = "/itemNamePage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/itemNamePage/condition;nameLike=;grpCateCode=;cateCode=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/itemNamePage/{condition}/{sys}",
		data:{
			"condition": {"nameLike": $$("itemNameLike").value,"grpCateCode":grpCateCode,"cateCode":cateCode}, 
	        "sys": {"offset": $$("itemNameOffset").value, "limit": $$("itemNameLimit").value, "token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData,true);
			var itemDisplay = $("#itemnamesModal").css("display");
			if(itemDisplay == 'none'){
				$("input[id='itemNameLike']").val("");
			}
		}
	});
}
function itemNamePaginate() {
	if ($$("itemNamePage-nav")) {
		$("#itemNamePage-nav").pagination({
			items: $$("itemNameTotal").value,
			itemsOnPage: $$("itemNameLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("itemNameOffset").value = $$("itemNameLimit").value * (pageIndex - 1);
				_itemNameCommit();
			}
		});
	}
}

//新增物项丶修改
function makeSupplyItem(onlyCreateItem) {
	var unit = $('input[name="unit"]:checked').val();
	if(unit == "自定义"){
		unit = $('input[name="custom"]').val();
	}
	var lvl = $('input[name="idSelected"]:checked').val();
	 cateCode = $("#cateCode").val().split("_")[0];
	$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/makeSupplyItem/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/makeSupplyItem/map;no=;supplyCode=;partNo=SS-14 替罪羊;itemNameCode=000001;cateCode=1405;tag=导弹 SS-14 替罪羊;scretLvl=机密/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/org/makeSupplyItem/{map}/{sys}",		        
		data:{
			"map": {
				"no": param("no"),
				"supplyId": $$("supplyId").value,	
				"partNo": $$("partNo").value,			
				"scretLvl": lvl,
				"itemNameCode": $$("itemNameCode").value,
				"cateCode": cateCode,
				"tag": $$("tag").value,
				"price": $$("price").value,
				"unit":unit
			},					
			"sys": {"token": $.cookie("token")}					
		},
		dataType: "json",
		async: false,
		martrix:true,
		//孟德利改
		success : function(jsonData) {
			var reqParams = {
					no:  param("no"),
					supplyId:  $$("supplyId").value,
					scretLvl: lvl
				}
			var logMap = {};
			logMap.opName = "物项新增修改";
			logMap.reqParams = JSON.stringify(reqParams);
			logMap.domain = "org";
			logMap.action = "makeSupplyItem";
			logMap.reqURI = "itemDetail.html";
			
			if (!right(jsonData)) {
				logMap.status = "失败";
				makeBizLog(logMap);
				return;
			}
			logMap.status = "成功";
			makeBizLog(logMap);
			console.log(jsonData);			
				if (onlyCreateItem) {
					location = "itemPage.html?pageType=myItem";
				}
			}
	});
}
var supplyVal = "";
//被选中的单选按钮的值赋值给指定的Input.
function supplyChoice() {
	var  v = $('input:radio:checked').parent().parent().find("td[id='supplyName']").text();
	$("input[id='supplyNames']").val(v)
	var s = $('input:radio:checked').parent().parent().find("td[id='id']").text();
	$("input[id='supplyId']").val(s)
	supplyVal = v;
	//grpCateAllByItemNameCode();
}
//物项选中列表赋值
function itemNamePageChoice() {
	var  v = $('input:radio:checked').parent().parent().find("td[id='name']").text();
	$("input[id='itemName']").val(v);
	 s = $('input:radio:checked').parent().parent().find("td[id='itemCode']").text();
	 $("input[id='itemNameCode']").val(s);
	itemNameCode = s;
	$("#grpCateCode").val("");
	if($("#itemName").val() == 0) return;
	grpCateAllByItemNameCode();
}
//大类下拉列表
function grpCateAll() {
	if($("#grpCateCode").val() != "")return;
 	$.ajax({
		type: "post",
	/*	@RequestMapping(value = "/grpCateAll/sys", produces = "text/plain")
		// http://localhost:81/ils/org/grpCateAll/sys	*/
		url: apphost() + "/ils/org/grpCateAll/sys",
		async: false,
		dataType: "json",
		success: function (jsonData) {	
			if (!right(jsonData)) return;
			console.log((jsonData));
			toView({status: "succ", result: {"grpCateAll": jsonData.result.grpCateAll}});
			$("#grpCateCodeDiv").autocomplete({refreshList : cateAllByCode});
		}
	}); 
}

//大类下拉列表物项名称查找
function grpCateAllByItemNameCode() {
	var cateCodeByAll = {}; 
	var grpCodeByAll = {}; 
	var cateResult = {};
	var grpCoderesult = {};
	$("#cateCode").val("");
	$("#grpCateCodeDiv ul li").attr("name", "xxxTemplate");
	$("#grpCodeUl li").not(":first").remove();
	$("#cateCodeUl li").not(":first").remove();
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/grpCateAllByItemNameCode/{condition}/sys", produces = "text/plain")
		// http://localhost:81/ils/org/grpCateAllByItemNameCode/1/sys
		url: apphost() + "/ils/org/grpCateAllByItemNameCode/{condition}/sys",
		data:{"condition" : itemNameCode},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
		//小类数据变型
			var cateCodeAlls = jsonData.result.grpCateAll;
			if(cateCodeAlls.length == 0)return;
			for(var i = 0 , cateCodeAll; i < cateCodeAlls.length; i++){
				cateCodeAll = cateCodeAlls[i];	
				var cateCodeModel = new Object();
				cateCodeModel.name = cateCodeAll.name;
				cateCodeModel.code = cateCodeAll.cateCode;
				cateCodeByAll[cateCodeAll.cateCode] = [cateCodeModel];
			}
			console.log(cateCodeByAll);
			for (var cateCode in cateCodeByAll) {
				var template = $("#cateCodeDiv ul li");
				template.attr("name","");
				$(template).attr("name", cateCode + "Template");
				cateResult = {"status": "succ"};
				cateResult["result"] = {};
				cateResult["result"][cateCode] = cateCodeByAll[cateCode];
				$("#cateCodeDiv ul").append(template);
				toView(cateResult);
				$("#cateCodeDiv").autocomplete();
			}
			
			//大类数据变形
			var grpCodeAlls = jsonData.result.grpCateAll;
			if (grpCodeAlls.length == 0) return;
			for (var i = 0, grpCodeAll; i < grpCodeAlls.length; i++) {
				grpCodeAll = grpCodeAlls[i];
				//判断是否有此大类  如果没有就创建  如果有就舍弃
				if (!grpCodeByAll[grpCodeAll.grpCode]) 
					grpCodeByAll[grpCodeAll.grpCode] = [grpCodeAll];
			}
			console.log(grpCodeByAll);
			for (var grpCode in grpCodeByAll) {
				var template = $("#grpCateCodeDiv ul li");
				template.attr("name","");
				$(template).attr("name", grpCode + "Template");
				grpCoderesult = {"status": "succ"};
				grpCoderesult["result"] = {}
				grpCoderesult["result"][grpCode] = grpCodeByAll[grpCode];
				$("#grpCateCodeDiv ul").append(template);
				toView(grpCoderesult);
				$("#grpCateCodeDiv").autocomplete({refreshList : cateAllByCode});
			}
		}
	}); 
}
//小类根据物项列表
function cateCode(){
	if($("#itemName").val() == 0)
		cateAllByGrpCode();
	else{
		cateAllByCode();
}}
function  cateAllByCode(){
	$("#cateCode").val("");
	var grpCoder=$("#grpCateCode").val().substr(0,2);
	var cateCodeLi = $("#cateCodeDiv ul li");
	for(var i = 0; i < cateCodeLi.length; i++){
		var cateCoder =$($($("#cateCodeDiv ul li")[i]).find("span")[0]).text().substr(0,2);
		if(cateCoder == grpCoder ){
			$($("#cateCodeDiv ul li")[i]).css("display","block");
		}else{
			$($("#cateCodeDiv ul li")[i]).css("display","none");
		}
		$("#cateCodeDiv").autocomplete({refreshList : cateAllByGrpCode});
}

}
//小类下拉列表
function cateAllByGrpCode() {
	grpCode = $("#grpCateCode").val().split("_")[0];
	$("ul li[name='cateAllByGrpIdTemplate']:not([style])").remove();
	$("#cateCode").val("");
	if(typeof grpCode == "undefined" || grpCode.replace(/\s/g, "") == "") return;
	$.ajax({
		type: "post",
		/* @RequestMapping(value = "/cateAllByGrpCode/{grpCode}/sys", produces = "text/plain")
		 http://localhost:81/ils/org/cateAllByGrpCode/14/sys      
		 */
		url: apphost() + "/ils/org/cateAllByGrpCode/{grpCode}/sys",
		data:{"grpCode" : grpCode},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			toView(jsonData);
			$("#itemSelectSpan").attr("onclick","$$('itemNameOffset').value=0;_itemNameCommit();itemNamePaginate()");
			$("#itemSelectSpan").attr("data-target","#itemnamesModal");
			$("#cateCodeDiv").autocomplete();
			$("#cateCode").val(cateCodeVal);
		}
	});
}

function applyCert(CreateItem) { 
	lvl =  $('input[name="idSelected"]:checked').val();
	unit =  $('input[name="unit"]:checked').val();
	var cateCode = $("#cateCode").val().split("_")[0];
	$.ajax({ 
		type: "post", 
//		@OrgAuthen(name = "申请认证")
//		@ResponseBody
//		@RequestMapping(value = "/applyCert/{map}/{sys}", produces = "text/plain")
//		// http://localhost:81/ils/org/applyCert/map;no=;jattrs=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/applyCert/{map}/{sys}",
		data:{			
			"map": {
				"no": param("no"),
				"supplyId": $$("supplyId").value,	
				"partNo": $$("partNo").value,			
				"scretLvl": lvl,
				"itemNameCode": $$("itemNameCode").value,
				"cateCode": cateCode,
				"unit": unit,
				"price": $$("price").value,
				"tag": $$("tag").value,
				"jattrs" : JSON.stringify(jattrs)
			},					
	        "sys": {"token": $.cookie("token")}			
		},
		dataType : "json",
		async: false,
		martrix:true,
		//孟德利改
		success: function (jsonData) {
			var reqParams = {
					no:  param("no"),
					supplyId:  $$("supplyId").value,
					scretLvl: lvl
				}
			var logMap = {};
			logMap.opName = "创建认证信息";
			logMap.reqParams = JSON.stringify(reqParams);
			logMap.domain = "org";
			logMap.action = "applyCert";
			logMap.reqURI = "itemDetail.html";
			
			if (!right(jsonData)) {
				logMap.status = "失败";
				makeBizLog(logMap);
				return;
			}
			logMap.status = "成功";
			makeBizLog(logMap);
			console.log((jsonData));
			if (CreateItem) {
				location = "itemPage.html?pageType=myItem";
			}
		}
	});
}

function saveDraft(CreateItem) { 
	lvl =  $('input[name="idSelected"]:checked').val();
	unit =  $('input[name="unit"]:checked').val();
	var cateCode = $("#cateCode").val().split("_")[0];
	$.ajax({ 
		type: "post", 
//		@OrgAuthen(name = "物项草稿暂存")
//		@ResponseBody
//		@RequestMapping(value = "/saveDraft/{map}/{sys}", produces = "text/plain")
//		// http://localhost:81/ils/org/saveDraft/map;no=;jattrs=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/saveDraft/{map}/{sys}",
		data:{			
			"map": {
				"no": param("no"),
				"supplyId": $$("supplyId").value,	
				"partNo": $$("partNo").value,			
				"scretLvl": lvl,
				"itemNameCode": $$("itemNameCode").value,
				"unit": unit,
				"cateCode": cateCode,
				"price": $$("price").value,
				"tag": $$("tag").value,
				"jattrs" : JSON.stringify(jattrs)
			},					
	        "sys": {"token": $.cookie("token")}			
		},
		dataType : "json",
		async: false,
		martrix:true,
		//孟德利改
		success: function (jsonData) {
			var reqParams = {
					no:  param("no"),
					supplyId:  $$("supplyId").value,
					scretLvl: lvl
				}
			var logMap = {};
			logMap.opName = "保存草稿";
			logMap.reqParams = JSON.stringify(reqParams);
			logMap.domain = "org";
			logMap.action = "saveDraft";
			logMap.reqURI = "itemDetail.html";
			
			if (!right(jsonData)) {
				logMap.status = "失败";
				makeBizLog(logMap);
				return;
			}
			logMap.status = "成功";
			makeBizLog(logMap);
			console.log((jsonData));
			if (CreateItem) {
				/*location = "itemPage.html?pageType=myItem";*/
			}
		}
	});
}


