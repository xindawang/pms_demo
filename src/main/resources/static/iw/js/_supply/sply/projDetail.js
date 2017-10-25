var subProName = [];
var subproCorpId = "";
var subproId = "";
var projDetailStatus;
var contractId;
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
	var FistBCorp = $$("aCorpId").value; 
	var managerId = $$("managerId").value; 
	if(FistBCorp == "" || FistBCorp == null || FistBCorp == undefined){
		FistBCorp = $.cookie("custId");
	}
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/makeProj/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeProj/map;id=0;parentId=0;name=;shortName=;managerId=;scretLvl=;aCorpId=;zip=;aManagerId=;tel=;fax=;addr=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/makeProj/{condition}/{sys}",
		data:{
			"condition": {
				"id": "",
				"name": $$("sonName").value,
				"parentId": projId,
				"shortName": $$("sonShortName").value,
				"aManagerId": managerId,
				"aCorpId": $.cookie("corpId"),
				"corpId": $$("BCorp").value,
				"managerId": $$("BCorpManagerId").value,
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
			if (!right(data)) return;
			if ($$("sonName").value = null) tip();
			console.log(data);
			window.location.reload();
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
			if (!right(data)) return;
			console.log(data);
			 location.href = "/iw/supply/projPage.html";
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
			scretLvl = jsonData.result.projDetail.scretLvl;
			aCorpId = jsonData.result.projDetail.aCorpId;
			corpId = jsonData.result.projDetail.corpId;
			subCorpId = jsonData.result.subProjs.corpId;
			
			if(parentId > 0)
				$(".showOrHideTheSecondCorp").hide();
			
			toView(jsonData,true);			
			
			for (var i = 0; i < jsonData.result.subProjs.length; i++){
				subProName.push({"id": jsonData.result.subProjs[i].id,"name": jsonData.result.subProjs[i].name,"corpId": jsonData.result.subProjs[i].corpId});
			}
	
			var subProjs = jsonData.result.projDetail.subProjs;
			
			// if (subProjs == 0) return;
			
			// 展开所有一级配套表下的二级配套表
			var inventories = jsonData.result.inventories;
			var subInventories = jsonData.result.subInventories;

			// 按照一级配套表的id对二级配套表分组
			var subInvGrp = {};
			for (var i = 0; inv = inventories[i]; i++) {
				subInvGrp[inv.id] = [];
			}
			
			for (var j = 0; subInv = subInventories[j]; j++) {
				subInvGrp[subInv.parentId].push(subInv);
			}
			
			// 根据一级配套表找到其对于tr行，并在其下append所有的该一级配套表的二级配套表
			var invTr;
			var template = "<tr data-parent='#{parentId}'><input type='hidden' value=#{id} name='id'/> <input type='hidden' name='parentId' value=#{parentId}>" +
					       	  	"<td>" +
						       	  	"<div class='tree-node tree-root-one tree node-last'>" +
						       	  	"<input type='hidden' name='no' value='#{no}'/>" +
						       	  	"<span class='tree-indent'></span><span class='tree-indent'></span><span class='tree-icon tree-file'></span>" +
						       	  	"<span class='tree-title' name='itemName'>#{itemName}</span></div>" +
					       	  	"</td>" +
								"<td name='nsn'>#{nsn}</td>" +
								"<td name='partNo'>#{partNo}</td>"+
								"<td name='status'>#{status}</td>"+
								"<td class='text-right numberHover' >	" +
									"<span  class='number' name='num'>#{num}</span>" +
									"<input type='text' name='num'  class='form-control'/>" +
								"</td>" +
								"<td class='text-right moneyHover' >" +
									"<span  name='totalPrice' class='money'>#{totalPrice}</span>" +
									"<input type='text' name='totalPrice' value='#{totalPrice}' class='form-control'/>" +
								"</td>" ;
			var templateClone = template;
			
			for (var invIdKey in subInvGrp) {
				
				if (subInvGrp[invIdKey].length == 0) continue;
				
				invTr = $("tr[name='inventoriesTemplate']:visible input[value=" + invIdKey + "]").parent();
				
				for (var i = 0; subInv = subInvGrp[invIdKey][i]; i++) {
					if (subInv.id == null) subInv.id = "";
					if (subInv.parentId == null) subInv.parentId = "";
					if (subInv.no == null) subInv.no = "";
					if (subInv.itemName == null) subInv.itemName = "";
					if (subInv.nsn == null) subInv.nsn = "";
					if (subInv.num == null) subInv.num = "0";
					if (subInv.totalPrice == null) subInv.totalPrice = "0";
					if (subInv.partNo == null) subInv.partNo = "";
					
					template = template.replaceAll("#{status}", subInv.status);
					template = template.replaceAll("#{id}", subInv.id);
					template = template.replaceAll("#{parentId}", subInv.parentId);
					template = template.replaceAll("#{no}", subInv.no);
					template = template.replaceAll("#{itemName}", subInv.itemName);
					template = template.replaceAll("#{nsn}", subInv.nsn);
					template = template.replaceAll("#{num}", subInv.num);
					template = template.replaceAll("#{totalPrice}", subInv.totalPrice);
					template = template.replaceAll("#{partNo}", subInv.partNo);
					
					if(parentStatus != "已生成合同") {
						if (corpId == $.cookie("corpId")&& subInv.status == "待确认价格") {
							template += 
								"<td>" +
								"<button type='button' class='btn btn-danger ' onclick='delInventory(this)'>" +
								"<span class='glyphicon glyphicon-remove'></span> 删除子项目配套表" +
								"</button>" +
								" 	<button type='button' class='btn btn-default ' onclick='modInventoryNum(this)' name='modifyNum' >"  +
								" 	<span class='glyphicon glyphicon-saved'></span> 保存数量 "  +
								" 	</button> "+
								"<button type='button' class='btn btn-default'  value='true' onclick='confirmTotalPrice(this)' name='agreePrice' >     "
									+ " 	<span class='glyphicon glyphicon-ok'></span> 同意价格  "
									+ " </button>	                                                                                      "
									+ " <button type='button' class='btn btn-danger ' value='false' onclick='confirmTotalPrice(this)'  name='refusePrice' >     "
									+ " 	<span class='glyphicon glyphicon-minus-sign'></span> 拒绝价格"
									+ " </button>" + "</td>" + "</tr>";
						} else {
							template += 
								"<td>" +
								"<button type='button' class='btn btn-danger ' onclick='delInventory(this)'>" +
								"<span class='glyphicon glyphicon-remove'></span> 删除子项目配套表" +
								"</button>" +
								" 	<button type='button' class='btn btn-default ' onclick='modInventoryNum(this)' name='modifyNum' >"  +
								" 	<span class='glyphicon glyphicon-saved'></span> 保存数量 "  +
								" 	</button>" +
								"</td>" + "</tr>";
						}
					} else 
						template += "</td>" + "</tr>";
					invTr.after(template);
					template = templateClone;
				}
			}
			
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
//创建配套表
function createInventory(){
	var supplyItemId = $('input:radio:checked').parent().parent().find("input[id='supplyItemId']").val();
	var num = $('input:radio:checked').parent().parent().find("input[id='num']").val();
	var totalPrice = $('input:radio:checked').parent().parent().find("input[id='makePrice']").val()
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/createInventory/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/createInventory/map;parentId=0;projId=1;supplyItemId=1;num=10;totalPrice=1000.50/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/createInventory/{map}/{sys}",
		data:{
			"map": {
				"parentId": "",
				"projId": param("id"),
				"supplyItemId": supplyItemId,
				"num": num,
				"totalPrice": totalPrice
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

function changeIcon(el, val){
	if(val == 0) 
	  $(el).after("<span class='tree-indent'></span><span class='tree-icon tree-file'></span>")
	if(val > 0) {
		var id = $(el).parent().parent().parent().find("input[name='id']").val();
		$(el).parent().parent().parent().attr("data-id", id);
		var no =  $(el).parent().find("div[name='no']").text();
		var template = $(el).parent().parent().parent().clone();
		$(el).after("<span class='tree-hit tree-expanded'></span><span class='tree-icon tree-folder tree-folder-open'></span>")
		template.attr("name", no + "Template")
		template.find("[name='subInventories']").after("<span class='tree-indent'></span><span class='tree-indent'></span><span class='tree-icon tree-file'></span>")
		$(el).parent().parent().parent().after(template);
	}
		
}


function subInventories(no){
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/subInventories/{inventoryNo}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/subInventories/sdfasdfasdkasdq223/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/subInventories/{inventoryNo}/{sys}",
		data:{
			"inventoryNo": no,
	        "sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData)
			var array1 = [];
			for(var i = 0; i < jsonData.result.subInventories.length; i++){
				array1[i] = jsonData.result.subInventories[i];
			}
			var result = {"status": "succ"};
			result["result"] = {}
			result["result"][no] = array1;
			console.log(result)
			toView(result, true);
			
		}
	});
}
//删除子项目配套表
function delInventory(el){
	var no = $(el).parent().parent().find("input[name='no']").val();
	$.ajax({
	    //@RequestMapping(value = "/delInventory/{no}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/delInventory/12/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		type: "post",
		url: apphost() + "/ils/supply/delInventory/{no}/{sys}",
		data:{
			"no": no,
	        "sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
		window.location.reload();
		}
	});
}

//控制按钮
function  modNumPriceButton(el,val) {
	if(parentStatus != "已生成合同") {
		var parentId = $(el).parent().find("input[name='parentId']").val();	
		if (parentId == 0) {
			$(el).parent().find("button[name='modifyPrice']").show();
			$(el).parent().find("button[name='modifyNum']").show();
		} else {
			if (aCorpId == $.cookie("corpId") && parentId > 0) {
				$("[name=modifyNum]").show();
				if(val == "待确认价格"){
					$(el).parent().find("button[name='agreePrice']").show();
					$(el).parent().find("button[name='refusePrice']").show();
				}
			} 
			else if (parentId > 0 && corpId == $.cookie("corpId")) {
				if(val == "待确认数量"){
					$(el).parent().find("button[name='agreeNum']").show();
					$(el).parent().find("button[name='refuseNum']").show();
				}else if(val == "已确认数量" || val == "待报价" || val == "待确认价格" || val == "已确认"){
					$(el).parent().find("button[name='modifyPrice']").show();
				}
			}
		}
	} else 
		 $(el).parent().find("td:last").hide();	
	valueToWithNoFunc(el,val);
}
//同意数量
function confirmNum(el){
	var no = $(el).parent().parent().find("input[name='no']").val();
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/confirmNum/{no}/{agreed}/{sys}", produces = "text/plain")
		// 只有一级项目才关心totalSalePrice的值
		// http://localhost:81/ils/org/confirmNum/asdfdsafsadf/true/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/confirmNum/{no}/{agreed}/{sys}",
		data:{
			"no": no,
			"agreed": $(el).val(),
			"sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			tip(jsonData.result.err);
		}
	});
	window.location.reload();
}

//保存数量
function modInventoryNum(el){
	var num = $(el).parent().parent().find("input[name='num']").val();	
	var no = $(el).parent().parent().find("input[name='no']").val();
	if(num == "") {
		num = $(el).parent().parent().find("span[name='num']").text();
	}
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/modInventoryNum/{no}/{num}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/modInventoryNum/asdfaskwe23sd/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/modInventoryNum/{no}/{num}/{sys}",
		data:{
			"no": no,
			"num": num,
			"sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			tip(jsonData.result.err);
		}
	});
	window.location.reload();
}
//修改配套表价格
function modInventoryTotalPrice(el){
	var no = $(el).parent().parent().find("input[name='no']").val();
	var price = $(el).parent().parent().find("input[name='totalPrice']").val();	
	if (price == ""){
		 price = $(el).parent().parent().find("span[name='totalPrice']").text();
	}
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/modInventoryTotalPrice/{no}/{price}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/modInventoryTotalPrice/asdfaskwe23sd/100000.85/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/modInventoryTotalPrice/{no}/{price}/{sys}",
		data:{
			"no": no,
			"price":price,
			"sys": {"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			tip(jsonData.result.err);
		}
	});
	window.location.reload();
}
//确认价钱
function confirmTotalPrice(el) {
	var no = $(el).parent().parent().find("input[name='no']").val();
	$.ajax({
		type: "post",
		//	@RequestMapping(value = "/confirmTotalPrice/{no}/{agreed}/{sys}", produces = "text/plain")
		// 只有一级项目才关心totalSalePrice的值
		// http://localhost:81/ils/org/confirmTotalPrice/asdfdsafsadf/true/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/confirmTotalPrice/{no}/{agreed}/{sys}",
		data:{
			"no": no,
			"agreed": $(el).val(),
			"sys": {"token":$.cookie("token")}		
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			tip(jsonData.result.err);
		}
	});
	window.location.reload();
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
			if (!right(jsonData)) return;
			console.log(jsonData);
			window.location.reload();
		}
	});
	}
}	
//判断状态隐藏流标按钮	
function myProjStatus(el,val){
	if (val == "已询价" && projDetailStatus == "已生成合同") {
		
		$(el).parent().find("button[name='conract']").show();
	}
	if ($(el).parent().find("input[name='contractId']").val() > 0) {
		$(el).parent().find("button[name='projectConracts']").show();
	}
	if (val == "已流标" || val == "已生成合同" || val == "折价待确认" || val == "折扣已拒绝") {
		
		$(el).parent().find("button[name='myProjStatus']").hide();
	}
	
	if(val == "已询价" || val == "折价待确认" || val == "折扣已拒绝")
		$(el).parent().find("button[name='disctProjPriceDisPlay']").show();
		
	valueToWithNoFunc(el,val);
}
contractButton();
function contractButton() {
	if (param("parentStatus") == "已生成合同") {
			$("#createContact").show();
	}else if (parentId == 0 && parentStatus == "已询价") {
			$("#createContact").show();
	}
	if (contractId > 0) {
		$("#btnContact").show();
	}
}

function projPageHref(el) {
	var no = $(el).parent().find("input[name='no']").val();
	var id = $(el).parent().find("input[name='id']").val();
	location.href = "/iw/supply/projDetail.html?id=" + id + "&&no=" + no +"&&parentStatus=" + parentStatus;
}

var hrefCntract ;
function newCntract() {
	location.href = '/iw/supply/newCont.html?projId=' + projId + "&&aManagerName="+
	aManagerName + "&&managerName=" + managerName + "&&parentId=" + parentId+ "&&disctSalePrice=" + disctSalePrice;
}
function newSubCntract(el) {
	var aManagerName = $(el).parent().parent().find("td[name='aManagerName']").text();
	var managerName = $(el).parent().parent().find("td[name='managerName']").text();
	var parentId = $(el).parent().parent().find("input[name='parentId']").val();
	projId = $(el).parent().parent().find("input[name='id']").val();
	location.href = '/iw/supply/newCont.html?projId=' + projId + "&&aManagerName=" + aManagerName + "&&managerName=" + managerName + "&&parentId=" + parentId;  
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
