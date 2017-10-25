$(function() {
	//计划模板列表
	var schedulesTable = $('#schedulesTable').table(
		{
			url : '/ih/universal-schedules',
			type:"get",
			columns : [
				{
					title : '序号',
					increment : 1,
					width : '50px'
				},
				{
					title : '计划名称',
					data : 'name'
				},
				{
					title : '说明',
					data : 'state'
				},
				{
					title : '操作',
					element : "<a class='btn btn-primary info'>查看</a>" + "<button  class='btn btn-danger delete'>删除</button>"
//						+ "<button  class='btn btn-primary'>逻辑关系</button>" + "<button  class='btn btn-primary ' >数据关系</button>"
				} ],
			afterDraw : function() {
				//查看计划模板详情
				var that=this
				$('#schedulesTable a.info').each(function(index , element){
					var id =that.list[index].id
					var href='/projmgt/plan/universal/planDetail.html?id='+id
				    $(this).attr('href', href)
				})
				
			    //删除计划模板
				$('#schedulesTable button.delete').each(function(index, element) {
					var name =that.list[index].name
					var scheduleId =that.list[index].id
					$(this).click(function() {
						var status = confirm("确定删除"+name+"吗？")
						if (!status) {
							return false
						}
						$.ajax({
							type : "delete",
							url : "/ih/universal-schedules/"+scheduleId,
							success : function(data) {
								if (data == 1) {
									alert('删除成功')
								    schedulesTable.simplePagination.pagination('updateItems',(--schedulesTable.total))										
									var c = schedulesTable.simplePagination.pagination('getPagesCount');
									schedulesTable.simplePagination.pagination('selectPage', c)
								} else {
									alert('删除失败')
								}
							}
						});
					})
				})
			}
		})
		
//新建计划模板
	$('#addSchedule').click(
		function() {
			schedulesTable.addRow([ schedulesTable.total + 1, '<input id="scheduleName" class="atext"/>', '<input id="scheduleState" class="atext"/>',
				'<button class="btn btn-primary confirm">确认</button>' + '<button class="btn btn-primary cancel">取消</button>' ], function() {
				$('#schedulesTable').find('button.cancel').click(function() {
					schedulesTable.deleterow();
				})

				$('#schedulesTable').find('button.confirm').click(function() {
					$.ajax({
						type : "post",
//						dataType : "json",
						url : "/ih/universal-schedules",
						data : {
							name : $('#scheduleName').val(),
							state : $('#scheduleState').val()
						},
						success : function(data) {
							if (data =="success") {
								alert("添加成功");								
								schedulesTable.simplePagination.pagination('updateItems',(++schedulesTable.total))								
								schedulesTable.selectPage(schedulesTable.simplePagination.pagination('getPagesCount'))
							} else {
								alert(data);
							}
						}
					})
				})
			});
			
		})
		

//任务模板库列表
		var taskBaseTable =$('#taskBaseTable').table({
			url:'/ih/universaltask‐bases',
			type:"get",
			columns:[
				{
					title : '序号',
					increment : 1,
					width : '50px'
				},
				{
					title : '任务库名称',
					data : 'name'
				},
				{
					title : '说明',
					data : 'state'
				},
				{
					title : '操作',
					element :  "<button  class='btn btn-danger delete' >删除</button>"
				}],
			afterDraw : function() {
				var that = this
				$('#taskBaseTable button.delete').each(function(index, element) {
					var uniTaskBaseId=that.list[index].id	
					var name = that.list[index].name
					$(this).click(function() {	
						$("#uniTaskBase").text("");
						$(this).attr('data-toggle', "modal")
						$(this).attr('data-target', "#myModal")
						$.ajax({
							type : "GET",
							url : "/ih/universaltask‐bases",
							data : {
								pageSize : 0,
								page :0
							},
							dataType : "json",
							success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
								for ( var i in msg.list) {
									var id = msg.list[i].id;
									var name = msg.list[i].name;
									if (id!=uniTaskBaseId){
										$("#uniTaskBase").append("<option value=" + id + ">" + name + "</option>");
									}
								}
							}
						});	
						
						//删除任务库点击事件
						$("#delTaskBase").click(function() {
							var status = confirm("确定删除吗？")
							if (!status) {
								return false
							}
							$.ajax({
								type : "delete",
								url : "/ih/universaltask‐bases/"+uniTaskBaseId,
								dataType : 'json',
								success : function(data) {
									if (data == true) {
										alert('删除成功')
									    taskBaseTable.simplePagination.pagination('updateItems',(--taskBaseTable.total))										
										taskBaseTable.simplePagination.pagination('selectPage', 1)
										window.location.reload();
									} else if (data == false) {
										alert('删除失败')
									}else{
										alert('服务器返回值错误')
									}
								}
							});
						})
						
						//转移任务库确认点击事件
						$("#transfer").click(function() {
							var toUniTaskBaseId = document.getElementById("uniTaskBase").value;
							if (toUniTaskBaseId=="") {
								alert("请选择转移目的任务库");
								return false
							}
							var status = confirm("确定转移吗？")
							if (!status) {
								return false
							}
							$.ajax({
								type : "post",
								url : "/ih/universaltask‐bases/transferToTaskBase",
								dataType : 'json',
								data : {									
									'uniTaskBaseId': uniTaskBaseId,
									'toUniTaskBaseId': toUniTaskBaseId
								},
								success : function(data) {
									if (data == 1) {
										alert('转移成功')
									    taskBaseTable.simplePagination.pagination('updateItems',(--taskBaseTable.total))										
										taskBaseTable.simplePagination.pagination('selectPage', 1)
									} else {
										alert('转移失败')
									}
								}
							});
						})
						
					})
				})
			}
		})
		
//新建任务模板库
	$('#addTasksBase').click(
		function() {
			taskBaseTable.addRow([ taskBaseTable.total + 1, '<input id="taskBaseName" class="atext"/>', '<input id="taskBaseState" class="atext"/>',
				'<button class="btn btn-primary confirm">确认</button>' + '<button class="btn btn-primary cancel">取消</button>' ], function() {
				$('#taskBaseTable').find('button.cancel').click(function() {
					taskBaseTable.deleterow();
				})

				$('#taskBaseTable').find('button.confirm').click(function() {
					$.ajax({
						type : "post",
//						dataType : "json",
						url : "/ih/universaltask‐bases",
						data : {
							name : $('#taskBaseName').val(),
							state : $('#taskBaseState').val()
						},
						success : function(data) {
							if (data == "success") {
								alert("添加成功");								
								taskBaseTable.simplePagination.pagination('updateItems',(++taskBaseTable.total))								
								taskBaseTable.selectPage(taskBaseTable.simplePagination.pagination('getPagesCount'))
							} else {
								alert(data);
							}
						}
					})
				})
			});
			
		})		
		
//任务模板列表初始化
		var uniTasksTable =$('#uniTasksTable').table({
			url:'/ih/universal‐tasks',
			type:"get",
			columns:[
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
					title : '工期',
					data : 'duration'
				},
				{
					title : '优先级',
					data : 'priority'
				},
				{
					title : '说明',
					data : 'state'
				},
				{
					title : '操作',
					element :  "<a class='btn btn-primary info'>查看</a>"+"<button class='btn btn-danger delete' >删除</button>"
				}],
				afterDraw : function() {
					var that=this
					// 查看任务模板详情
					$('#uniTasksTable a.info').each(function(index, element) {
						var id = that.list[index].id
						var href ='/projmgt/plan/universal/taskDetail.html?id=' + id
						$(this).attr('href', href)
					})
					
					$('#uniTasksTable button.delete').each(function(index, element) {
						var name = that.list[index].name
						var taskId = that.list[index].id
						$(this).click(function() {
							var status = confirm("确定删除"+name+"吗？")
							if (!status) {
								return false
							}
							$.ajax({
								type : "delete",
								url :'/ih/universal‐tasks/'+taskId,
								dataType : 'json',
								success : function(data) {
									if (data == 1) {
										alert('删除成功')
									    uniTasksTable.simplePagination.pagination('updateItems',(--uniTasksTable.total))										
										uniTasksTable.simplePagination.pagination('selectPage', 1)
									} else {
										alert('删除失败')
									}
								}
							});
						})
					})
				}						
		})		

})