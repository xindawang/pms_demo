var aCorpName = param("corpName");
var aManagerName = param("managerName");
$("#aCorp").val(aCorpName);
$("#aManagerName").val(aManagerName);
//新建
function newMakeContract() {
     
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/newMakeContract/{contract}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/newMakeContract/contract;projId=0;contractNo=123456;name=asdfasd;signAt=;regAt=;effectAt=;price;corpId=;aCorpId=;typ=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/newMakeContract/{contract}/{sys}",
		data:{
			"contract": {
				"projId": param("projId"),
				"contractNo": $$("contractNo").value,
				"name": $$("name").value,
				"signAt": $$("signAt").value,	
				"regAt": $$("regAt").value,	
				"effectAt": $$("effectAt").value,
				"price": $$("totalSalePrice").value,
				"corpId": $$("corpId").value,
				"managerId": $$("managerId").value,
				"aCorpId": param("corpId"),
				"aManagerId": param("managerId"),
				"typ": param("typ"),
				
			},				
			"sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			var reqParams = {
					contractNo: $$("contractNo").value,
					name: $$("name").value,
					aCorpId: param("aCorpId"),
					corpId: $$("corpId").value
				}
			var newContMap = {};
			newContMap.opName = "添加采购合同";
			newContMap.reqParams = JSON.stringify(reqParams);
			newContMap.domain = "supply";
			newContMap.action = "newMakeContract";
			newContMap.reqURI = "newCont.html";
			if (!right(jsonData)) {
				newContMap.status = "失败";
				makeBizLog(newContMap);
				return;
			}
			newContMap.status = "成功";
			makeBizLog(newContMap);
			console.log(jsonData)
			location.href = "/iw/_supply/subProjDetail.html?id=" + param("projId") + "&&no=" + param("no");
		}
	});
}
//列表渲染
function _corpCommit(){
	var corpModal = $("#corpModal").css("display");
    if(corpModal == 'none'){
            $("input[id='nameLike']").val("");
    }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/corpPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/corpPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/corpPage/{condition}/{sys}",
		data:{
			"condition": {"nameLike":$$("nameLike").value},			
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
//分页控件
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
//列表渲染
function _custCommit(){
	var userModal = $("#userModal").css("display");
    if(userModal == 'none'){
            $("input[id='custName']").val("");
    }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/custByCorpIdPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/custByCorpIdPage/condition;corpId=1;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/custByCorpIdPage/{condition}/{sys}",
		data:{
			"condition": {
				"corpId": $$("corpId").value,
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
//分页控件
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

var supplyVal = "";
//被选中的单选按钮的值赋值给指定的Input.
function supplyChoice() {
	var  name = $('input[name="corpPageRadio"]:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='corpName']").val(name);
	var corpId = $('input[name="corpPageRadio"]:checked').parent().parent().find("td [id='id']").text();
	$("input[id='corpId']").val(corpId)
	$("#corpModal").css("display","none");
}
function newSupplyChoices() {
	var  name = $('input[name="custPageRadio"]:checked').parent().parent().find("td span[name='name']").text();
	$("input[id='managerName']").val(name);
	var corpId = $('input[name="custPageRadio"]:checked').parent().parent().find("td [id='id']").text();
	$("input[id='managerId']").val(corpId)
	$("#userModal").css("display","none");
}