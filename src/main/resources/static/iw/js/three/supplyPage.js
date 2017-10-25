_commit();
function _commit() {
	
	var lvl = $("input[name='lvl']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	var status = $("input[name='status']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	var supplyType = $("input[name='supplyType']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	var orgType = $("input[name='orgType']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
		
	 var corpId = $.cookie("corpId");
	 if(corpId != 1){
		 $("button[id=1]").remove();
	 }
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/supplyPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/supplyPage/condition;status=正常;orgType=;code=00001;lvl=1;nameLike=浦东;supplyType=内部供应商/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/three/supplyPage/{condition}/{sys}" ,
		data: {
			"condition":{"status": status, "orgType": orgType, "code": $$("code").value, "lvl": lvl, "nameLike": $$("nameLike").value, "supplyType": supplyType},
			"sys": {"offset": $$("offset").value, "limit": $$("limit").value, "token": $.cookie("token")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData,true);
	},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log("ajax request error: ", errorThrown);
		}
	});
}

//跳转页面到机构详情
function makeNormalOrg(el,val){
	    var id = $(el.parentNode.parentNode).find("td[name='id']").text();
		location.href = "/iw/three/orgDetail.html?id="+id;
}

