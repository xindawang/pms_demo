_commit();
//型号管理列表
function _commit() {
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

/*//型号分页控件
function modelPaginate() {
	if ($$("modelPage-nav")) {
		$("#modelPage-nav").pagination({
			items: $$("modelTotal").value,
			itemsOnPage: $$("modelLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("modelOffset").value = $$("modelLimit").value * (pageIndex - 1);

				_commit();
			}
		});
	}
}*/
