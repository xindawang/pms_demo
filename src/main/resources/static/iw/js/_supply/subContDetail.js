
$.ajax({
	type: "post",
	//@RequestMapping(value = "/newContractDetail/{id}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/org/newContractDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	url: apphost() + "/ils/supply/newContractDetail/{id}/{sys}",
	data:{
		"id": param("id"),			
        "sys": {"token": $.cookie("token")}
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