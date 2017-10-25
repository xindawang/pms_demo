//进页面请求数据
_commit();
function _commit() {
    $.ajax({ 
    	type: "post", 
    	// @RequestMapping(value = "/searchNodePage/{condition}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/model/searchNodePage/condition;status=有效;nameLike=1402/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/model/searchNodePage/{condition}/{sys}",
    	data:{
			"condition": { 
				"nameLike":$("#nameLike").val(),
				"rootId": param("id")
			},
			"sys": {
				"offset": $$("offset").value,
				"limit": $$("limit").value, 
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

/*function bomDetailByName(el, value) {
	 $(el).attr("href", "/iw/model/bomDetail.html?id=" + value);
}*/
//将返回数据中的0与1转成是与否再进行显示
function changeValueTo(el, value){
	if(value == "0"){
		value = "否";
	} else{
		value = "是";
	}
	valueToWithNoFunc(el, value);
}

pagePaginate();
//分页控件
function pagePaginate() {
	if ($$("page-nav")) {
		$("#page-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("offset").value = $$("limit").value * (pageIndex - 1);
				_commit();
			}
		});
	}
}