//指定ID渲染
// if (!param("no")) return;
var nsn;
$.ajax({		
	type: "post",
	//@RequestMapping(value = "/ItemDetail/{no}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/cert/ItemDetail/1TvHN5mnd69b0hhmXOBWlx/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	url: apphost() + "/ils/cert/ItemDetail/{no}/{sys}",
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
		toView( {"result": {"item": data.result.item} });

		nsn = data.result.item.nsn;

		jattrs = null == data.result.item.jattrs ? {} : JSON.parse(data.result.item.jattrs);
		toViewAttrs(data.result.attrs, jattrs);
	}
		
});

_commit();
var jattrs;
function _commit() {
	if (!nsn) return;
	$.ajax({		
		type: "post",
		//@RequestMapping(value = "/supplyItemPage/{condition}/{sys}", produces = "text/plain")
		url: apphost() + "/ils/cert/supplyItemPage/{condition}/{sys}",
		data:{
			"condition": {"nsn": nsn},			
			"sys": {
				"offset": $$("offset").value,
				"limit": $$("limit").value, 
				"token": $.cookie("token")}
		},
		async: false,
		martrix:true,
		dataType: "json",
		success: function (data) {
			if (!right(data)) return;
			console.log(data);

			toView(data,true);		
			
		}
			
	});

}