$(document).ready(function(){
	function init(){
		if($("input[name='kind']").val()=='real'){
			$("#realNode").show();
			$("#virtualNode").hide();
		}else{
			$("#realNode").hide();
			$("#virtualNode").show();
		}
	}
	init();
	
	$("input[name='kind']").on('change',function(){
		if($(this).val()=='real'){
			$("#realNode").show();
			$("#virtualNode").hide();
		}else{
			$("#realNode").hide();
			$("#virtualNode").show();
		}
	});
});

if ( param("id") != "" ){
	modelDetail();
}
var timeForNow = getNowFormateDate();
$("input[name='modelDetail.newat']").val(timeForNow);

//型号详情
function modelDetail() {
	if (param("RN")) $("#commit").hide();
	$.ajax({
		type: "post",
	/*	@OrgAuthen( PERM = true, name = "型号详情")
	@ResponseBody
	@RequestMapping(value = "/modelDetail/{id}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/model/corpPage/modelDetail;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41	*/
		url: apphost() + "/ils/model/modelDetail/{id}/{sys}" ,
		data:{
			 "id": param("id"),
			"sys": {
				"token": $.cookie("token"),
			}					
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData);
			
			var projAt = jsonData.result.modelDetail.projAt;
			var modeledAt = jsonData.result.modelDetail.modeledAt;		
			$("#projAt").val(toDate(projAt));
			$("#modeledAt").val(toDate(modeledAt));
		
			$("#newat").val(jsonData.result.modelDetail.newat.toDate());
			$("#upat").val(jsonData.result.modelDetail.upat.toDate());
		}
	});
}

//创建型号或修改型号
function makeModel() {
	//必填
	var modelDetailName = $("input[name='modelDetail.name']").val();
	var modelDetailCorpName = $("input[name='modelDetail.corpName']").val();
	var typ = $("input[name='modelDetail.typ']:checked").val();
	var techStatus = $("input[name='modelDetail.techStatus']:checked").val();
	var scretLvl =  $("input[name='modelDetail.scretLvl']:checked").val();
	var orgId = $$("corpId").value;
	
	//必填
	if ( modelDetailName == null || modelDetailName == '' || modelDetailName == undefined ) {
		tip("请填写型号全称");
		return;
	}
	if ( modelDetailCorpName == null || modelDetailCorpName == '' || modelDetailCorpName == undefined ) {
		tip("请选择型号所属机构代码");
		return;
	}
	if ( scretLvl == null || scretLvl == '' ) {
		tip("请选择型号密级");
		return;
	}
	
	if ( typ == null || typ == '') {
		tip("请选择型号类型");
		return;
	}
	
	if ( techStatus == null || techStatus == '') {
		tip("请选择技术状态标识");
		return;
	}
	
	if ( orgId == null || orgId == '' || orgId == 0 ) {
		tip("请选择所属机构");
		return;
	}
	
	$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/makeModel/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/makeModel/map;id=1;name=1502武器系统;shortName=1502;status=定型;innerCode=123456;outCode=DS98833;corpId=3;orgDescr=机构1，机构2，机构3;typ=设计自筹;scretLvl=秘密;projAt=2015-09-09;modeledAt=2017-09-09;descr=奥卡索的房价/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/model/makeModel/{map}/{sys}",		        
		data:{
			"map": {
				"id": param("id"),
				"name": $$("name").value,	
				"shortName": $$("shortName").value,			
				"innerCode": $$("innerCode").value,
				"outCode": $$("outCode").value,
				"orgId": orgId,
				"orgDescr": $$("orgDescr").value,
				"typ": typ,
				"scretLvl": scretLvl,
				"projAt": $$("projAt").value,
				"modeledAt": $$("modeledAt").value,
				"descr": $$("descr").value,
				"techStatus": techStatus,
				"techVer":	$$("techVer").value,
			},					
			"sys": {"token": $.cookie("token")}					
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			
			if(!right(jsonData)) return;
			console.log(jsonData);

			window.location.href = '/iw/model/modelPage.html';

			if(param("id") == ""){
				tip("创建成功!");
			}else{
				tip("修改成功!");

			}
			backSecond();
		}
	});
}

//根据机构代码查询所属机构
function _commit() {
	var findCorpName = "";
	if ( $$("findCorpName").value != null &&  $$("findCorpName").value != "" ) {
		findCorpName = $$("findCorpName").value;
	}
	 
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/orgPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/orgPage/condition;status=正常;orgType=;code=00001;lvl=1;nameLike=浦东/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/org/orgPage/{condition}/{sys}" ,
		data: {
			"condition":{"status": "", "orgType": "", "code": "", "lvl": "", "nameLike": findCorpName},
			"sys": {"offset": $$("offset").value, "limit": $$("limit").value, "token": $.cookie("token")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			$("#findCorpName").val("");
			if (!right(jsonData)) return;
			toView(jsonData,true);	
		}
	});
}

//机构选中列表赋值
function corpChoice() {
	var  v = $('input:radio:checked').parent().parent().find("td[id='name']").text();
	$("input[id='corpName']").val(v);
	s = $('input:radio:checked').parent().parent().find("td[id='id']").text();
	$("input[id='corpId']").val(s);
}




