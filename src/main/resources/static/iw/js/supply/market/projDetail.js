function callback(){
	projDetail();
}

var typ;

$("#myproj li").click(function() {
	var hrefVal = $($(this).find("a")).attr("href");
	
	if(hrefVal == "#basic") {
		projDetail();
	}else if(hrefVal == "#material") {
		typ = "技术资料";
		offset = $$("materialOffset").value;
		limit = $$("materialLimit").value;
		materialPage();
		total = $$("materialTotal").value;
		matePage_nav = $$("materialPage-nav");
		materialPaginate();	
		
	}else if(hrefVal == "#approval") {
		typ = "项目文件资料";
		
		offset = $$("mateOffset").value;
		limit = $$("mateLimit").value;
		materialPage();
		total = $$("mateTotal").value;
		matePage_nav = $$("matePage-nav");
		materialPaginate();
		
	}else if(hrefVal == "#export") {
		typ = "出口合同";
		
		contractPage();
		contracttotal = $$("contractTotal").value;
		contractPage_nav = $$("contractPage-nav");
		contractPaginate();
	}else if(hrefVal == "#inside") {
		
	}else if(hrefVal == "#qa") {
		//问题列表
		_questionCommit();
		//问题列表分页控件
		paginate();
			
	}
})

function materialPaginate() {
	if (matePage_nav) {
		$(matePage_nav).pagination({
			items: total,
			itemsOnPage: limit,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				offset = limit* (pageIndex - 1);
				materialPage();
			}
		});
	}
}

//问题列表
function _questionCommit() {
	
	if(!param("id")) return;
	var type = $('input:radio:checked').val();
	$.ajax({ 
		  type: "post", 
		   //@RequestMapping(value = "/questionPage/{condition}/{sys}", produces = "text/plain")
		   // http://localhost:81/ils/supply/questionPage/condition;projId=1;nameLike=;type=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		   url : apphost() + "/ils/supply/questionPage/{condition}/{sys}",
		   data:{
			"condition": { 
					"projId": param("id"),
					"nameLike": $$("nameLike").value,
					"type": type
			},
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
		    	for(var i = 0; i < jsonData.result.questionPage.length; i++) {
		    		var replierNewat = jsonData.result.questionPage[i].replierNewat;
		    		jsonData.result.questionPage[i].replierNewat = toDate(replierNewat);
		    	}
		    	toView(jsonData,true);
		   }
	});
}

//问题列表分页控件
function paginate() {
	if ($$("page-nav")) {
		$("#page-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("offset").value = $$("limit").value * (pageIndex - 1);

				_questionCommit();
			}
		});
	}
}


//技术资料列表
function materialPage() {
	$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/materialPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/materialPage/condition;projId=1;bizNo=;typ=技术资料/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/materialPage/{condition}/{sys}",		        
			data:{
				"condition": {
					"projId": param("id"),
					"bizNo":  param("no"),				
					"materialTyp": typ
				},
				"sys": {
					"offset": offset,
					"limit": limit, 
					"token": $.cookie("token")
				}
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   jsonData.result.materialTotal = jsonData.result.total;
			   jsonData.result.mateTotal = jsonData.result.total;
			   console.log(jsonData);	
			   toView(jsonData, true);
		}
	});
}

//删除资料
function delMaterial(el) {
	var id = $($(el).find("input[name='id']")).val();
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/delMaterial/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/delMaterial/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/delMaterial/{id}/{sys}",		        
		data:{
			"id": id,
			"sys": {"token": $.cookie("token")}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			tip("删除成功！")
			localSecond();
		}
	});
}

//下载资料
function downMaterial(el) {
	var curFileId = $($(el).find("input[name='id']")).val();
	//http://localhost:81/ils/supply/downMaterial/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	location.href = apphost() + "/ils/supply/downMaterial/" + curFileId + "/sys;token=" + $.cookie("token");
}
//创建及修改
function makeProj() {
	
$.ajax({
	    type : "post",
       //@RequestMapping(value = "/makeProj/{map}/{sys}", produces = "text/plain")
        // http://localhost:81/ils/org/makeProj/map;id=0;projNo=BH001;code=DH001;name=项目名;country=沙特;consumer=空军;scretLvl=非密;feature=延续项目-续订;focusOn=精密公司;dealState=正在履约;state=搁置（指受国家政策、或目标国内政策等原因导致项目被搁置）;involvedModelId=2;status=立项;descr=;/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41

		url: apphost() + "/ils/supply/makeProj/{map}/{sys}",
			data:{
				"map": {
					"id": param("id"),
					"projNo": $$("projNo").value,
					"code": $$("code").value, 
					"name": $$("name").value,
					"country": $$("country").value, 
					"consumer": $$("consumer").value,
					"scretLvl": $$("scretLvl").value,  
					"feature": $$("feature").value,
					"focusOn": $$("focusOn").value,
					"dealState": $$("dealState").value,
					"state": $$("state").value,
					"involvedModels": $$("involvedModels").value,
					"descr": $$("descr").value,
					},
					
				"sys": {"token": $.cookie("token")}
					
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   console.log(jsonData);	
				tip("创建成功");
				window.location.href="/iw/supply/market/marketPage.html";
		}
	});
	

}
//创建关联型号
function _modelCommit() {
    $.ajax({ 
    	type: "post", 
    	//http://localhost:81/ils/model/myModelPage/condition;codeLike=;techStatus=/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/model/myModelPage/{condition}/{sys}",
    	data:{
			"condition": { 
				"nameLike": $$("nameLike").value,
			},
			"sys": {
				"offset": $$("modelOffset").value,
				"limit": $$("modelLimit").value, 
				"token": $.cookie("token")}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
    		console.log(jsonData);
    		/*for(var i = 0; i < jsonData.result.myModelPage.length; i++) {
    			var projAt = jsonData.result.myModelPage[i].projAt;
    			var modeledAt = jsonData.result.myModelPage[i].modeledAt;
    			jsonData.result.myModelPage[i].projAt = toDate(projAt);
    			jsonData.result.myModelPage[i].modeledAt = toDate(modeledAt);
    		}*/
    		toView(jsonData,true);
    	}
	});
}

function modelPaginate() {
	if ($$("modelPage-nav")) {
		$("#modelPage-nav").pagination({
			items: $$("modelTotal").value,
			itemsOnPage: $$("modelLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("modelOffset").value = $$("modelLimit").value * (pageIndex - 1);

				_modelCommit();
			}
		});
	}
}

function projDetail() {
	if (!param("id")) return;
	$.ajax({
		type : "post",
		// 	RequestMapping(value = "/projDetail/{projNo}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/projDetail/asfaswesadfasfsdd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/projDetail/{projNo}/{sys}",
		data : {
			"projNo": param("id"),
			"sys" : {
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			toView(jsonData);
			//项目进度判断添加样式
			if ( jsonData.result.projDetail.status == "" || jsonData.result.projDetail.status == null || jsonData.result.projDetail.status == undefined ) {
				return;	
			}
			
			for ( var i = 0; i < $("[name='projStatus']").length; i++ ) {
				if ( $("[name='projStatus']").eq(i).text() == jsonData.result.projDetail.status ) {
					$("[name='projStatusStyle']").eq(i).attr("class","over");
					break;
				}
				$("[name='projStatusStyle']").eq(i).attr("class","over")
			}
			
		}
	});
}

//型号列表选中赋值
function modelChoice() {
	var s = $('input:radio:checked').parent().parent().find("input[name='id']").val();
	$("input[id='modelId']").val(s);
	var v = $('input:radio:checked').parent().parent().find("span[name='name']").text();
	$("input[id='modelName']").val(v);
}

var url, typ;
//新增技术资料
$("#materialBtn").click(function (){
	typ = "技术资料" 
})


$("#approvalBtn").click(function (){
	typ = "项目文件资料" 
})

//新增文件
function makeMaterial() {
	url = "/ils/supply/makeMaterial/map;projId=" + param("id") + ";bizNo=" + param("no") + ";typ=" + typ + ";descr=" + $("#showDescr").val() + "/sys;token=" + $.cookie("token");
	myAjaxFileUpload();
}

function myAjaxFileUpload() {
	$.ajaxFileUpload({
		url : url,
		secureuri: false,
		fileElementId: 'file',
		dataType : "text",
		success : function(data, status) {
			data = JSON.parse(data.replaceAll("<pre.[^>]*>|</pre>",""))
			console.log(data)
		}
	});
}
/*
//问题列表
_modelCommit();
function _modelCommit() {
	if(!param("id")) return;
    $.ajax({ 
    	type: "post", 
    	//@RequestMapping(value = "/questionPage/{condition}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/supply/questionPage/condition;projId=1;nameLike=;type=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/supply/questionPage/{condition}/{sys}",
    	data:{
			"condition": { 
				"projId": param("id"),
			},
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
    		for(var i = 0; i < jsonData.result.myModelPage.length; i++) {
    			var projAt = jsonData.result.myModelPage[i].projAt;
    			var modeledAt = jsonData.result.myModelPage[i].modeledAt;
    			jsonData.result.myModelPage[i].projAt = toDate(projAt);
    			jsonData.result.myModelPage[i].modeledAt = toDate(modeledAt);
    		}
    		toView(jsonData,true);
    	}
	});
}
*/

//外部合同列表
function contractPage() {
	$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/contractPage/{condition}/{orderBy}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/contractPage/condition;projId=;nameLike=/CONTRACTNO/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/contractPage/{condition}/{orderBy}/{sys}",		        
			data:{
				"condition": {
					"projId": param("id"),
					"nameLike": ""
				},
				"orderBy":"CONTRACTNO",
				"sys": {
					"offset": $$("contractOffset").value,
					"limit": $$("contractLimit").value, 
					"token": $.cookie("token")
				}
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   jsonData.result.contractTotal = jsonData.result.total;
			   console.log(jsonData);	
			   toView(jsonData, true);
		}
	});
}

function contractPaginate() {
	if ($("#contractPage-nav")) {
		$("#contractPage-nav").pagination({
			contractitems: $$("contractTotal").value,
			contractlimit: $$("contractLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("contractOffset").value = contractlimit* (pageIndex - 1);
				alert($$("contractOffset").value);
				contractPage();
			}
		});
	}
}

//创建问题传参
function locationQuestionDetail() {
	location.href = "/iw/supply/market/questionDetail.html?projId=" + param("id");
}

function projCustNameValueTo(el, val) {
	var nextVal = $($(el).parent().parent().find("input[name='corpName']")).val();
	var val = val + "/" + nextVal;
	valueToWithNoFunc(el,val);
}

//编辑修改问题传参
function locationQuestion(el) {
	var questionId = $(el).parent().parent().find("input[name='ID']").val();	
	var  questionNo = $($(el).find("input[name='NO']")).val();
	location.href = "/iw/supply/market/questionDetail.html?questionId=" + questionId + "&&questionNo=" + questionNo  + "&&projId=" + param("id") ;
}

//增加出口合同 
function locaOutContract() {
	location.href = "/iw/supply/sales/outContractNew.html?projId=" + param("id") + "&&cate=" + "1";
}

//跳转到答复页面
function toAnswerShow(el){
	var questionId = $(el).parent().parent().find("input[name='ID']").val();
	var questionName = $(el).parent().parent().find("span[name='NAME']").text();
	location.href = "/iw/supply/market/answerShow.html?questionId=" + questionId + "&&questionName=" + questionName + "&&projId=" + param("id");
}