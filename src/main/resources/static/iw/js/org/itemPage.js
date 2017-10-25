_commit();
$(function() {
	$("#search-tabs > li > a").click(function(e) {
		e.preventDefault();
		$(this).tab("show");
	});

});
grpCateAll();
// 大类下拉列表
function grpCateAll() {
	$.ajax({
		type : "post",
		/*
		 * @RequestMapping(value = "/grpCateAll/sys", produces = "text/plain") //
		 * http://localhost:81/ils/org/grpCateAll/sys
		 */
		url : apphost() + "/ils/org/grpCateAll/sys",
		async : false,
		dataType : "json",
		success : function(jsonData) {
			if (!right(jsonData))
				return;
			
			console.log((jsonData));
			toView({
				status : "succ",
				result : {
					"grpCateAll" : jsonData.result.grpCateAll
				}
			});
			$("#grpCateCodeDiv").autocomplete({
				refreshList : cateAllByGrpCode
			});
		}
	});
}

// 小类下拉列表
function cateAllByGrpCode() {
	$("ul li[name='cateAllByGrpIdTemplate']:not([style])").remove();
	var grpCode = $("#grpCateCode").val().split("_")[0];
	 $("#cateCode").val("");
	if (typeof grpCode == "undefined" || grpCode.replace(/\s/g, "") == "")
		return;
	$.ajax({
		type : "post",
		/*
		 * @RequestMapping(value = "/cateAllByGrpCode/{grpCode}/sys", produces =
		 * "text/plain") http://localhost:81/ils/org/cateAllByGrpCode/14/sys
		 */
		url : apphost() + "/ils/org/cateAllByGrpCode/{grpCode}/sys",
		data : {
			"grpCode" : grpCode
		},
		async : false,
		martrix : true,
		dataType : "json",
		success : function(jsonData) {
			if (!right(jsonData))
				return;
			toView(jsonData);
			$("#cateCodeDiv").autocomplete();
		}
	});
}

var order = "UPAT";
function orderBy(el, val) {

	var elValue = $(el).attr("value");

	if (elValue == "UPAT" || elValue == "UPAT DESC") {
		$("#upat").attr("class", "btn btn-primary");
		$("#allCode").attr("class", "btn btn-default");
		$("#itemNameCode").attr("class", "btn btn-default");
	} else if (elValue == "CATECODE" || elValue == "CATECODE DESC") {
		$("#upat").attr("class", "btn btn-default");
		$("#allCode").attr("class", "btn btn-primary");
		$("#itemNameCode").attr("class", "btn btn-default");
	} else if (elValue == "ITEMNAMECODE" || elValue == "ITEMNAMECODE DESC") {
		$("#upat").attr("class", "btn btn-default");
		$("#allCode").attr("class", "btn btn-default");
		$("#itemNameCode").attr("class", "btn btn-primary");
	}
	order = elValue;

	if (order == "UPAT" || order == "CATECODE" || order == "ITEMNAMECODE")
		$(el).attr("value", order + " DESC");
	else
		$(el).attr("value", order.replace(" DESC", ""));

	_commit();
}
var nameLike = "NSN码";
function NamLikeValue(el) {
	nameLike = $(el).text();
}

var url = "";
// 我的供应物项列表显示
var cateGrpCode = "";
var cateCode = "";

function _commit() {
	cateGrpCode = $("#grpCateCode").val().split("_")[0];
	cateCode = $("#cateCode").val().split("_")[0];

	var whichPage = "";
	if (param("pageType") == "children")
		whichPage = "childrenSupplyItemPage";
	else if (param("pageType") == "pub")
		whichPage = "pubSupplyItemPage";
	else if (param("pageType") == "myModel")
		whichPage = "myModelPage";
	else
		whichPage = "mySupplyItemPage";

	var scretLvl = $("input[name='idSelected']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/, "");

	var supplyType = $("input[name='supplyType']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/, "");

	var certStatus = $("input[name='certStatus']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/, "");
	
	$.ajax({
				type : "post",
				// @RequestMapping(value =
				// "/mySupplyItemPage/{condition}/{orderBy}/{sys}", produces =
				// "text/plain")
				// http://localhost:81/ils/org/mySupplyItemPage/condition;nameLike=;scretLvl=;cateGrpCode=;cateCode=;supplyType=;certStatus=/upat
				// desc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
				url : apphost() + "/ils/org/" + whichPage
						+ "/{condition}/{orderBy}/{sys}",
				data : {
					"condition" : {
						"nameLike" : nameLike == "物项名称" ? $$("nameLike").value
								: "",
						"nsnLike" : nameLike == "NSN码" ? $$("nameLike").value
								: "",
						"supplyNameLike" : nameLike == "供应商名称" ? $$("nameLike").value
								: "",
						"partNoLike" : nameLike == "供应商零件号" ? $$("nameLike").value
								: "",
						"scretLvl" : scretLvl,
						"cateGrpCode" : cateGrpCode,
						"cateCode" : cateCode,
						"supplyType" : supplyType,
						"certStatus" : certStatus
					},
					"orderBy" : order,
					"sys" : {
						"offset" : $$("offset").value,
						"limit" : $$("limit").value,
						"token" : $.cookie("token")
					}
				},
				dataType : "json",
				async : false,
				martrix : true,
				success : function(jsonData) {
					if (!right(jsonData))return;
					console.log(jsonData);
					// 每个item添加属性pageType。
					var itemPage = jsonData.result.itemPage;

					var item = itemPage[0];

					for (var i = 0; i < itemPage.length, item = itemPage[i]; i++) {

						item.pageTypeAndNo = {
							"pageType" : param("pageType"),
							"no" : item.no
						};
					}
					toView(jsonData, true);
				}
			});

}


// 供应商列表
function _supplyCommit() {
	$("input[id='partNo']").val("");
	var itemDisplay = $("#addSupplierModal").css("display");
	if (itemDisplay == 'none') {
		$("input[id='supplyNameLike']").val("");
	}
	$.ajax({
		type : "post",
		// @RequestMapping(value = "/mySupplyPage/{condition}/{sys}", produces =
		// "text/plain")
		// http://localhost:81/ils/org/mySupplyPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/mySupplyPage/{condition}/{sys}",
		data : {
			"condition" : {
				"nameLike" : $$("supplyNameLike").value
			},
			"sys" : {
				"offset" : $$("supplyOffset").value,
				"limit" : $$("supplyLimit").value,
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))
				return;
			console.log(jsonData);
			toView(jsonData, true);
		}
	});
}

// 获取供应物项Id
var supItemId = "";
function supplyItemId(el) {
	supItemId = $(el).parent().parent().find("td[name='supplyItemId']").text();
}

// 添加供应商到已认证物项
function addSupplyToItem() {

	if ($$("partNo").value == "") {
		$$("partNo").focus();
		tip("请填写零件号！");
		return;
	}

	var id = $('input:radio:checked').parent().parent().find("td[id='id']")
			.text();
	var partNo = $("input[id='partNo']").val();
	$.ajax({
				type : "post",
				// @RequestMapping(value =
				// "/addSupplyToItem/{supplyId}/{supplyItemId}/{partNo}/{sys}",
				// produces = "text/plain")
				// http://localhost:81/ils/org/addSupplyToItem/1/1/FD2000地对地导弹系统/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
				url : apphost()
						+ "/ils/org/addSupplyToItem/{supplyId}/{supplyItemId}/{partNo}/{sys}",
				data : {
					"supplyId" : id,
					"supplyItemId" : supItemId,
					"partNo" : partNo,
					"sys" : {
						"token" : $.cookie("token")
					}
				},
				dataType : "json",
				async : false,
				martrix : true,
				//孟德利改
				success : function(jsonData) {
					var reqParams = {
							supplyId:  id,
							partNo:  partNo
						}
					var logMap = {};
					logMap.opName = "添加供应商";
					logMap.reqParams = JSON.stringify(reqParams);
					logMap.domain = "org";
					logMap.action = "addSupplyToItem";
					logMap.reqURI = "itemPage.html";
					
					if (!right(jsonData)) {
						logMap.status = "失败";
						makeBizLog(logMap);
						return;
					}
					logMap.status = "成功";
					makeBizLog(logMap);
					console.log((jsonData));
					location.href = "/iw/org/itemPage.html?pageType=myItem";
				}
			});
}
// 添加供应商按钮控制， 在公开物项和下级物项中不显示
if (param("pageType") == "children" || param("pageType") == "pub") {
	$("button[name='addSupplyBtn']").remove();
	$("button[name='no']").remove();
}
if (param("pageType") == "pub")
	$("tr[name='scretLvlTr']").remove();

function showOrHiddenToCertBtnByStatus(el, value) {
	if (value == "认证通过")
		$(el).parent().remove();
	console.log(value, 1111111111111)
}
function showOrHiddenAddSupplyBtnByStatus(el, value) {
	if (value != "认证通过")
		$(el).parent().remove();
}

function createItemOrModel(el, value) {
	if (param("pageType") == "myItem") {
		$(el).html("创建物项");
		$(el).parent().removeAttr("onclick");
		$(el).parent().bind('click', function() {
			location.href = 'itemDetail.html';
		});
		/* $(el).parent().attr("onclick", "location='itemDetail.html'"); */
	} else if (param("pageType") == "myModel") {
		$(el).html("创建型号");
		$(el).parent().removeAttr("onclick");
		$(el).parent().bind('click', function() {
			location.href = 'modelDetail.html';
		});
		// $(el).parent().attr("onclick", "location='modelDetail.html'");
	} else
		$(el).parent().remove();
}

function supplyPaginate() {
	if ($$("supplyPage-nav")) {
		$("#supplyPage-nav").pagination(
				{
					items : $$("supplyTotal").value,
					itemsOnPage : $$("supplyLimit").value,
					cssStyle : "light-theme",
					onPageClick : function(pageIndex, event) {
						$$("supplyOffset").value = $$("supplyLimit").value
								* (pageIndex - 1);
						_supplyCommit();
					}
				});
	}
}
