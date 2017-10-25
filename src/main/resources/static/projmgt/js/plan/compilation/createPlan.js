$(function() {
	
	var custId = $.cookie('custId');
	
	// 根据用户ID填入绑定的责任人和机构，计划只能以本人为责任人
	var responsibleSecurityLevel	//获取责任人密级，控制计划级别
	$.ajax({
		type : "GET",// 请求方式
		url : "/ih/user/userCorp",// 地址，就是action请求路径
		async: false,
		dataType : "json",// 数据类型text xml json script jsonp
		data : {
			id : custId
		},
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			$("#organization").val(msg.corp.name);
			$("#responsible").val(msg.name)
			responsibleSecurityLevel=msg.secretLvl
		},
		error :function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			alert(msg);
			window.location = "planOverview.html";
		}
	});
	
	var token = $.cookie('token');
	$.ajax({
		type : "GET",// 请求方式
        url : "/ils/model/myModelPage/condition;codeLike=;techStatus=/sys;limit=10;offset=0;token="+token,// 地址，就是action请求路径
        dataType : "json",// 数据类型text xml json script jsonp
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			console.log(msg)
			   for (var i in msg.result.myModelPage){
				   var id =msg.result.myModelPage[i].id;
				   var name =msg.result.myModelPage[i].name;
				   $("#type").append("<option value="+id+">"+name+"</option>");	   
			   }
		},
	});
	
    //将计划责任人密级字符串转换为代码
	function convertSecretLvl(secretString){
		if (secretString=="机密"){
			return 52;
		}else if (secretString=="秘密"){
			return 51;
		}else if (secretString=="内部"){
			return 41;
		}else if (secretString=="非密"){
			return 21;
		}else {
			return secretString;
		}
	}
	
	//获取密级
	$.ajax({
		type : "GET",// 请求方式
        url : "/ih/security-level",
        dataType : "json",// 数据类型text xml json script jsonp
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			console.log(msg)
			   for (var i in msg){
				   var id =msg[i].id;
				   var name =msg[i].name;
				   var secutiyCode=msg[i].code;
				   if (convertSecretLvl(responsibleSecurityLevel)>=secutiyCode){
					   $("#securityLevel").append("<option value="+id+">"+name+"</option>");
				   }	   
			   }
		},
	});
	
	// 判断计划是否为分解计划，若是则填入所属计划及所属人物
	var hasSuper
	var taskId
	var univScheduleId
	var category
	var sourceId
	if (location.search.indexOf("?") != -1) {
		var paramList = window.location.search.substring(1).split('&');
		for (i in paramList) {
			var param = paramList[i]
			param = param.split('=')
			if (param[0] == 'taskId'){
				taskId = param[1]
			}
			if (param[0] == 'univScheduleId'){
				univScheduleId = param[1]
			}
			if (param[0] == 'category'){
				category = param[1]
			}
			if (param[0] == 'sourceId'){
				sourceId = param[1]
			}			
		}
	}
	if (taskId!=null){
		hasSuper = true;
		$.ajax({
			type : "GET",// 请求方式
			url : "/ih/tasks/"+taskId,
			dataType : "json",
			success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
				console.log(msg)
				$("#superTask").val(msg.name);
				$("#parentName").val(msg.schedule.name);
			}
		});
	}else {
		hasSuper = false;
	}
	
	// 判断计划是否为分解计划，根据结果匹配对应的后台url
	var url
	if (hasSuper) {
		url = "/ih/tasks/"+taskId+"/actions/resolve";
	} else {
		url = "/ih/schedules";
	}
	
	// 将所有机构显示在参与机构多选框中,由插件实现
	$.ajax({
		type : "GET",// 请求方式
		url : "/ih/user/allCorps",// 地址，就是action请求路径
		dataType : "json",// 数据类型text xml json script jsonp
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			console.log(msg)
			for ( var i in msg) {
				var id = msg[i].id;
				var name = msg[i].name;
				$("#partner").append("<option value=" + id + ">" + name + "</option>");
			}
			$("#partner").selectpicker({
				style : 'btn-info',
				size : 10,
				width : '300px'
			});
		}
	});
	
	// 保存按钮事件，url根据是否为分解计划而定
	$('#save').click(function() {
		var partner = "";
		var obj = document.getElementById("partner");
		for (var i = 0; i < obj.options.length; i++) {
			if (obj.options[i].selected) {
				if (partner == "") {
					partner = obj.options[i].value;
				} else {
					partner = partner + "," + obj.options[i].value;
				}
			}
		}
		if (category==null){
			category=''
		}
		if (sourceId==null){
			sourceId=''
		}
		$.ajax({
			url : url,
			type : "post",
			data : $("#planDetailForm").serialize() + '&partner=' + partner + '&superTask=' 
			+ taskId + '&responsible=' + custId + '&univScheduleId='+univScheduleId+'&category=' +category+'&sourceId='+sourceId,
			success : function(result) {
				if (result == "success") {
					alert("保存成功!");
					window.location = "planOverview.html";
				} else {
					alert(result);
				}
			}
		
		});
		
	})

})