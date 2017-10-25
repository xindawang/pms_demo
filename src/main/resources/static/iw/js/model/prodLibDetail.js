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
	/*
	$(".st_tree").SimpleTree({
		click:function(a){
			$(".st_tree li").css("background-color","#fff");
			$(a).parent().css("background-color","#ccc");
		}
	});*/
});



if ( param("no") != "" ){
	prodLibDetail();
}


//产品详情
function prodLibDetail() {

	var unit = [];
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/prodLibDetail/{no}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/prodLib/corpPage/prodLibDetail;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/model/prodLibDetail/{no}/{sys}" ,
		data:{
			 "no": param("no"),
			"sys": {
				"token": $.cookie("token"),
			}					
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			
			for(var i = 0; i < $($('#unit').find("input[name='unit']")).length ; i++){
				unit = $($('#unit').find("input[name='unit']")[i]).val();
				
				if(unit == jsonData.result.prodLibDetail.unit){
					$($('#unit').find("input[name='unit']")[i]).attr("checked","checked");
					$('input[name="custom"]').val("");
					continue;
				}else{
					$($('#unit').find("input[value='自定义']")).attr("checked","checked");
				}
				
				if ( jsonData.result.prodLibDetail.unit == "undefined" || jsonData.result.prodLibDetail.unit == "") {
					$('input[name="custom"]').val("");
				} else {
					$('input[name="custom"]').val(jsonData.result.prodLibDetail.unit);
				}
				
			}
			if ( jsonData.result.prodLibDetail.nsn == null || jsonData.result.prodLibDetail.nsn == "" ) {
				$("#nsnCateCode").val("");
				$("#nsn").val("");
			} else {
				var nsnCateCode = jsonData.result.prodLibDetail.nsn.substring(0,4);
				var nsn =jsonData.result.prodLibDetail.nsn.substring(4,13);
				$("#nsnCateCode").val(nsnCateCode);
				$("#nsn").val(nsn);
			}
			var newat = jsonData.result.prodLibDetail.newat;
			toView(jsonData);			$("#newat").val(newat.toDate());
		}
	});
}

//创建型号或修改型号
function makeProdLib() {
	
	//必选
	var prodLibDetailName = $("input[name='prodLibDetail.name']").val();
	var prodLibDetailProdCode = $("input[name='prodLibDetail.prodCode']").val();
	var scretLvl =  $("input[name='prodLibDetail.scretLvl']:checked").val();
	
	//单选框
	var status = $("input[name='prodLibDetail.status']:checked").val();
	var typ = $("input[name='prodLibDetail.typ']:checked").val();
	var unit = $('input[name="unit"]:checked').val();
	
	//必选
	if(prodLibDetailName == "" || prodLibDetailName == null || prodLibDetailName == undefined) {
		tip("请填写产品名称");
		return;
	}
	
	if(prodLibDetailProdCode == "" || prodLibDetailProdCode == null || prodLibDetailProdCode == undefined) {
		tip("请填写产品代号/型号名称");
		return;
	} 
	
	if ( scretLvl == null || scretLvl == '' ) {
		tip("请选择密级");
		return;
	}
	
	if ( typ == null || typ == '' || typ == undefined) {
		tip("请选择类型");
		return;
	}
	
	//判断位数
	var nsnCateCode = $$("nsnCateCode").value; 
	var nsn = $$("nsn").value;
	var nsnLength = nsnCateCode.length + nsn.length;
	
	if (nsnCateCode.length != 4 && nsnCateCode.length != 0) {
		tip("NSN大小类长度不正确!");
		return;
	}
	
	if (nsn.length != 9 && nsn.length != 0) {
		tip("NSN识别号长度不正确!");
		return;
	}
	
	if (nsnLength != 13 && nsnLength != 0) {
		tip("NSN识别号或NSN大小类长度不正确!");
		return;
	}
	
	//单选框(判断操作)
	if (unit == null || unit == undefined || unit == "") {
		unit = "";
	}
	
	if (unit == "自定义") {
		unit = $('input[name="custom"]').val();
	}
	
	if ( status == null || status == '' || status == undefined) {
		status = "";
	}
	
	$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/makeProdLib/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/prodLib/makeProdLib/map;id=1;name=1502武器系统;shortName=1502;status=有效;
	    //techStatus=定型;innerCode=123456;outCode=DS98833;corpId=3;orgDescr=机构1，机构2，机构3;typ=设计自筹;scretLvl=秘密;
	    // projAt=2015-09-09;prodLibedAt=2017-09-09;descr=奥卡索的房价;flowStatus=审批通过/sys
	    //;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/model/makeProdLib/{map}/{sys}",		        
		data:{
			"map": {
				"no": param("no"),
				"partNo": $$("partNo").value,
				"prodCode": prodLibDetailProdCode,
				"name": $$("name").value,	
				"prodCodeTyp": $$("prodCodeTyp").value,
				"verCode": $$("verCode").value,
				"orgId":  $$("corpId").value,
				"nsn": $$("nsnCateCode").value + $$("nsn").value,
				"grpCode": $$("grpCode").value,
				"grpCate": $$("grpCate").value,
				"spec": $$("spec").value,
				"certStatus" : "认证通过",
				"unit": unit,
				"standard": $$("standard").value,
				"scretLvl": scretLvl,
				"status": "有效",
				"typ": typ,
				"features": $$("features").value,
				"descr": $$("descr").value,
			},		
			"sys": {"token": $.cookie("token")}					
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if(!right(jsonData)) return;
			console.log(jsonData);
			if(param("no") == ""){
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
		//	@RequestMapping(value = "/orgPage/{condition}/{sys}", produces = "text/plain")
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
