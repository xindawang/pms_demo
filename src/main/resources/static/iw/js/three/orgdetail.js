Commit();
function Commit() {
	if (!param("id")) return;
	$.ajax({
		type: "post",
		//http://localhost:81/ils/three/corpDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/three/corpDetail/{id}/{sys}",
		data:{
			"id": param("id"),
			"sys":{"token": $.cookie("token")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData);
		},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log("ajax request error: ", errorThrown);
			}
		});
	
}
//创建企业
function makeCorp(){

	var makeWhat;
	if (param("orgType") == "企业") makeWhat = "makeCorp";
	else if (param("orgType") == "普通机构") makeWhat = "makeNormalOrg";
	else if (param("orgType") == "认证机构") makeWhat = "makeCertOrg";

	if (!makeWhat) {
		tip("未知机构类型,不能创建.");
		return;
	}

	if ($$("name").value.length == 0){
		$$("name").focus();
		tip("全称不可为空");
		return;
	}
	if ($$("shortName").value.length == 0){
		$$("shortName").focus();
		tip("短称不可为空");
		return;
	}
	if ($$("bizCode").value.length == 0){
		$$("bizCode").focus();
		tip("组织机构为空");
		return;
	}

	$.ajax({
		type : "post",
		//@RequestMapping(value = "/makeCorp/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/makeCorp/map;id=0;name=上海精密车床高端制造有限公司;shortName=精密车床;bizCode=123456789023456789;descr=Eclipse中中文注释字体太小的解决方案;country=中国;province=上海;addr=四川北路525号宇航大厦2505室;zip=200000;contactor=张先生;contactorPhones=13585948840,18917408980;faxes=021-66886686;email=mrzhang@qq.com/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/three/" + makeWhat + "/{map}/{sys}",
			data: {
				"map":{
					"id": param("id") ? param("id") : 0,
					"code": $$("code").value, 
					"name": $$("name").value,
					"shortName": $$("shortName").value,
					"bizCode": $$("bizCode").value,
					"status": $$("status").value,
					"descr": $$("descr").value,
					"country": $$("country").value,
					"province": $$("province").value,
					"addr": $$("addr").value,
					"zip": $$("zip").value,
					"contactor": $$("contactor").value,
					"contactorPhones": $$("contactorPhones").value, 
					"faxes": $$("faxes").value,
					"email": $$("email").value},
		    	"sys":{"token": $.cookie("token")}
			},
			dataType: "json",
			async: false,
			martrix: true,
			success : function(jsonData) {
				if (!right(jsonData)) return;
				tip("成功");
				location.href = "/iw/three/orgPage.html";
			}
	});
}

