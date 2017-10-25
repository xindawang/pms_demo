//判断当前用户是否为指定答复人
var loginName = $.cookie("loginName");
var Name = $.cookie("loginName");
var sameOne = loginName ==  Name? true: false;
if(sameOne){
	$(".sameOne").hide();
}else{
	$(".sameOne").show();
}

//返回项目详情
var projId;
function backProjDetail(){
	location.href = "/iw/supply/market/projDetail.html?id=" + projId;
}
questionDetail();
function questionDetail() {
	if(param("questionId") == ""){
		tip("questionId为空！")
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
			   projId = jsonData.result.question.projId;
			   questionData.result.dual = "";
			   right(questionData)
			   toView(questionData);
			   
			   //问题答复基本信息下半部分
			   var materialData = {};
			   materialData.status = "succ";
			   materialData.result = {};
			   materialData.result.material = jsonData.result.material;
			   for(var i = 0 ; myMaterial = materialData.result.material[i] ; i++){
				   myMaterial.RN = i + 1;
			   }
			   materialData.result.dual = "";
			   right(materialData)
			   toView(materialData);
			   
			   //相关产品
			   var projLibData = {};
			   projLibData.status = "succ";
			   projLibData.result = {};
			   projLibData.result.projLib = jsonData.result.projLib;
			   for(var i = 0 ; myProjLib = projLibData.result.projLib[i] ; i++){
				   myProjLib.RN = i + 1;
			   }
			   projLibData.result.dual = "";
			   right(projLibData)
			   toView(projLibData);
			   
			   //答复
			   var questionRepData = {};
			   questionRepData.status = "succ";
			   questionRepData.result = {};
			   questionRepData.result.questionRep = jsonData.result.questionRep;
			   for(var i = 0 ; myQuestionRep = questionRepData.result.questionRep[i];i++){
				   var arr = myQuestionRep.lines.split("|");
				   
				   var objectArr = [];
				   for(var i = 0; string = arr[i]; i++){
					   var arrOne = string.split(",");
					   var object = {};
					   object.id = arrOne[0];
					   object.name = arrOne[1];
					   object.descr = arrOne[2];
					   objectArr.push(object);
				   }
				   
				   var linesData = {};
				   linesData.status = "succ";
				   linesData.result = {};
				   linesData.result.lines = objectArr;
				   for(var i = 0 ; myLines = linesData.result.lines[i] ; i++){
					   myLines.RN = i + 1;
				   }
				   linesData.result.dual = "";
				   right(linesData)
				   toView(linesData);
				   
			   }
			   questionRepData.result.dual = "";
			   right(questionRepData)
			   toView(questionRepData);
			   
			   //赋值标题
			   var title = questionData.result.question.projName + "项目 的" + questionData.result.question.name + "问题 的答复";
			   $("#title").text(title);
		}
	});
}

//下载资料
function downMaterial(el) {
	var curFileId = $($(el).find("input[name='id']")).val();
	//http://localhost:81/ils/supply/downMaterial/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	location.href = apphost() + "/ils/supply/downMaterial/" + curFileId + "/sys;token=" + $.cookie("token");
}

//改变createName显示文字
function createNameValueTo(el, val){
	val += "的答复";
	valueToWithNoFunc(el, val);
}