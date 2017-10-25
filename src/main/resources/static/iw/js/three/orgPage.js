_commit();
function _commit() {
	var orgPageThreeRole = {};
	var orgPageAllOne = [];
	var orgPageAllTow = [];
	var Lvl = $("input[name='lvl']:checked").map(function() {
		return $(this).attr("value");
	}).get().join(",").replace(/^,/,"");
	
	var status = $("input[name='status']:checked").map(function() {
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
		//@RequestMapping(value = "/orgPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/orgPage/condition;status=正常;orgType=;code=00001;lvl=1;nameLike=浦东/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/three/orgPage/{condition}/{sys}" ,
		data: {
			"condition":{"status": status, "orgType": orgType, "code": $$("code").value, "lvl": Lvl, "nameLike": $$("nameLike").value},
			"sys": {"offset": $$("offset").value, "limit": $$("limit").value, "token": $.cookie("token")}
		},
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			//console.log(jsonData);
			var orgPageAll = jsonData.result.orgPage;
			if( orgPageAll.length == 0 )return;
			for( var i = 0 , orgPageGetAll; i < orgPageAll.length; i++ ){
				orgPageGetAll = orgPageAll[i];
				var orgPageAlls = new Object();
				orgPageAlls = orgPageGetAll.threeRole;
				if(orgPageAlls == null)continue;
				orgPageAllOne = orgPageAlls.split(",");
				for( var s = 0,orgPagePerm; s < orgPageAllOne.length; s++ ){
					 orgPageAllTow = orgPageAllOne[s].split(":");
					 if(orgPageAllTow[0] == "审计管理员")
						 jsonData.result.orgPage[i].auditAdmin = orgPageAllTow[1];
					 if(orgPageAllTow[0] == "安全管理员")
						 jsonData.result.orgPage[i].secuAdmin = orgPageAllTow[1];
					 if(orgPageAllTow[0] == "系统管理员")
						 jsonData.result.orgPage[i].sysAdmin = orgPageAllTow[1];
					
				}
					
			}
			
			var orgPage = jsonData.result.orgPage; 
			for (var i = 0; corp = orgPage[i]; i++) corp.idAndOrgType = {"id": corp.id, "orgType": corp.orgType};
			console.log(jsonData);
			toView(jsonData,true);
			
		}
	});
}


function idAndOrgTypeValueTo(el,val){
		$(el).attr("onclick","location='orgDetail.html?id=" + val.id + "&orgType=" + val.orgType + "'");
}

function orgPage(el,value){
	 var id = $(el).parent().parent().find("[id='corpId']").text();
	    location.href = "/iw/three/subOrgDetail.html?id="+ id;
}

