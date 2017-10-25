var order = "projNo";
function orderBy(el, val) {

	var elValue = $(el).attr("value");

	if (elValue == "PROJNO" || elValue == "PROJNO DESC") {
		$("#PROJNO").attr("class", "btn btn-primary");
		$("#COUNTRY").attr("class", "btn btn-default");
		$("#UPAT").attr("class", "btn btn-default");
	} else if (elValue == "COUNTRY" || elValue == "COUNTRY DESC") {
		$("#PROJNO").attr("class", "btn btn-default");
		$("#COUNTRY").attr("class", "btn btn-primary");
		$("#UPAT").attr("class", "btn btn-default");
	} else if (elValue == "UPAT" || elValue == "UPAT DESC") {
		$("#PROJNO").attr("class", "btn btn-default");
		$("#COUNTRY").attr("class", "btn btn-default");
		$("#UPAT").attr("class", "btn btn-primary");
		$("#UPAT").attr("class", "btn btn-primary");
	}
	order = elValue;

	if (order == "PROJNO" || order == "COUNTRY" || order == "UPAT")
		$(el).attr("value", order + " DESC");
	else
		$(el).attr("value", order.replace(" DESC", ""));

	_commit();
}
var nameLike = "编号";
function NamLikeValue(el) {
	nameLike = $(el).text();
}
paginate()
_commit();
function _commit() {
	var user = $("input[name='idSelected']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/, "");

	var scretLvl = $("input[name='scretLvl']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/, "");

	$.ajax({
				type : "post",
				//  // http://localhost:81/ils/supply/myProjPage/condition;nameLike=项目名称;codeLike=代号;countryLike=沙特;consumer=空军,海军;scretlvl=非密,内部/PROJNO DESC/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
				url : apphost() + "/ils/supply/myProjPage/{condition}/{orderBy}/{sys}",
				data : {
					"condition" : {
						"projNo" : nameLike == "代号" ? $$("nameLike").value
								: "",
						"country" : nameLike == "国家" ? $$("nameLike").value
								: "",
						"newat" : nameLike == "建立时间" ? $$("nameLike").value
								: "",
						"scretLvl" : scretLvl,
						"consumer" : user,
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
					for(var i = 0; i < jsonData.result.myProjPage.length; i++) {
		    			var newat = jsonData.result.myProjPage[i].newat;
		    			
		    			jsonData.result.myProjPage[i].newat = toDate(newat);
		    		}
					toView(jsonData, true);
				}
			});

}

function projDetail(el) {
	projId = $(el).parent().parent().find("input[name='id']").val();
	$.ajax({
		type : "post",
		// 	RequestMapping(value = "/projDetail/{projNo}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/projDetail/asfaswesadfasfsdd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/projDetail/{projNo}/{sys}",
		data : {
			"projNo": projId,
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			console.log(jsonData);
			toView(jsonData, true);
		}
	});
}

function toProjDetail(el) {
	var id = $(el).find("input[name='id']").val();
	var no = $(el).find("input[name='no']").val();
	location.href = "/iw/supply/market/projDetail.html?id=" + id + "&&no=" + no;
}

var projId, bizNo, materialTyp,offset,limit,total, matePage_nav,s;
//显示文档资料
function showMaterial(el) {
	projId = $($(el).parent().parent().find("input[name='id']")).val();
	bizNo = $($(el).parent().parent().find("input[name='no']")).val();
	materialTyp = "技术资料,项目文件资料";
	
	materialPage();	
	materialPaginate();	
}

//文档资料列表
function materialPage() {
	$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/materialPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/materialPage/condition;projId=1;bizNo=;typ=技术资料/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/materialPage/{condition}/{sys}",		        
			data:{
				"condition": {
					"projId": projId,
					"bizNo":  bizNo,				
					"materialTyp": materialTyp
				},
				"sys" : {
					"offset" : $$("materialOffset").value,
					"limit" : $$("materialLimit").value,
					"token" : $.cookie("token")
				}
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
				jsonData.result.mateTotal = jsonData.result.total;
				jsonData.result.materialTotal = jsonData.result.total;
				jsonData.result.mate = jsonData.result .materialPage
				console.log(jsonData);	
				toView(jsonData, true);
		}
	});
}

function materialPaginate() {
	if ($$("materialPage-nav")) {
		$("#materialPage-nav").pagination({
			items: $$("materialTotal").value,
			itemsOnPage: $$("materialLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("materialOffset").value = $$("materialLimit").value * (pageIndex - 1);
				materialPage();
			}
		});
	}
}
//显示问题资料      问题列表
function _questionCommit(el) {
	  projId = $($(el).parent().parent().find("input[name='id']")).val();
	$.ajax({
		  type: "post", 
		   //@RequestMapping(value = "/questionPage/{condition}/{sys}", produces = "text/plain")
		   // http://localhost:81/ils/supply/questionPage/condition;projId=1;nameLike=;type=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		   url : apphost() + "/ils/supply/questionPage/{condition}/{sys}",
		   data:{
			"condition": { 
					"projId": projId,
			},
			"sys": {
				"offset": $$("questionOffset").value,
				"limit": $$("questionLimit").value, 
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

//显示问题资料      问题列表
function _questionPaginate(el) {
	if ($$("questionPage-nav")) {
		$("#questionPage-nav").pagination({
			items: $$("questionTotal").value,
			itemsOnPage: $$("questionLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("questionOffset").value = $$("questionLimit").value * (pageIndex - 1);

				_questionCommit(el);
			}
		});
	}
}



function projCustNameValueTo(el, val) {
	var nextVal = $($(el).parent().parent().find("input[name='corpName']")).val();
	var val = val + "/" + nextVal;
	valueToWithNoFunc(el,val);
}

//下载资料
function downMaterial(el) {
	var curFileId = $($(el).find("input[name='id']")).val();
	//http://localhost:81/ils/supply/downMaterial/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	location.href = apphost() + "/ils/supply/downMaterial/" + curFileId + "/sys;token=" + $.cookie("token");
}

$("select#number").change(function () {
	$("#limit").value=0;
	if($(this).val()==10) {
		$("#limit").val(3);
		$('#offset').val(0);
		_commit();
		paginate();
	};
	if($(this).val()==20) {
		$("#limit").val(5);
		$('#offset').val(0);
		_commit();
		paginate();
	};
	if($(this).val()==50) {
		$("#limit").val(7);
		$('#offset').val(0);
		_commit();
		paginate();
	};
});

function hrefProjContractPage(el) {
	var projId = $(el).parent().parent().find("input[name='id']").val();
	location.href = "/iw/supply/sales/projContractPage.html?projId=" + projId;
}
 