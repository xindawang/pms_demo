_commit();
//型号管理列表
function _commit() {
    $.ajax({ 
    	type: "post", 
    	//http://localhost:81/ils/model/myModelPage/condition;codeLike=;techStatus=/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/model/myModelPage/{condition}/{sys}",
    	data:{
			"condition": { 
				"nameLike": $$("nameLike").value
			},
			"sys": {
				"offset": $$("modelOffset").value,
				"limit": $$("modelLimit").value, 
				"token": $.cookie("token")}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
    		console.log(jsonData);
    		for(var i = 0; i < jsonData.result.myModelPage.length; i++) {
    			var projAt = jsonData.result.myModelPage[i].projAt
    			var modeledAt = jsonData.result.myModelPage[i].modeledAt
    			
    			jsonData.result.myModelPage[i].projAt = toDate(projAt);
    			jsonData.result.myModelPage[i].modeledAt = toDate(modeledAt);
    		}
    		toView(jsonData,true);
    	}
	});
}
//页面传参
function href(el) {
	var id = $(el).parent().parent().find("[name='id']").val();
	location.href = "/iw/model/modelDetail.html?id=" + id;
} 

modelPaginate();
//型号分页控件
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
}
//页面传参
function fromConfig(el){
	var id = $(el).parent().parent().find("input[name='id']").val();
	var name = $(el).parent().parent().find("span[name='name']").text();
	location.href = "/iw/model/config.html?id=" + id + "&&name=" + name;
}