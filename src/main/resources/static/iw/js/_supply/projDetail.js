var subProName = [];
var subproCorpId = "";
var subproId = "";
var projDetailStatus;
var contractId;
var corpName;
var aCorpName;
var aManagerId;
$(document).ready(function() {	
	$(".btn-link").on("click", function() {		
		if($(this).find("span.glyphicon-chevron-up").length>0){			
			$(this).find("span.glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
			$(this).parent().parent().parent().find(".panel-body").hide();
			$(this).parent().parent().parent().find(".panel-footer").hide();			
		}else if($(this).find("span.glyphicon-chevron-down").length>0){			
			$(this).find("span.glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");			
			$(this).parent().parent().parent().find(".panel-body").show();
			$(this).parent().parent().parent().find(".panel-footer").show();			
		}
	});
});
$
var projId="";
projDetail();

function _corpCommit(){
	 var itemDisplay = $("#firstPartyModal").css("display");
	    if(itemDisplay == 'none'){
	            $("input[id='corpPageName']").val("");
	    }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/corpPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/corpPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/corpPage/{condition}/{sys}",
		data:{
			"condition": {"nameLike":$$("corpPageName").value},			
	        "sys": {"offset": $$("corpOffset").value, "limit": $$("corpLimit").value,"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (data) {
			if (!right(data)) return;
			console.log(data);
			toView(data,true);
		}
	});
}
function corpPaginate() {
	if ($$("corpPage-nav")) {
		$("#corpPage-nav").pagination({
			items: $$("corpTotal").value, 
			itemsOnPage: $$("corpLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("corpOffset").value = $$("corpLimit").value * (pageIndex - 1);
				_corpCommit();
			}
		});
	}
}
function _corpSonCommit(){
	 var itemDisplay = $("#secondPartyModal").css("display");
	    if(itemDisplay == 'none'){
	            $("input[id='corpSonPageName']").val("");
	    }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/corpPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/corpPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/corpPage/{condition}/{sys}",
		data:{
			"condition": {"nameLike":$$("corpSonPageName").value},			
	        "sys": {"offset": $$("corpSonOffset").value, "limit": $$("corpSonLimit").value,"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (data) {
			if (!right(data)) return;
			console.log(data);
			toView(data,true);
			var total = data.result.corpTotal;
			$("#corpSonTotal").val(total);
		}
	});
}
function corpSonPaginate() {
	if ($$("corpSonPage-nav")) {
		$("#corpSonPage-nav").pagination({
			items: $$("corpSonTotal").value, 
			itemsOnPage: $$("corpSonLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("corpSonOffset").value = $$("corpSonLimit").value * (pageIndex - 1);
				_corpSonCommit();
			}
		});
	}
}

var supplyVal = "";
//被选中的单选按钮的值赋值给指定的Input.
function supplyChoice() {
	var  name = $('input:radio:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='aCorpName']").val(name);
	var s = $('input:radio:checked').parent().parent().find("td [id='id']").text();
	$("input[id='aCorpId']").val(s)
	$("#firstPartyModal").css("display","none");
}
//被选中的单选按钮的值赋值给指定的Input.
function supplyChoices() {
	var  name = $('#userModal input:radio:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='aManagerName']").val(name);
	var id = $('#userModal input:radio:checked').parent().parent().find("td [id='id']").text();
	$("input[id='aManagerId']").val(id)
	$("#userModal").css("display","none");
	$("#userModal").css("display","none");
}
//被选中的单选按钮的值赋值给指定的Input.
function supplyChoiceFa() {
	var  name = $('#firstuserModal input:radio:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='aManagerName']").val(name);
	var id = $('#firstuserModal input:radio:checked').parent().parent().find("td [id='id']").text();
	$("input[id='aManagerId']").val(id)
	$("#firstuserModal").css("display","none");
}
//被选中的单选按钮的值赋值给指定的Input.
function supplyChoiced() {
	var  name = $('#firstuserModal input:radio:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='managerName']").val(name);
	var id = $('#firstuserModal input:radio:checked').parent().parent().find("td [id='id']").text();
	$("input[id='managerId']").val(id)
	$("#firstuserModal").css("display","none");
}
//被选中的单选按钮的值赋值给指定的Input.
function supplyDetailChoice() {
	var  name = $('#userModal input:radio:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='itemName']").val(name);
	var id = $('#userModal input:radio:checked').parent().parent().find("td [id='id']").text();
	$("input[id='managerId']").val(id);
	$("#userModal").css("display","none");
}
//被选中的单选按钮的值赋值给指定的Input.
function supplyCorp() {
	var  name = $('#secondPartyModal input:radio:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='BCorpName']").val(name);
	var id = $('#secondPartyModal input:radio:checked').parent().parent().find("td [id='id']").text();
	$("input[id='BCorp']").val(id);
	$("#secondPartyModal").css("display","none");
}
function supplyCorpName() {
	var  name = $('#secondPartyUserModal input:radio:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='BCorpManagerName']").val(name);
	var id = $('#secondPartyUserModal input:radio:checked').parent().parent().find("td span[id='id']").text();
	$("input[id='BCorpManagerId']").val(id);
	$("#secondPartyUserModal").css("display","none");
}

//被选中的单选按钮的值赋值给指定的Input.
function supplyManager() {
	var  name = $('#secondPartyModal input:radio:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='BCorpName']").val(name);
	var id = $('#secondPartyModal input:radio:checked').parent().parent().find("td [id='id']").text();
	$("input[id='BCorp']").val(id);
	$("#secondPartyModal").css("display","none");
}



function _custCommit(){
	var corpId = $$("aCorpId").value;
	 var itemDisplay = $("#firstuserModal").css("display");
	    if(itemDisplay == 'none'){
	            $("input[id='custName']").val("");
	    }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/custByCorpIdPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/custByCorpIdPage/condition;corpId=1;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/custByCorpIdPage/{condition}/{sys}",
		data:{
			"condition": {
				"corpId":corpId,
				"nameLike": $$("custName").value},			
	        "sys": {"offset": $$("custOffset").value, "limit": $$("custLimit").value,"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData,true);
		}
	});
}

function custPaginate() {
	if ($$("custPage-nav")) {
		$("#custPage-nav").pagination({
			items: $$("custTotal").value,
			itemsOnPage: $$("custLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("custOffset").value = $$("custLimit").value * (pageIndex - 1);
				_custCommit();
			}
		});
	}
}

function _custSonCommit(){
	var corpId = $$("BCorp").value;
	 var itemDisplay = $("#secondPartyUserModal").css("display");
	    if(itemDisplay == 'none'){
	            $("input[id='NameId']").val("");
	    }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/custByCorpIdPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/custByCorpIdPage/condition;corpId=1;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/custByCorpIdPage/{condition}/{sys}",
		data:{
			"condition": {
				"corpId":corpId,
				"nameLike": $$("NameId").value},			
	        "sys": {"offset": $$("custSonOffset").value, "limit": $$("custSonLimit").value,"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			var total = jsonData.result.custTotal;
			$("#custSonTotal").val(total);
			toView(jsonData,true);
		}
	});
}

function custSonPaginate() {
	if ($$("custSonPage-nav")) {
		$("#custSonPage-nav").pagination({
			items: $$("custSonTotal").value,
			itemsOnPage: $$("custSonLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("custSonOffset").value = $$("custSonLimit").value * (pageIndex - 1);
				_custSonCommit();
			}
		});
	}
}


var total;
function _custsCommit(){
	var corpId = $$("aCorpId").value;
	 var itemDisplay = $("#userModal").css("display");
	    if(itemDisplay == 'none'){
	            $("input[id='custBName']").val("");
	    }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/custByCorpIdPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/custByCorpIdPage/condition;corpId=1;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/custByCorpIdPage/{condition}/{sys}",
		data:{
			"condition": {
				"corpId":$.cookie("corpId"),
				"nameLike": $$("custBName").value},			
	        "sys": {"offset": $$("custsOffset").value, "limit": $$("custsLimit").value,"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData,true);
			var total = jsonData.result.custTotal;
			$("#custsTotal").val(total);
		}
	});
}

function custsPaginate() {
	if ($$("custsPage-nav")) {
		$("#custsPage-nav").pagination({
			items: $$("custsTotal").value,
			itemsOnPage: $$("custsLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("custsOffset").value = $$("custsLimit").value * (pageIndex - 1);
				_custsCommit();
			}
		});
	}
}

function makeProject() {
	var subProjScretLvl = $('#subProjModal input[name="subProjScretLvl"]:checked').val();
	 projId = param("id");
	if(projId == null || projId == undefined || projId == "" ){
		projId = "";
	}
	$.ajax({
		type: "post",
		//	@RequestMapping(value = "/newMakeProj/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/newMakeProj/map;id=0;parentId=0;name=;shortName=;managerId=;scretLvl=;aCorpId=;zip=;aManagerId=;tel=;fax=;addr=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/newMakeProj/{condition}/{sys}",
		data:{
			"condition": {
				"id": "",
				"name": $$("sonName").value,
				"parentId": projId,
				"shortName": $$("sonShortName").value,
				"aManagerId": $$("aManagerId").value,
				"aCorpId": $$("aCorpId").value,
				"corpId": $.cookie("corpId"),
				"managerId": $$("managerId").value,
				"zip": $$("sonZip").value,
				"scretLvl": subProjScretLvl,
				"tel": $$("sonTel").value,
				"addr": $$("sonAddr").value,
				"fax": $$("sonFax").value
				},			
	        "sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (data) {
			var reqParams = {
					name: $$("name").value,
					scretLvl: scretLvl,
					aCorpId: $$("aCorpId").value,
					corpId: $.cookie("corpId")
				}
			var projDetailSonMap = {};
			projDetailSonMap.opName = "创建子项目";
			projDetailSonMap.reqParams = JSON.stringify(reqParams);
			projDetailSonMap.domain = "supply";
			projDetailSonMap.action = "newMakeProj";
			projDetailSonMap.reqURI = "projDetail.html";
			if (!right(data)) {
				projDetailSonMap.status = "失败";
				makeBizLog(projDetailSonMap);
				return;
			}
			projDetailSonMap.status = "成功";
			makeBizLog(projDetailSonMap);
			console.log(data)
			if ($$("sonName").value = null) tip();
			// window.location.reload();
		}
	});
}

function makeProj(){
	var scretLvl = $('input[name="projDetail.scretLvl"]:checked').val();
	if(param("no") == "" || param("no") == null || param("no") == undefined){
		param("no","");		
	}
	if(param("id") == "" || param("id") == null || param("id") == undefined){
		param("id","");
	}
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/makeProj/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeProj/map;id=0;parentId=0;name=;shortName=;managerId=;scretLvl=;aCorpId=;zip=;aManagerId=;tel=;fax=;addr=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/makeProj/{condition}/{sys}",
		data:{
			"condition": {
				"no": param("no"),
				"id": param("id"),
				"name":$$("name").value,
				"shortName":$$("shortName").value,
				"aCorpId":$$("aCorpId").value,
				"corpId": param("no") == "" ? $.cookie("corpId") : corpId,
				"aManagerId":$$("aManagerId").value,
				"managerId":$$("managerId").value,
				"zip":$$("zip").value,
				"scretLvl":scretLvl,
				"tel":$$("tel").value,
				"addr":$$("addr").value,
				"fax":$$("fax").value
				},			
	        "sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (data) {
			var reqParams = {
					name: $$("name").value,
					scretLvl: scretLvl,
					aCorpId: $$("aCorpId").value,
					corpId: param("no") == "" ? $.cookie("corpId") : corpId
				}
			var projDetailReviseMap = {};
			projDetailReviseMap.opName = "修改项目";
			projDetailReviseMap.reqParams = JSON.stringify(reqParams);
			projDetailReviseMap.domain = "supply";
			projDetailReviseMap.action = "makeProj";
			projDetailReviseMap.reqURI = "projDetail.html";
			if (!right(data)) {
				projDetailReviseMap.status = "失败";
				makeBizLog(projDetailReviseMap);
				return;
			}
			projDetailReviseMap.status = "成功";
			makeBizLog(projDetailReviseMap);
			console.log(data)
			tip("修改成功")
		}
		
		
	});
}

var parentStatus, subInvtStatus, parentId, corpId, subCorpId, aCorpId, scretLvl, disctSalePrice;

function projDetail(){
	if (!param("no")) return;
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/projDetail/{projNo}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/projDetail/asfaswesadfasfsdd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/projDetail/{projNo}/{sys}",
		data:{
			"projNo": param("no"),
				
	        "sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			projDetailStatus = jsonData.result.projDetail.status;
			contractId =  jsonData.result.projDetail.contractId;
			parentStatus = jsonData.result.projDetail.status;
			subInvtStatus = jsonData.result.subInventories.status;
			projId = jsonData.result.projDetail.id;
			parentId = jsonData.result.projDetail.parentId;
			aManagerName = jsonData.result.projDetail.aManagerName;
			disctSalePrice = jsonData.result.projDetail.disctSalePrice;
			managerName = jsonData.result.projDetail.managerName;
			managerName = jsonData.result.projDetail.managerName;
			corpName = jsonData.result.projDetail.corpName;
			aCorpName = jsonData.result.projDetail.aCorpName;
			scretLvl = jsonData.result.projDetail.scretLvl;
			aCorpId = jsonData.result.projDetail.aCorpId;
			corpId = jsonData.result.projDetail.corpId;
			subCorpId = jsonData.result.subProjs.corpId;
			aManagerId = jsonData.result.projDetail.aManagerId;
			
			if(parentId > 0)
				$(".showOrHideTheSecondCorp").hide();
			
			toView(jsonData,true);			
		}
	});
}
function _hisSupplyItemCommit(){
	var keyWord = $("#subProSelect option:selected").text();
	 var hisSupply = $("#matingModal").css("display");
	    if(hisSupply == 'none'){
	            $("input[id='keyWord']").val("");
	    }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/hisSupplyItemPage/{corpId}/{condition}/{orderBy}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/hisSupplyItemPage/condition;nsn=1421-86-0000001;nameLike=;partNo=;/upat desc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/hisSupplyItemPage/{corpId}/{condition}/{orderBy}/{sys}",
		data:{
			"corpId": $.cookie("corpId"),
			"condition":{"nsn": keyWord == "NSN" ? $$("keyWord").value : "",
					     "nameLike": keyWord == "名称" ? $$("keyWord").value : "",                                               
					     "partNoLike": keyWord == "零件号" ? $$("keyWord").value : "",
			},
		    "orderBy": "upat desc",
	        "sys": {"offset": $$("hisSupplyItemOffset").value, "limit": $$("hisSupplyItemLimit").value,"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			
			if (!right(jsonData)) return;
			console.log(jsonData);
			mySupplyTotal = jsonData.result.total;
			toView(jsonData,true);
			
		}
	});
}
function hisSupplyItemPaginate() {
	if ($$("hisSupplyItemPage-nav")) {
		$("#hisSupplyItemPage-nav").pagination({
			items: mySupplyTotal,
			itemsOnPage: $$("hisSupplyItemLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("hisSupplyItemOffset").value = $$("hisSupplyItemLimit").value * (pageIndex - 1);
				_hisSupplyItemCommit();
			}
		});
	}
}

var subParentId = "";
function createProjSub(el) {
	$("input[name='subproCorpId']").remove();
    $("input[name='subproId']").remove();
    $("span[id='subProName']").remove();
   $("input:radio[name='subproj']").remove();
	for(var i = 0; i < subProName.length; i++) {
		var subProTemplate = "<label class='radio' >" +
		"<input type='hidden' name='subproCorpId' value='"+ subProName[i].corpId +"'/>"  +
		"<input type='hidden' name='subproId' value='"+ subProName[i].id +"'/>"  +
		"<input type='radio' checked='checked' id='thisSubproj' name='subproj' value='"+ subProName[i].name +"'/> " + "<span id=subProName>" + subProName[i].name + "<span/>" +
		" </label>";
		$("#subprojRadio").append(subProTemplate);	
		
	} 
	$("#subProjMatingModal input:eq(2)").attr("checked",true);
	subParentId = $(el).parent().parent().find("input[name='id']").val();
}

function cleanInput() {
	var subProjModal = $("#subProjModal").css("display");
	if(subProjModal == "none"){
		$("#subProjModal input").val("");
	}
}

function createSubInventorySon(){
	
	var supplyItemId = $('#subProjMatingModal tr input:radio:checked').parent().parent().find("input[id='supplyItemId']").val();
	var nums = $('#subProjMatingModal tr input:radio:checked').parent().parent().find("input[id='num']").val();
	var price = $('#subProjMatingModal tr input:radio:checked').parent().parent().find("input[id='makePrice']").val();
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/createInventory/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/createInventory/map;parentId=0;projId=1;supplyItemId=1;num=10;totalPrice=1000.50/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/createInventory/{map}/{sys}",
		data:{
			"map": {
				"parentId": subParentId,
				"projId": subproId,
				"supplyItemId": supplyItemId,
				"num": nums,
				"totalPrice": price
				},			
	        "sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (data) {
			if (!right(data)) return;
			console.log(data);
			window.location.reload();
			
		}
	});
}

function _hisSupplyItemsCommit(){
	subproId = $("#subprojRadio").find("input[name='subproj']:checked").parent().find("input[name='subproId']").val();
    
	subproCorpId = $("#subprojRadio").find("input[name='subproj']:checked").parent().find("input[name='subproCorpId']").val();
	
	var keyWord = $("#newSubProSelect option:selected").text();
	 var hisSupply = $("#subProjMatingModal").css("display");
	    if (hisSupply == 'none'){
	            $("input[id='newKeyWord']").val("");	            
	    };
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/hisSupplyItemPage/{corpId}/{condition}/{orderBy}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/hisSupplyItemPage/condition;nsn=1421-86-0000001;nameLike=;"partNoLike=;"/upat desc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/hisSupplyItemPage/{corpId}/{condition}/{orderBy}/{sys}",
		data:{
			"corpId": subproCorpId,
			"condition":{
				         "nsn": keyWord == "NSN" ? $$("newKeyWord").value : "",
					     "nameLike": keyWord == "名称" ? $$("newKeyWord").value : "",                                               
					     "partNoLike": keyWord == "零件号" ? $$("newKeyWord").value : "",
			},
		    "orderBy": "upat desc",
	        "sys": {"offset": $$("hisSupplyItemsOffset").value, "limit": $$("hisSupplyItemsLimit").value,"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			hisSupplyItemsTotal = jsonData.result.total;
			toView(jsonData,true);
			
		}
	});
}
function hisSupplyItemsPaginate() {
	if ($$("hisSupplyItemsPage-nav")) {
		$("#hisSupplyItemsPage-nav").pagination({
			items: hisSupplyItemsTotal,
			itemsOnPage: $$("hisSupplyItemsLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("hisSupplyItemsOffset").value = $$("hisSupplyItemsLimit").value * (pageIndex - 1);
				_hisSupplyItemsCommit();
			}
		});
	}
}


//项目流标
function failProj(el) {	
	var no = $(el).parent().parent().find("input[name='no']").val();	
	if (confirm("是否确认流标？")){
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/failProj/{no}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/failProj/asdfaskwe23sd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/failProj/{no}/{sys}",
		data:{
			"no": no,			
	        "sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			var reqParams = {
					no: no,
					name:$$("name").value
				}
			var projDetailFaillMap = {};
			projDetailFaillMap.opName = "流标";
			projDetailFaillMap.reqParams = JSON.stringify(reqParams);
			projDetailFaillMap.domain = "supply";
			projDetailFaillMap.action = "failProj";
			projDetailFaillMap.reqURI = "projDetail.html";
			if (!right(jsonData)) {
				projDetailFaillMap.status = "失败";
				makeBizLog(projDetailFaillMap);
				return;
			}
			projDetailFaillMap.status = "成功";
			makeBizLog(projDetailFaillMap);
			console.log(jsonData)
			window.location.reload();
		}
	});
	}
}	

function projPageHref(el) {
	
	var no = $(el).parent().find("input[name='no']").val();
	var id = $(el).parent().find("input[name='id']").val();
	location.href = "./subProjDetail.html?id=" + id + "&&no=" + no +"&&parentStatus=" + parentStatus;
}

var hrefCntract ;
function newCntract() {
	location.href = '/iw/supply/newCont.html?projId=' + projId + "&&aManagerName="+
	aManagerName + "&&managerName=" + managerName + "&&parentId=" + parentId+ "&&disctSalePrice=" + disctSalePrice;
}

function contractDetail(el){
	
	var contract = $(el).parent().parent().find("input[name='contractId']").val();
	
	if (contract == null || contract == undefined || contract == "")
		location.href = '/iw/supply/contDetail.html?id=' + contractId;
	
	else
		
		location.href = '/iw/supply/subContDetail.html?id=' + contract;
}

//打折项目供应总价
function disctProjPrice(el) {
	var no,disctSupplyPrice;
	no = $(el).parent().parent().find("[name='no']").val();
	disctPrice = $(el).parent().parent().find("input[name='disctPrice']").val();
	
	if (disctPrice == "" || disctPrice == null) {
		tip("请输入供应折扣价");
		return;
	};
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/disctProjPrice/{no}/{disctSupplyPrice}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/disctProjPrice/asdfaskwe23sd/100000.85/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/disctProjPrice/{no}/{disctPrice}/{sys}",
		data:{
			"no": no,
			"disctPrice": disctPrice,
	        "sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);	
			window.location.reload();
		}
	});
	
}

function make() {
	var type = "供应合同";
	location.href = "/iw/_supply/newSuppCont.html?corpId="+ corpId + "&&aCorpId=" + aCorpId + "&&typ=" + type + "&&aCorpName=" + aCorpName + "&&corpName=" + corpName + "&&projId=" + projId;
}

function makeContract() {
		var type = "采购合同";
		location.href = "/iw/_supply/newCont.html?aCorpId=" + aCorpId + "&&typ=" + type + "&&aCorpName=" + aCorpName + "&&aManagerName=" + aManagerName + "&&projId=" + projId + "&&corpId=" + corpId + "&&aManagerId=" + aManagerId;	
}
