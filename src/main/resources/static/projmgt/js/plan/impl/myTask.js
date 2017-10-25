var custId= $.cookie('custId');

$(function() {
	
	// 未完成任务列表，计划审批通过后，计划相关任务会在此表显示，接受后方可分解与提交
	var unfinishedTable = $('#unfinishedTable').table({
		url : '/ih/user/'+custId+'/task/unfinished',
		columns : [ {
			title : '序号',
			increment : 1,
			width : '50px'
		}, {
			title : '任务名称',
			element : "<a  class='taskName' target='_parent' ></a>"
		}, {
			title : '优先级',
			data : 'priority'
		}, {
			title : '完成时间',
			data : 'endTime',
		}, {
			title : '状态',
			data : 'status'
		}, {
			title : '所属型号',
			data : 'schedule.type'
		}, {
			title : '所属计划',
			data : 'schedule.name'
		}, {
			title : '说明',
			data : 'state'
		}, {
			title : '操作',
			element : "<a  class='btn btn-primary accept'>接受</a>" + "<a class='btn btn-primary decomposition' target='_parent'>分解</a>" + "<a  class='btn btn-primary submit' target='_parent'>提交</a>"
		} ],
		afterDraw : function() {
			var that = this
			$('#unfinishedTable a.taskName').each(function(index, element) {
				var taskId = that.list[index].id
				var taskName = that.list[index].name
				var href = '/projmgt/plan/compilation/taskDetail.html?id=' + taskId
				$(this).append(taskName)
				$(this).attr('href', href)
			})

			$('#unfinishedTable a.accept').each(function(index, element) {
				if (that.list[index].status == "未接受") {
					var taskId = that.list[index].id
					$(this).click(function() {
						$.ajax({
							url : "/ih/tasks/"+taskId+"/actions/receive",
							type : "post",
							success : function(result) {
								if (result == 1) {
									alert("接受成功!");
									window.location.reload();
								} else {
									alert("接受失败!");
								}
							}
						});
					})
				} else {
					$(this).attr('disabled', "disabled");
				}
			})

			$('#unfinishedTable a.decomposition').each(function(index, element) {
				if (that.list[index].status == "进行中") {
					
					$(this).click(function() {
						var taskId = that.list[index].id
						$(this).attr('data-toggle', "modal")
						$(this).attr('data-target', "#myModal")
						
						//创建新计划
						$("#createPlan").click(function() {
							window.parent.location = "/projmgt/plan/compilation/createPlan.html?taskId=" + taskId
						})
						
						//根据计划模板创建新计划
						$('#addPlanByModel').click(function(){
							$.ajax({
								type:'GET',
								url:'/ih/universal-schedules',
								data:{
									pageSize:0,
									page:0
								},
								dataType:'json',
								success: function(msg){
									for(var i in msg.list){					
										var univScheduleId=msg.list[i].id
										var univScheduleName=msg.list[i].name
										$('#universalSchedule').append('<option value='+univScheduleId+'>'+univScheduleName+'</option>')						
									}
									
								}
							})
							
						})


						// 将计划模板表单中的内容提交
						$('#confirm').click(function(){
							var univScheduleId=document.getElementById("universalSchedule").value
							if (univScheduleId==null){
								alert("请选择计划模板！");
							}else{
								window.parent.location="/projmgt/plan/compilation/createPlan.html?univScheduleId="+univScheduleId+"&taskId=" + taskId
							}		 
						})		
						
					})

				} else {
					$(this).attr('disabled', "disabled");
				}
			})

			$('#unfinishedTable a.submit').each(function(index, element) {
				if (that.list[index].status == "进行中") {
					var taskId = that.list[index].id
					var href = '/projmgt/plan/impl/submitTask.html?id=' + taskId
					$(this).attr('href', href)
				} else {
					$(this).attr('disabled', "disabled");
				}
			})

		}
	})

	// 未完成审批列表，提交给此审批人的计划在此显示
	var unapprovedTable = $('#unapprovedTable').table({
		url : '/ih/user/'+custId+'/schedule/unchecked',
		columns : [ {
			title : '序号',
			increment : 1,
			width : '50px'
		}, {
			title : '审批内容',
			data : 'scheduleName'
		}, {
			title : '报批时间',
			data : 'submitTime'
		}, {
			title : '状态',
			element : "<lable>审批中</lable>"
		}, {
			title : '审批过程',
			element : "<lable>审核</lable>"
		}, {
			title : '附加信息',
			data : 'extras'
		}, {
			title : '操作',
			element : "<a  class='btn btn-primary  check'  target='_parent'>审批</a>",
			width : '200px'
		} ],
		afterDraw : function() {
			var that = this
			$('#unapprovedTable a.check').each(function(index, element) {
				var scheduleId = that.list[index].scheduleId
				var href = '/projmgt/plan/approval/submitDetail.html?id=' + scheduleId;
				$(this).attr('href', href)
			})
		}
	})

	// 已完成任务列表，任务提交后任务在此表显示
	var finishedTable = $('#finishedTable').table({
		url : '/ih/user/'+custId+'/task/finished',
		columns : [ {
			title : '序号',
			increment : 1,
			width : '50px'
		}, {
			title : '任务名称',
			element : "<a  class='taskName'  target='_parent'></a>"
		}, {
			title : '优先级',
			data : 'priority'
		}, {
			title : '完成时间',
			data : 'endTime',
		}, {
			title : '状态',
			data : 'status'
		}, {
			title : '所属型号',
			data : 'schedule.type'
		}, {
			title : '所属计划',
			data : 'schedule.name'
		}, {
			title : '说明',
			data : 'state'
		}, {
			title : '完成时间',
			data : 'finishTime',
		} ],
		afterDraw : function() {
			var that = this
			$('#finishedTable a.taskName').each(function(index, element) {
				var taskId = that.list[index].id
				var taskName = that.list[index].name
				var href = '/projmgt/plan/monitoring/task.html?id=' + taskId
				$(this).append(taskName)
				$(this).attr('href', href)
			})
		}
	})

	// 显示此审批人完成审批操作的任务，包括同意与拒绝的任务
	var approvedTable = $('#approvedTable').table({
		url : '/ih/user/'+custId+'/schedule/checked',
		columns : [ {
			title : '序号',
			increment : 1,
			width : '50px'
		}, {
			title : '审批内容',
			element : "<a  class='scheduleName'  target='_parent'></a>"
		}, {
			title : '报批时间',
			data : 'submitTime'
		}, {
			title : '状态',
			data : 'scheduleStatus',
		}, {
			title : '审批过程',
			element : "<lable>已审核</lable>"
		}, {
			title : '审批意见',
			element : "<lable class='approvalOpinion'></lable>"
		}, {
			title : '审批时间',
			data : 'approvalTime'
		}, {
			title : '附加信息',
			data : 'extras'
		} ],
		afterDraw : function() {
			var that = this
			$('#approvedTable lable.approvalOpinion').each(function(index, element) {
				var approvalOpinion
				if (that.list[index].approvalOpinion) {
					approvalOpinion = "同意"
				} else {
					approvalOpinion = "拒绝"
				}
				$(this).append(approvalOpinion)
			})

			$('#approvedTable a.scheduleName').each(function(index, element) {
				var scheduleId = that.list[index].scheduleId
				var scheduleName = that.list[index].scheduleName
				var href = '/projmgt/plan/approval/processInfo.html?id=' + scheduleId
				$(this).append(scheduleName)
				$(this).attr('href', href)
			})
		}
	})

})