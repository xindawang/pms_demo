allPendInnerInquiry();
//型号管理列表
function allPendInnerInquiry() {
  $.ajax({ 
  	type: "post", 
  	//@RequestMapping(value = "/allPendInnerInquiry/{condition}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/supply/allPendInnerInquiry/condition;inquiryNum=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
  	url : apphost() + "/ils/supply/allPendInnerInquiry/{condition}/{sys}",
  	data:{
			"condition": {
				"inquiryNum": ""
			},
			"sys": {
				"token": $.cookie("token")}
  	},
  	dataType : "json",
  	async: false,
  	martrix:true,
  	success: function (jsonData) {
  		if (!right(jsonData)) return;
  		console.log(jsonData);
  		toView(jsonData,true);
  	}
	});
}
function innerInquiryDetail(el){
	var outInquiryId = $(el).parent().parent().find("input[name=outInquiryId]").val();
	location.href='innerInquiryDetail.html?outInquiryId=' + outInquiryId;
}

_commit();
//型号管理列表
function _commit() {
$.ajax({ 
	type: "post", 
	//@RequestMapping(value = "/pendInnerInquiryPage/{condition}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/supply/pendInnerInquiryPage/condition;inquiryNum=/sys;offset=;limmit=;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	url : apphost() + "/ils/supply/pendInnerInquiryPage/{condition}/{sys}",
	data:{
			"condition": {
				"inquiryNum": ""
			},
			"sys": {
				"offset" : $$("offset").value,
				"limit" : $$("limit").value,
				"token": $.cookie("token")}
	},
	dataType : "json",
	async: false,
	martrix:true,
	success: function (jsonData) {
		if (!right(jsonData)) return;
		console.log(jsonData);
		toView(jsonData,true);
	}
	});
}
