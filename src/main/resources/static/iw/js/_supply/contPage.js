
_commit();
Paginate();
var total;
//列表渲染
function _commit(){
	var namelike = $('input:radio:checked').val();
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/myContractPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/myContractPage/condition;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/myContractPage/{condition}/{sys}",
		data:{
			"condition": {
				"nameLike": namelike == "供货项目" ? $$(nameLike).value : "",
				"conNameLike": namelike == "供货合同" ? $$(nameLike).value : "",
			},
				
	        "sys": {"offset": $$("offset").value,
	    		"limit": $$("limit").value, 
	    		"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			total = jsonData.result.myContractPage.projTotal;
			toView(jsonData,true);
		}
	});
}
//分页控件
function Paginate() {
	if ($$("page-nav")) {
		$("#page-nav").pagination({
			items: total, 
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("offset").value = $$("limit").value * (pageIndex - 1);
				_corpCommit();
			}
		});
	}
}