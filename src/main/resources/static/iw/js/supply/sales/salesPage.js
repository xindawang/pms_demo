//排序方式
var orderDefault = "CONTRACTNUM";
//CONTRACTNO(项目名称)  CONTRACTNO DESC(名称倒序)  PROJNAME(出口合同编号)  PROJNAME DESC(编号倒序)
function orderBy(el, val) {

	var elValue = $(el).attr("value");

	if (elValue == "CONTRACTNUM" || elValue == "CONTRACTNO DESC") {
		$("#CONTRACTNO").attr("class", "btn btn-primary");
		$("#PROJNAME").attr("class", "btn btn-default");
	}
	if (elValue == "PROJNAME" || elValue == "PROJNAME DESC") {
		$("#CONTRACTNO").attr("class", "btn btn-default");
		$("#PROJNAME").attr("class", "btn btn-primary");
	} 
	orderDefault = elValue;
	console.log(orderDefault);
	if (orderDefault == "CONTRACTNUM" || orderDefault == "PROJNAME" ){
		console.log(1)
		$(el).attr("value", orderDefault + " DESC");
	}else{
		console.log(2)
		$(el).attr("value", orderDefault.replace(" DESC", ""));
	}
	orderDefault = $(el).attr("value");
	_commit();
}

//获取默认每页显示个数
var limit = $("#limit").val();
//进入页面请求
_commit();
function _commit() {
	$.ajax({
	    type : "post",
	    // @RequestMapping(value = "/contractPage/{condition}/{orderBy}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/contractPage/condition;projId=;nameLike=/CONTRACTNO/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/contractPage/{condition}/{orderBy}/{sys}",		        
		data:{
			"condition": { 
				"projId": "",
				"nameLike":$("#nameLike").val()
			},
			"orderBy":orderDefault,
			"sys": {
				"offset": $("#offset").val(),
				"limit": limit, 
				"token": $.cookie("token")
			}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   console.log(jsonData);
			   toView(jsonData, true);
		}
	});
}

//分页
function paginate(el) {
	if ($$("page-nav")) {
		$("#page-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("offset").value = $$("limit").value * (pageIndex - 1);

				_commit();
			}
		});
	}
}

//跳转到toProjContractDetail.html并传参数
function contractDetail(el) {
	var id = $(el).parent().parent().find("input[name='id']").val();
	var projId = $(el).parent().parent().find("input[name='projId']").val();
	window.location.href = "/iw/supply/sales/outContractDetail.html?projId=" + projId + "&&id=" + id;
}

//跳转到projContractPage.html并传参数
function toProjContractPage(el) {
	var id = $(el).find("input[name='projId']").val();
	var projName = $(el).text();
	location.href = "/iw/supply/sales/projContractPage.html?projId=" + id;
}
//改变状态显示方式
function changeValueTo(el, val){
	val = "【" + val + "】";
	valueToWithNoFunc(el, val)
}

//点击改变页面显示个数
var clickOne = true;
function limitValueTo(el){
	limit = $(el).val().replace("个/页", "");
	if(clickOne){
		clickOne = false;
	}else{
		clickOne = true;
		_commit();
	}
}

var contractId = "";
var projId = ""
//外部询价单传参
function inquiry(el) {
	 contractId = $(el).parent().parent().find("input[name='id']").val();
	 projId = $(el).parent().parent().find("input[name='projId']").val();
}
//外部询价单列表
function inquiryPage() {
	$.ajax({
	    type : "post",
	    // @RequestMapping(value = "/inquiryPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/inquiryPage/condition;projId=;contractId=;typ=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/inquiryPage/{condition}/{sys}",		        
		data:{
			"condition": { 
				"projId": projId,
				"contractId": contractId,
				"typ": ""
			},
			"sys": {
				"offset": $$("inquiryOffset").value,
				"limit": $$("inquiryLimit").value, 
				"token": $.cookie("token")
			}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   toView(jsonData, true);
		}
	});
}

function inquiryPaginate() {
	if ($$("inquiryPage-nav")) {
		$("#inquiryPage-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("inquiryLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("inquiryOffset").value = $$("inquiryLimit").value * (pageIndex - 1);
				inquiryPage();
			}
		});
	}

}

//内部合同列表
function innerContractCommit(){
	
	$.ajax({
		type : "post",
		//@OrgAuthen( PERM = true, name = "内部合同列表")
		//@ResponseBody
		//@RequestMapping(value = "/innerContractPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/innerContractPage/condition;projId=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/innerContractPage/{condition}/{sys}",
	  	data:{
				"condition": { 
					"projId": param("projId"),
				},
				"sys": {
					"offset": $$("innerContractOffset").value,
					"limit": $$("innerContractLimit").value, 
					"token": $.cookie("token")}
	  	},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			   console.log(jsonData);	
			   toView(jsonData,true);
			   innerContractPaginate();
		}
	});
}


//内部报价单列表
function allInnerQuote() {
	$.ajax({
	    type : "post",
	    //     @OrgAuthen( PERM = true, name = "内部报价单列表")        @ResponseBody
        //@RequestMapping(value = "/allInnerQuote/{contractId}/{sys}", produces = "text/plain")
        // http://localhost:81/ils/supply/allInnerQuote/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/allInnerQuote/{contractId}/{sys}",		        
		data:{
			"contractId": contractId,
			"sys": {
				"token": $.cookie("token")
			}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   toView(jsonData, true);
		}
	});
}

//内部合同列表分页控件
function innerContractPaginate() {
	if ($$("innerContractPage-nav")) {
		$("#innerContractPage-nav").pagination({
			items: $$("innerContractTotal").value,
			itemsOnPage: $$("innerContractLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("innerContractOffset").value = $$("innerContractLimit").value * (pageIndex - 1);

				innerContractCommit();
			}
		});
	}
}


