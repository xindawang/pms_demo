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
_commit();
var url = "";
//供应物项列表
function _commit() {
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
    	// http://localhost:81/ils/cert/certedItemPage/condition;nsn=1421-86-0000001/upat desc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	// http://localhost:81/ils/cert/certedItemPage/condition;nameLike=;scretLvl=;cateGrpCode=;cateCode=;certStatus=/upat desc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/cert/certedItemPage/{condition}/{orderBy}/{sys}",
    	data:{
			"condition": { 
				"nameLike": nameLike == "物项名称" ? $$("nameLike").value : "",
				"nsnLike": nameLike == "NSN码" ? $$("nameLike").value : "",
				"scretLvl": scretLvl,
				"cateGrpCode": $$("grpCateCode").value,
				"cateCode":  $$("cateCode").value,
				/*"supplyType": supplyType,*/
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
    		for (var i = 0; item = itemPage[i]; i++) item.pageTypeAndNo = {"pageType": param("pageType"), "no": item.no};
    		
    		toView(jsonData,true);
    	}
	});
}

/*//供应商列表
function _supplyCommit() {

	$.ajax({ 
		type: "post", 
		// @RequestMapping(value = "/mySupplyPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/mySupplyPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/mySupplyPage/{condition}/{sys}",
		data:{			
			"condition": {"nameLike": $$("nameLike").value},
			"sys": {"offset": $$("supplyOffset").value, 
				"limit": $$("supplyLimit").value, 
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
}*/
/*function addSupplyToItem(){
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
			if (!right(jsonData)) return;
			   console.log(jsonData);			
			location.href = "/org/";			   
		}
	});
}*/
	if(param("pageType") == "children") $("button[id='addSupply']").hide();
	if(param("pageType") == "pub") $("button[id='addSupply']").hide();
	if(param("pageType") == "pub") $("tr[id='scretLvl']").hide();
