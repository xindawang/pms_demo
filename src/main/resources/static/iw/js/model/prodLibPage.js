function showOrHideTable(el) {
	var that = $(el);
	var id = $(el).data("id");
	var trs = $("tr.detail");
	$.each(trs,function(index,detail){
		if($(detail).data("id")==id){
			if($(detail).is(":hidden")){
				$(detail).show();
				console.log($(el));
				that.find('span').addClass("glyphicon-minus").removeClass("glyphicon-plus");
			}else{
				$(detail).hide();
				that.find('span').addClass("glyphicon-plus").removeClass("glyphicon-minus");
			}
		}
	});
}	
_commit();

//设计产品库管理列表
function _commit() {
    $.ajax({ 
    	type: "post", 
    	//@RequestMapping(value = "/prodLibPage/{condition}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/prodLib/prodLibPage/condition;nameLike=;scretLvl=公开,秘密;status=初始,已报价/sys;limit=10;offset=0;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/model/prodLibPage/{condition}/{sys}",
    	data:{
			"condition": { 
				"name": $$("nameLike").value,
				"scretLvl": "",
				"status": ""
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
    		for(var i = 0; i < jsonData.result.myProdLibPage.length; i++) {
    			var nsnCate = jsonData.result.myProdLibPage[i].nsn;
    			var myUnit = jsonData.result.myProdLibPage[i].unit;
    			if(myUnit == null || myUnit == "undefined" || myUnit == undefined){
    				jsonData.result.myProdLibPage[i].unit = "";
    			}
    			if (nsnCate == null || nsnCate == "" || nsnCate == undefined) continue;
    			var nsnCates = nsnCate.substr(0,4);
    			var nsnshibie = nsnCate.substr(4,13);
    			jsonData.result.myProdLibPage[i].nsnCates = nsnCates;
    			jsonData.result.myProdLibPage[i].nsnshibie = nsnshibie;
    			var newat = jsonData.result.myProdLibPage[i].newat.toDate();
    			jsonData.result.myProdLibPage[i].newat = newat;
    		}
    		toView(jsonData,true);
    	}
	});
}

ProdLibPaginate();

//分页控件
function ProdLibPaginate() {
	if ($$("prodLibPage-nav")) {
		$("#prodLibPage-nav").pagination({
			items: $$("prodLibTotal").value,
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("offset").value = $$("limit").value * (pageIndex - 1);

				_commit();
			}
		});
	}
}

//页面传参
function href(el) {
	var no = $(el).parent().parent().find("[name='no']").val();
	location.href = "/iw/model/prodLibDetail.html?no=" + no;
}

//展开页面列表
function RNValueTo(el, val) {
    $(el).attr("data-id", val);
}