$(function() {
	
	var paramList = window.location.search.substring(1).split('&');
	var scheduleId
	for(i in paramList){
		var param = paramList[i]
		param = param.split('=')
		if(param[0]=='id')scheduleId = param[1]
	}
	var custId=$.cookie('custId');
	
	//将所有机构显示在参与机构多选框中,由插件实现
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
	
	$.ajax({  
		   type: "GET",//请求方式  
		   url: "/ih/schedules/"+scheduleId,//地址，就是action请求路径  
		   dataType: "json",//数据类型text xml json  script  jsonp  
		   success: function(msg){//返回的参数就是 action里面所有的有get和set方法的参数  
			   console.log(msg)
			   $("#code").val(msg.code); 
			   $("#name").val(msg.name); 
			   $("#startTime").val(msg.startTime); 
			   $("#endTime").val(msg.endTime); 
			   if(msg.responsible!=null){
				   $("#responsible").val(msg.responsible.name); 
			   }			   
			   $("#priority").val(msg.priority);
			   $("#organization").val(msg.responsible.corp.name);
			   $("#type").val(msg.type);
			   //所属任务与所属计划
			   if(msg.task!=null){
				   if(msg.task.schedule!=null){
					   $("#parentName").val(msg.task.schedule.name);
				   }
				   if(msg.task.name!=null){
					   $("#superTask").val(msg.task.name);
				   }	
			   }
			   //参与机构多选处理
			   if (msg.partner!=null){
				   var partners=msg.partner.split(",");
				   $('#partner').selectpicker('val', partners);
			   }
			   			  		   
			   $("#state").val(msg.state);
			   $("#status").val(msg.status);
		   }  
		});
	
	
	var tasksTable = $('#tasksTable').table(
		{
			url : '/ih/schedules/'+scheduleId+'/tasks',
			columns : [
				{
					title : '序号',
					increment : 1,
					width : '50px'
				},
				{
					title : '任务名称',
					data : 'name'
				},
				{
					title : '责任人',
					data : 'responsible.name'
				},
				{
					title : '开始时间',
					data : 'startTime',
				},
				{
					title : '结束时间',
					data : 'endTime'
				},
				{
					title : '前置任务',
					data : 'superTask'					
				},
				{
					title : '资源列表',
					data : 'resources'
				},
				{
					title : '说明',
					data : 'state'
				} 
				],

		})
			
	var planDataTable = $('#processTable').table(
		{
			url: "/ih/process/schedule/"+scheduleId,
			columns : [
				{
					title : '序号',
					increment : 1,
					width : '50px'
				},
				{
					title : '审批过程',
					data : 'code'
				},
				{
					title : '报批时间',
					data : 'name'
				},
				{
					title : '审批意见',
					data : 'responsible.name',
				},
				{
					title : '审批人',
					data : 'resolved'
				},
				{
					title : '审批时间',
					data : 'state'
				},
				{
					title : '审批信息',
					data : 'state',
					width : '200px'
				}
				],
		})
		

	//同意按钮事件
	$('#acceptButton').click(function() {
		var approvalInfo = document.getElementById("statement").value;
		$.ajax({
			url : "/ih/schedules/" + scheduleId + "/actions/review",
			type : "post",
			data : 'approvalOpinion=' + true + '&approvalInfo=' + approvalInfo,
			success : function(result) {
				if (result.status == "进行中") {
					alert("审批成功!");
					window.location = "/iw/org/welcome.html";
				} else {
					alert("审批失败!");
				}
			}
		});
	})
	
	//拒绝按钮事件
	$('#rejectButton').click(function(){	
		var approvalInfo=document.getElementById("statement").value;
		$.ajax({
			url: "/ih/schedules/"+scheduleId+"/actions/review",
	        type:"post",
            data:'approvalOpinion='+false+'&approvalInfo='+approvalInfo,
            success: function (result) {
                if (result.status=="编制中") {
                    alert("审批成功!");
                    window.location="/iw/org/welcome.html";
                }
                else {
                	alert("审批失败!");
                }
            }		
		}); 
	})
			
})