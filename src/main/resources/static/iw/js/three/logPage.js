/*
 * 列表显示
 */
_commit(true);
function _commit(needRefresh) {
		
	$.ajax({ 
		type: "post", 
		 // http://localhost:81/ils/three/logPage/condition;loginName=系统管理员;domain=three;action=login/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/three/logPage/{condition}/{sys}", 	   
	    data:{
	    	"condition": {"loginName": $$("loginNames").value, "domain": $$("logDomain").value, "action": $$("logAction").value},
	    	"sys": {"offset": $$("offset").value, "limit": $$("limit").value, "token": $.cookie("token")}
	    },			    		
		dataType : "json", 
		async: false,
		martrix:true,
		success: function (jsonData) {	
			if (!right(jsonData)) return;
			for(var i = 0, log;i < jsonData.result.logPage.length; i++){
				log = jsonData.result.logPage[i];
				log.infoAfter = JSON.stringify(log.infoAfter);
				log.infoBefore = JSON.stringify(log.infoBefore);
				
			}    
			console.log(jsonData);
			toView(jsonData,true);
			
		}
	});
}
//获取当前ID并进行渲染
var currLoginName = "";
var currInfoBefore = "";
var currInfoAfter = "";
function log(el) {

	console.log($(el).parent().parent().find("[name='infoAfter']"));
	console.log($(el).parent().parent().find("[name='infoAfter']").val());
	$("#currLoginName").text($(el).parent().parent().find("[name='loginName']").text());
	$("#currInfoAfter").text( JSON.parse($(el).parent().parent().find("[name='infoAfter']").val()) );
	$("#currInfoBefore").text( JSON.parse($(el).parent().parent().find("[name='infoBefore']").val()) );
	
}