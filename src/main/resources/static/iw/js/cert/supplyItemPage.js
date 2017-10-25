$(function(){
	$("#search-tabs > li > a").click(function(e){
		e.preventDefault();
		$(this).tab("show");
	});
	
});
grpCateAll();
//大类下拉列表
function grpCateAll() {
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
		}
	});
}
//小类下拉列表
function cateAllByGrpCode() {
	$("#cateCode").find("option[value!='']").remove();
	var grpCode = $("#grpCateCode option:selected").val();
	
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
		}
	}); 	

}
$("#grpCateCode").change(function() {cateAllByGrpCode();})
//排序
var order="UPAT";
function orderBy(el,val){
	if(el=="UPAT"){
		order="UPAT";
		val=2;
	}else{
		order="UPAT DESC";
		val=1;
	}
	if(el=="CATECODE"){
		order="CATECODE";
		val=2;
	}else{
		order="CATECODE DESC";
		val=1;
	}
	if(el=="ITEMNAMECODE"){
		order="ITEMNAMECODE";
		val=2;
	}else{
		order="ITEMNAMECODE DESC";
		val=1;
	}
	
}
var nameLike;
function NamLikeValue(el){
	nameLike=el.text
}

var url = "";
//我的供应物项列表显示
function itemPage() {
	
	var whichPage = "";
	if (param("pageType") == "children") whichPage = "childrenSupplyItemPage";
	if (param("pageType") == "pub") whichPage = "pubSupplyItemPage";
	if (param("pageType") == "myModel") whichPage = "myModelPage";
	else whichPage = "mySupplyItemPage";
	
	var scretLvl = $("input[name='idSelected']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	var supplyType = $("input[name='supplyType']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	var certStatus = $("input[name='certStatus']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
		
    $.ajax({ 
    	type: "post", 
    	//@RequestMapping(value = "/mySupplyItemPage/{condition}/{orderBy}/{sys}", produces = "text/plain")
    	//http://localhost:81/ils/org/mySupplyItemPage/condition;nameLike=;scretLvl=;cateGrpCode=;cateCode=;supplyType=;certStatus=/upat desc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/org/" + whichPage + "/{condition}/{orderBy}/{sys}",
    	data:{
			"condition": { 
				nameLike: $$("nameLike").value,
				"scretLvl": scretLvl,
				"cateGrpCode": $$("grpCateCode").value,
				"cateCode":  $$("cateCode").value,
				"supplyType": supplyType,
				"certStatus": certStatus
			},
			"orderBy": order,        
			"sys": {
				"offset": $$("offset").value,
				"limit": $$("limit").value, 
				"token": $.cookie("token")}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
    		console.log(jsonData);
    		
    		// 每个item添加属性pageType。
    		var itemPage = jsonData.result.itemPage;
    		for (var i = 0; item = itemPage[i]; i++) item.pageTypeAndNo = {"pageType": param("pageType"), "no": item.no};
    		
    		toView(jsonData,true);
    	}
	});
}

var pageTag = "";
//动态写入分页控件
function paginateInit() {
    var paginateHtml = '<input type="hidden" name="total" id="total" value=0>';
    paginateHtml += '<input type="hidden" name="offset" id="offset" value=0>';
    paginateHtml += '<input type="hidden" name="limit" id="limit" value=3>';
    paginateHtml += '<div class="row-fluid"><div id="page-nav" style="padding: 18px;"></div></div>';

    if (pageTag == "mySupplyPageTag") {
    	$("#supplyPaginate").html(paginateHtml);
    } else{
    	$("#supplyPaginate").html("");
    }	
}
//重置分页
_commit();
function _commit(){
	
   if(pageTag == "mySupplyPageTag") mySupplyPage();
   else {
	   itemPage();
   }   
   paginate();
};
//供应商列表
function mySupplyPage() {

	$.ajax({ 
		type: "post", 
		// @RequestMapping(value = "/mySupplyPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/mySupplyPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/mySupplyPage/{condition}/{sys}",
		data:{			
			"condition": {"nameLike": $$("nameLike").value},			
			"sys": {"offset": $$("offset").value, "limit": $$("limit").value, "token": $.cookie("token")}			
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

function addSupplyToItem(){
	$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/addSupplyToItem/{supplyId}/{partNo}/{itemId}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/addSupplyToItem/1/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/org/addSupplyToItem/{supplyId}/{partNo}",		        
		data:{
			"supplyId": $$("supplyId").value,	
			"partNo": $$("partNo").value,			 							
			"sys": {"token": $.cookie("token")}					
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {			
			var reqParams = {
					supplyId:  $$("supplyId").value,
					partNo:  $$("partNo").value,
				}
			var logMap = {};
			logMap.opName = "添加供应商到已认证物项";
			logMap.reqParams = JSON.stringify(reqParams);
			logMap.domain = "cert";
			logMap.action = "addSupplyToItem";
			logMap.reqURI = "supplyItemPage.html";
			
			if (!right(jsonData)) {
				logMap.status = "失败";
				makeBizLog(logMap);
				return;
			}
			logMap.status = "成功";
			makeBizLog(logMap);
			console.log((jsonData));			
			/*location.href = "/org/";*/			   
		}
	});
}
//按钮控制
locationItemPage();
function locationItemPage(){
	if(param("pageType") == "children") $("button[id='addSupply']").hide();
	if(param("pageType") == "pub") $("button[id='addSupply']").hide();
}
scretLvlChoise();
function scretLvlChoise(){
	if(param("pageType") == "pub") $("tr[id='scretLvl']").hide();
}