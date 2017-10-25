$(function() { 
	
	var custId =$.cookie('custId');
 
	//将所有任务库显示在下拉框中,由插件实现
	$.ajax({
		type : "GET",
		url : "/ih/universaltask‐bases",
		data:{
			page:0,
			pageSize:0
		},
		dataType : "json",
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			for ( var i in msg.list) {
				var id = msg.list[i].id;
				var name = msg.list[i].name;
				$("#baseId").append("<option value=" + id + ">" + name + "</option>");
			}
		}
	});	
	
	
	//保存按钮事件
	$('#save').click(function(){
		//对里程碑是否勾选的处理
		var milestone
		if($('#milestone').is(':checked')){
			milestone=1;
		}else{
			milestone=0;
		}
		$.ajax({
	    	url: "/ih/universal‐tasks",
	        type:"post",
            data:$("#uniTaskForm").serialize()+'&milestone='+milestone,
            success: function (result) {
                if (result=="success") {
                    alert("保存成功!");
                    window.location="planLib.html";
                }
                else {
                	alert(result);
                }
            }
		
		});
	        
	})
	
	//取消则返回计划任务列表，似乎session中没有custId
	$('#cancel').click(function(){	
		window.location="planLib.html";
	})


})