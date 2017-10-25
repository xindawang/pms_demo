$.ajax({
	type: "post",
	//@RequestMapping(value = "/itemAttr/{isPrice}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/admin/logout/2FirU7AKR6VrA-AlT8gkxg2FirU7AKR6VrA-AlT8gkxg/sys
	url: apphost() + "/ils/supply/itemAttr/{isPrice}/{sys}",
	data:{
		"isPrice": false,			
        "sys": $.cookie("token")
	},
	dataType: "json",
	async: false,
	martrix:true,
	success: function (data) {
		if (!right(data)) return;
		console.log(data);
		toView(data,true);
	}
});

$("#items").height($(window).height()-200);