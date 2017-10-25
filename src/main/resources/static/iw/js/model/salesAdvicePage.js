//进页面请求数据
_commit();
function _commit() {
	var status = $("input[name='status']:checked").val();
	if(status == "全部"){
		status = "";
	}
	console.log(status);
  $.ajax({ 
  	type: "post", 
  	// @RequestMapping(value = "/proposalPage/{condition}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/model/proposalPage/condition;nameLike=;modelNameLike=;status=/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
  	url : apphost() + "/ils/model/proposalPage/{condition}/{sys}",
  	data:{
			"condition": { 
				"nameLike": $("#nameLike").val(),
				"modelNameLike": $("#modelNameLike").val(),
				"status": status
			},
			"sys": {
				"offset": $$("proposalOffset").value,
				"limit": $$("proposalLimit").value, 
				"token": $.cookie("token")}
  	},
  	dataType : "json",
  	async: false,
  	martrix:true,
  	success: function (jsonData) {
  		if (!right(jsonData)) return;
  		console.log(jsonData);
  		for(var i = 0; i < jsonData.result.proposalPage.length; i++) {
  			var newat = jsonData.result.proposalPage[i].newat;
			jsonData.result.proposalPage[i].newat = toDate(newat);
		}
  		toView(jsonData,true);
  	}
	});
}

//页面传参(修改按钮)
function forsalesAdviceDetail(el) {
	var id = $(el).parent().parent().find("[name='id']").val();
	location.href = "/iw/model/salesAdviceDetail.html?id=" + id;
}
pagePaginate();
//分页控件
function pagePaginate() {
	if ($$("proposalPage-nav")) {
		$("#proposalPage-nav").pagination({
			items: $$("proposalTotal").value,
			itemsOnPage: $$("proposalLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("proposalOffset").value = $$("proposalLimit").value * (pageIndex - 1);
				_commit();
			}
		});
	}
}
