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
$("#corpId").val($.cookie("corpName"));
$("#managerName").val($.cookie("loginName"));
$("#managerId").val($.cookie("custId"));
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
function supplyChoiced() {
	var  name = $('#firstuserModal input:radio:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='managerName']").val(name);
	var id = $('#firstuserModal input:radio:checked').parent().parent().find("td [id='id']").text();
	$("input[id='managerId']").val(id)
	$("#firstuserModal").css("display","none");
}
function _custCommit(){
	var corpId = $$("aCorpId").value;
	 var itemDisplay = $("#userModal").css("display");
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


var total;
function _custsCommit(){
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


function makeProj(){
	var scretLvl = $('input[name="scretLvl"]:checked').val();
	var status = $('input[name="status"]:checked').val();
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
				"name": $$("name").value,
				"shortName": $$("shortName").value,
				"aCorpId": $$("aCorpId").value,
				"corpId": $.cookie("corpId"),
				"aManagerId": $$("aManagerId").value,
				"managerId": $$("managerId").value,
				"zip": $$("zip").value,
				"scretLvl": scretLvl,
				"tel": $$("tel").value,
				"addr": $$("addr").value,
				"status": status,
				"fax": $$("fax").value
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
					status: status,
					aCorpId: $$("aCorpId").value,
					corpId: $.cookie("corpId")
				}
			var newProMap = {};
			newProMap.opName = "创建项目";
			newProMap.reqParams = JSON.stringify(reqParams);
			newProMap.domain = "supply";
			newProMap.action = "makeProj";
			newProMap.reqURI = "newProj.html";
			if (!right(data)) {
				newProMap.status = "失败";
				makeBizLog(newProMap);
				return;
			}
			newProMap.status = "成功";
			makeBizLog(newProMap);
			console.log(data)
			tip("创建成功");
			location.href = "/iw/_supply/projPage.html";
		}
		
		
	});
}
