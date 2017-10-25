supplyItemDetail();
var jattrs;
function supplyItemDetail() {

	if (!param("no")) return;
	
	$.ajax({		
		type: "post",
		//@RequestMapping(value = "/supplyItemDetail/{no}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/supplyItemDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/org/supplyItemDetail/{no}/{sys}",
		data:{
			"no": param("no"),			
			"sys": {"token": $.cookie("token")}
		},
		async: false,
		martrix:true,
		dataType: "json",
		success: function (data) {
			if (!right(data)) return;
			console.log(data);
			toView( {"result": {"supplyItem": data.result.supplyItem} });
//			cateAllByGrpCode();
			
//			$("#cateCode").val(data.result.supplyItem.cateCode)
			
			jattrs = null == data.result.supplyItem.jattrs ? {} : JSON.parse(data.result.supplyItem.jattrs);
			toViewAttrs(data.result.attrs, jattrs);
			
		}
			
	});
}

