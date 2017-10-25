//改变标题
var title = param("questionName") + "项目 的回复";
$("#title").text(title);

//问题答复
function makeQuestionReq(el) {
	var materialStr = "" ;
	var materialStrname = "";
	if($("[name='materialTemplate']").length == 1){
		tip("未上传文件");
	}else{
		for (var i = 1; i < $("[name='materialTemplate']").length ;i++) {
			var origName = $("input[name='name']").eq(i).val();
			materialStr += origName + ","
			var materialStrname = materialStr.substring(0,materialStr.length-1);
		}
	}
	$.ajax({
	    type : "post",
	    // @RequestMapping(value = "/makeQuestionReq/{map}/{materialStr}/{sys}", produces = "text/plain")
        // http://localhost:81/ils/supply/makeQuestionReq/map;rootId=;name=简述;descr=;/name.doc,name.doc/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/makeQuestionReq/{map}/{materialStr}/{sys}",		        
			data:{
				"map": {
					"rootId": param("questionId"),
					"name": $("#name").val(), 
					"descr": $("#descr").val()
					},
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
				backSecond();
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
		url : "/ils/supply/makeMaterial/map;projId=" + param("projId") + ";bizNo=" + bizNo + ";typ=回复资料;descr=" + $("#showDescr").val() + "/sys;token=" + $.cookie("token"),
		secureuri: false,
		fileElementId: 'file',
		dataType : "text",
		success : function(data, status) {
			data = JSON.parse(data.replaceAll("<pre.[^>]*>|</pre>",""))
			var materialTemplate = $($("tr[name='materialTemplate']")[0]).clone();
			console.log(data)
			var fileOrigName= data.result.material.origName;
			var fileId= data.result.material.id;
			var fileDescr= data.result.material.descr;
			var fileName= data.result.material.name;
			$(materialTemplate.find("span[name='origName']")).text(fileOrigName);
			$(materialTemplate.find("input[name='id']")).val(fileId);
			$(materialTemplate.find("input[name='name']")).val(fileName);
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

//取消
function backProjDetail(){
	setTimeout(function() {
		window.history.go(-1);
	});
}