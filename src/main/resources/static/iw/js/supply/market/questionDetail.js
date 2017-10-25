function prodLibPage() {
	$.ajax({
		type : "post",
		// @RequestMapping(value = "/prodLibPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/prodLibPage/condition;name=/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/model/prodLibPage/{condition}/{sys}",
		data : {
			"condition" : {
				"name" :  $$("nameLike").value
			},
			"sys" : {
				"offset" : $$("prodLibOffset").value,
				"limit" : $$("prodLibLimit").value,
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))return;
			toView(jsonData, true);
		}
	});
}

function prodLibPaginate() {
	if ($$("prodLibPage-nav")) {
		$("#prodLibPage-nav").pagination({
			items: $$("prodLibTotal").value,
			itemsOnPage: $$("prodLibOffset").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("prodLibOffset").value = $$("prodLibLimit").value * (pageIndex - 1);

				prodLibPage();
			}
		});
	}
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

//新增文件
var url, questionNo, bizNo;

function makeMaterial() {
	if(param("questionNo") != "") {
		bizNo = param("questionNo");
	}else {
		bizNo = "";
	}
    myAjaxFileUpload();
}

function myAjaxFileUpload() {
	$.ajaxFileUpload({
		url : "/ils/supply/makeMaterial/map;projId=" + param("projId") + ";bizNo=" + bizNo + ";typ=问题资料;descr=" + $("#showDescr").val() + "/sys;token=" + $.cookie("token"),
		secureuri: false,
		fileElementId: 'file',
		dataType : "text",
		success : function(data, status) {
			data = JSON.parse(data.replaceAll("<pre.[^>]*>|</pre>",""))
			var materialTemplate = $($("tr[name='materialTemplate']")[0]).clone();
			console.log(data)
			var fileName= data.result.material.origName;
			var fileId= data.result.material.id;
			var fileDescr= data.result.material.descr;
			$(materialTemplate.find("span[name='origName']")).text(fileName);
			$(materialTemplate.find("input[name='id']")).val(fileId);
			$(materialTemplate.find("span[name='descr']")).text(fileDescr);
			materialTemplate.removeAttr("style"); 
			$("#appendMaterialTemplate").append(materialTemplate)
		}
	});
}

//下载资料
function downMaterial(el) {
	var curFileId = $($(el).find("input[name='id']")).val();
	//http://localhost:81/ils/supply/downMaterial/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	location.href = apphost() + "/ils/supply/downMaterial/" + curFileId + "/sys;token=" + $.cookie("token");
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
			$(el).parent().parent().remove();
		}
	});
}

function _custCommit() {
	$.ajax({
		type : "post",
		// @RequestMapping(value = "/custPage/{condition}/{sys}",
		// produces = "text/plain")
		// http://localhost:81/ils/org/custPage/condition;nameLike=;roleName=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/custPage/{condition}/{sys}",
		data : {
			"condition" : {
				"nameLike" : $$("nameLike").value,
				"roleName": "项目经理"
			},
			"sys" : {
				"offset" : $$("custOffset").value,
				"limit" : $$("custLimit").value,
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

function custPaginate() {
	if ($$("custPage-nav")) {
		$("#custPage-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("custOffset").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("custOffset").value = $$("custLimit").value * (pageIndex - 1);

				_custCommit();
			}
		});
	}
}

var custName;
var createrId;
function chooseCust() {
	var name = $('input:radio:checked').parent().parent().find("td[id='name']").text();
	var corpName = $('input:radio:checked').parent().parent().find("td[id='corpName']").text();
	custName = name + " / " + corpName;
	$("input[id='custName']").val(custName);
	createrId = $('input:radio:checked').parent().parent().find("td[id='custId']").text();
	$("input[id='createrId']").val(createrId);

}

function saveReplier() {
	
	if(createrId == "" || createrId == undefined) {
		tip("请选择答复人");
		return;
	}
	
	for (var i = 0; i < $("[name='replierId']").length ; i++) {
		
		if ( $("[name='replierId']").eq(i).text() == createrId ) {
			tip("不能指定相同的答复人");
			return;
		}
		
	}
	
	var clone = "<tr> " +
			"<td style='display: none;'><span name='replierId'>"+ createrId +"</span></td>" +
			"<td><span name='cloneCustName'>"+ custName +"</span></td>" +
			"<td><span name='cloneDescr'>"+ $("#descrs").val() +"</span></td>" +
			"</tr>";
	
	$("[name='replierClone']").after(clone);
}

function clikCust(){
	createrId = "";
	$("#createrId").val("");
	$("#custName").val("");
	$("#descrs").val("");
}

var id = "";
function proChoose() {
	
	var no = $('input:radio:checked').parent().parent().find("td[name='no']").text();
	var nsn = $('input:radio:checked').parent().parent().find("td[name='nsn']").text();
	var name = $('input:radio:checked').parent().parent().find("td[name='name']").text();

	for (var b = 0; b < $("[name='no']").length ; b++) {
		if ( $("[name='projLibTemplate'] [name='no']").eq(b).text() == no ) {
			tip("不能指定相同的产品");
			return;
		}
	}
	id += "," +  no ;
	var clone = "<tr name='proQuestions' > "  +
	"<td name='nos' style='display: none'>" + no + "</td>" +
	"<td>" + nsn + "</td>" +
	"<td>" + name + "</td>" +
	"<td><button type='button' class='btn btn-danger' onclick='' >删除</button></td>" +
	"</tr>";
	$("#clone").after(clone);
}

//问题创建
function makeQuestion(el) {
var materialStr = "" ;
	for (var i = 1; i < $("[name='materialTemplate']").length ;i++) {
		var origName = $("[name='origName']").eq(i).text();
		materialStr += origName + ","
		var materialStrname = materialStr.substring(0,materialStr.length-1);
	}
	var status = $(el).val();
	var proId = "", proIds="" ;
	var map = {};
	for (var i = 1; i < $("[name='replierId']").length ; i++) {
		map[$("[name='replierId']").eq(i).text()] =  $("[name='cloneDescr']").eq(i).text();
	}
	
	var nos = "";
	for (var b = 1; b < $("[name='projLibTemplate'] [name='no']").length ; b++) {
	                nos += "," + $("[name='no']").eq(b).text() 
	}
	var ids = id + nos ;
	proId = ids.substring(1);

	var replierStr = JSON.stringify(map);

	$.ajax({
	    type : "post",
       //@RequestMapping(value = "/makeQuestion/{map}/{replierStr}/{materialStr}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/makeQuestion/map;id=0;projId=1;name=简述;askParty=提出方;asker=提出人;phone=电话;fax=传真;email=邮箱;askAt=提问时间;descr=;status=;prodLibNos=/{"1":"descr", "2":""}/name.doc,name.doc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/makeQuestion/{map}/{replierStr}/{materialStr}/{sys}",		        
			data:{
				"map": {
					"id": param("questionId"),
					"projId": param("projId"),				
					"name": $$("name").value, 
					"askParty": $$("askParty").value,
					"asker": $$("asker").value, 
					"phone": $$("phone").value,
					"fax": $$("fax").value,  
					"email": $$("email").value,
					"askAt": $$("askAt").value,
					"descr": $$("descr").value,
					"status": status,
					"prodLibNos": proId,
					},
				"replierStr": replierStr,
				"materialStr": materialStrname,
				"sys": {"token": $.cookie("token")}
					
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   console.log(jsonData);	
				tip("创建成功");
		}
	});
}

//详情渲染
questionDetail();
function questionDetail() {
	if(param("questionId") == ""){
		return;
	}
	$.ajax({
	    type : "post",
	    // @RequestMapping(value = "/questionDetail/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/questionDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/questionDetail/{id}/{sys}",		        
			data:{
				"id": param("questionId"),
				"sys": {"token": $.cookie("token")}
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   console.log(jsonData);	
			   //数据拆分
			   
			   //问题答复基本信息上半部分
			   var questionData = {};
			   questionData.status = "succ";
			   questionData.result = {};
			   questionData.result.question = jsonData.result.question;
			   questionData.result.dual = "";
			   right(questionData)
			   toView(questionData);
			   
			   //问题答复基本信息下半部分
			   var materialData = {};
			   materialData.status = "succ";
			   materialData.result = {};
			   materialData.result.material = jsonData.result.material;
			   materialData.result.dual = "";
			   right(materialData)
			   toView(materialData);
			   
			   //相关产品
			   var projLibData = {};
			   projLibData.status = "succ";
			   projLibData.result = {};
			   projLibData.result.projLib = jsonData.result.projLib;
			   projLibData.result.dual = "";
			   right(projLibData)
			   toView(projLibData);
			   
			   //答复
			   var replierData = {};
			   replierData.status = "succ";
			   replierData.result = {};
			   replierData.result.replier = jsonData.result.replier;
			   replierData.result.dual = "";
			   right(replierData)
			   toView(replierData);
			   
			   console.log(materialData);
			   console.log(projLibData);
			   console.log(questionData);
			   console.log(replierData);
		}
	});
}

//删除产品
function deleteProdLib(el) {
	if(confirm("确认要删除吗？")){
		$(el).parent().parent().remove();
	}
}