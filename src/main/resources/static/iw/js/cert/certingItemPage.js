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
$("#grpCateCode").change(function() {cateAllByGrpCode();});
//选择排序
var order="UPAT";
function orderBy(el,val){
	var Elvalue=(el.value);
	var Elname=(el.name);
	if(Elvalue == "UPAT" &&  Elname == "upat"){
		order = "UPAT";
		$("#upat").attr("class","btn btn-primary");
		$("#allCode").attr("class","btn btn-default");
		$("#itemNameCode").attr("class","btn btn-default");
		$("#upat").attr("name","upats")
	}if(Elvalue == "UPAT" && Elname == "upats"){
		order = "UPAT DESC";
		$("#upat").attr("class","btn btn-primary");
		$("#allCode").attr("class","btn btn-default");
		$("#itemNameCode").attr("class","btn btn-default");
		$("#upat").attr("name","upat")
	} 
	if(Elvalue == "CATECODE" && Elname == "allCode"){
		order = "CATECODE";
		$("#upat").attr("class","btn btn-default");
		$("#allCode").attr("class","btn btn-primary");
		$("#itemNameCode").attr("class","btn btn-default");
		$("#allCode").attr("name","allCodes")
	}if(Elvalue == "CATECODE" && Elname == "allCodes"){
		order = "CATECODE DESC";
		$("#upat").attr("class","btn btn-default");
		$("#allCode").attr("class","btn btn-primary");
		$("#itemNameCode").attr("class","btn btn-default");
		$("#allCode").attr("name","allCode");
	}
	if(Elvalue == "ITEMNAMECODE"  && Elname == "itemNameCode"){
		order = "ITEMNAMECODE";
		$("#upat").attr("class","btn btn-default");
		$("#allCode").attr("class","btn btn-default");
		$("#itemNameCode").attr("class","btn btn-primary");
		$("#itemNameCode").attr("name","itemNameCodes")
	}if(Elvalue == "ITEMNAMECODE" && Elname == "itemNameCodes"){
		order = "ITEMNAMECODE DESC";
		$("#itemNameCode").attr("name","itemNameCode")
		$("#upat").attr("class","btn btn-default");
		$("#allCode").attr("class","btn btn-default");
		$("#itemNameCode").attr("class","btn btn-primary");
		$("#itemNameCode").attr("name","itemNameCodes")
	}
	_commit();
}
var nameLike="NSN码";
function NamLikeValue(el){
	nameLike = $(el).text();
}
var url = "";
//待认证供应物项列表
function certingItemPage() {
	var scretLvl = $("input[name='idSelected']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	var supplyType = $("input[name='supplyType']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	var certStatus = $("input[name='certStatus']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	if(certStatus.length == 0){
		certStatus="认证中";
	}
    $.ajax({ 
    	type: "post", 
    	//@RequestMapping(value = "/certingItemPage/{condition}/{orderBy}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/cert/certingItemPage/condition;nameLike=;scretLvl=;cateGrpCode=;cateCode=;certStatus=/upat desc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/cert/certingItemPage/{condition}/{orderBy}/{sys}",
    	data:{
			"condition": { 
				"nameLike": nameLike == "物项名称" ? $$("nameLike").value : "",
				"nsnLike": nameLike == "NSN码" ? $$("nameLike").value : "",
				"supplyNameLike": nameLike == "供应商名称" ? $$("nameLike").value : "",
				"partNoLike": nameLike == "供应商零件码" ? $$("nameLike").value : "",
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
    		
    		var item = itemPage[0];
    		for (var i = 0; i<itemPage.length,item = itemPage[i]; i++){
    			
    			item.pageTypeAndNo = {"pageType": param("pageType"), "no": item.no};
    		}
    		//for (var i = 0; item = itemPage[i]; i++) item.pageTypeAndNo = {"pageType": param("pageType"), "no": item.no};
    		
    		toView(jsonData,true);
    	}
	});
}

var pageTag = "";

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
	   certingItemPage();
   }   
   paginate();
};
//供应商列表
function mySupplyPage() {

	$.ajax({ 
		type: "post", 
		// @RequestMapping(value = "/mySupplyPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/mySupplyPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/cert/mySupplyPage/{condition}/{sys}",
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
			logMap.reqURI = "certingItemPage.html";
			
			if (!right(jsonData)) {
				logMap.status = "失败";
				makeBizLog(logMap);
				return;
			}
			logMap.status = "成功";
			makeBizLog(logMap);
			   console.log(jsonData);			
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