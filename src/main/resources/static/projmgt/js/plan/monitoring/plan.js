$(function() {
	
	var paramList = window.location.search.substring(1).split('&');
	var scheduleId
	for(i in paramList){
		var param = paramList[i]
		param = param.split('=')
		if(param[0]=='id')scheduleId = param[1]
	}
	$.ajax({  
		   type: "GET",//请求方式  
		   url: "/ih/schedules/"+scheduleId,//地址，就是action请求路径  
		   dataType: "json",//数据类型text xml json  script  jsonp  
		   success: function(msg){//返回的参数就是 action里面所有的有get和set方法的参数  
			   console.log(msg)
			   $("#code").val(msg.code); 
			   $("#name").val(msg.name); 			  
			   $("#statement").val(msg.state);
			   
		   }  
	});	
	
	var planTable = $('#planTable').treeTable(
		{
			url : '/ih/schedules/'+scheduleId+"/tasks",
			columns : [
				{
					title : '序号',
					increment : 1,
					width : '50px'
				},
				{
					title : '任务名称',
					data : 'name',
					tree : true
				},
				{
					title : '责任人',
					data : 'responsible.name'
				},
				{
					title : '状态',
					data : 'status',
				},
				{
					title : '是否里程碑',
					element : "<label  class='milestone'></label>"		//通过element元素动态转换里程碑是否勾选，亦可如approval->processInfo中的element元素一样实现
				},
				{
					title : '计划开始时间',
					data : 'startTime'					
				},
				{
					title : '实际开始时间',
					element : "<label  class='acceptTime'></label>"
				},
				{
					title : '计划结束时间',
					data : 'endTime'					
				},
				{
					title : '实际结束时间',
					element : "<label  class='finishTime'></label>"
				}
				],afterDraw : function() {
					var that = this
					$('#planTable a.taskName').each(function(index, element) {
						var taskId = that.list[index].id
						var taskName = that.list[index].name
						var href = '/projmgt/plan/monitoring/task.html?id=' + taskId
						$(this).append(taskName)
						$(this).attr('href', href)
					})
					
					$('#planTable span.tree-title').click(function(){
						var tr = $(this).parents('tr');
						var id = tr.data('id');
						window.location='/projmgt/plan/monitoring/task.html?id=' + id;
					})
					
					$('#planTable label.milestone').each(function(index, element) {						
						var milestone
						if(that.list[index].milestone==1){
							milestone="是";
						}else{
							milestone="否";
						}
						$(this).append(milestone)
					})
					
					$('#planTable label.acceptTime').each(function(index, element) {						
						if(that.list[index].acceptTime!=null){
							$(this).append(that.list[index].acceptTime);
						}					
					})
					
					$('#planTable label.finishTime').each(function(index, element) {						
						if(that.list[index].finishTime!=null){
							$(this).append(that.list[index].finishTime);
						}					
					})
				}

		})
			
})