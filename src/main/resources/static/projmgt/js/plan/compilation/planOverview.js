var custId = $.cookie('custId');

$(function () {

    var plansTable = $('#plansTable').table({
        url: '/ih/schedules',
        type: "GET",// 请求方式
        columns: [
            {
                title: '序号',
                increment: 1,
                width: '50px'
            },
            {
                title: '计划代号',
                data: 'code'
            },
            {
                title: '计划名称',
                data: 'name'
            },
            {
                title: '责任人',
                data: 'responsible.name',
            },
            {
				title : '密级',
				data : 'securityLevel',
				number : { //通过number元素转换所传参数
					'ONE' : '机密',
					'TWO' : '秘密',
					'THREE' : '内部',
					'FOUR' : '非密'	
				},
			},
            {
                title: '状态',
                data: 'status'
            },
            {
                title: '分解计划',
                data: 'resolved',
                width: '50px'
            },
            {
                title: '完成率',
                element : "<span  class='pro'></span>"	
            },
            {
                title: '说明',
                data: 'state'
            },
            {
                title: '操作',
                width: '40%',
                element: "<a  class='btn btn-primary  info' >信息</a>" + "<a  class='btn btn-primary taskOfPlan' >任务</a>" + "<a  class='btn btn-primary monitoring' >监控</a>"
                + "<button  class='btn btn-danger delete'>删除</button>" + "<a class='btn btn-primary submitInfo' >提交审批</a>"
            }],
        afterDraw: function () {
            var that = this
			$('#plansTable span.pro').each(function(index, element) {	
				var progress
				var s=that.list[index].progress
                var ss=parseFloat(s)*100
                progress=ss.toString()+"%"
				$(this).text(progress)
			})
            // 查看信息详情
            $('#plansTable a.info').each(function (index, element) {
                var id = that.list[index].id
                var href = '/projmgt/plan/compilation/planDetail.html?id=' + id
                $(this).attr('href', href)
            })

            // 查看计划任务，若用户id与计划责任人id不同，则不显示按钮
            $('#plansTable a.taskOfPlan').each(function (index, element) {
                if (custId == that.list[index].responsible.id) {
                    var id = that.list[index].id
                    var href = '/projmgt/plan/compilation/taskOfPlan.html?id=' + id
                    $(this).attr('href', href)
                } else {
                    $(this).attr('disabled', "disabled");
                }
            })

            // 显示监控页面
            $('#plansTable a.monitoring').each(function (index, element) {
                var id = that.list[index].id
                var href = '/projmgt/plan/monitoring/plan.html?id=' + id
                $(this).attr('href', href)
            })

            // 计划状态为编制中，且用户正是责任人，方可进行删除操作，并弹出相关提示
            $('#plansTable button.delete').each(function (index, element) {
                if (that.list[index].status == "编制中" && custId == that.list[index].responsible.id) {
                    $(this).click(function () {
                        var scheduleId = that.list[index].id
                        var scheduleName = that.list[index].name
                        $(this).attr('data-toggle', "modal")
                        $(this).attr('data-target', "#myModal")

                        $("#confirmDeleteInfo").text("是否确认删除" + scheduleName + "？")
                        $("#confirmDelete").click(function () {
                            $.ajax({
                                url: "/ih/schedules/" + scheduleId,
                                type: "delete",
                                success: function (result) {
                                    if (result == 1) {
                                        alert("删除成功!");
                                        var c = plansTable.simplePagination.pagination('getPagesCount');
                                        plansTable.simplePagination.pagination('selectPage', c)
                                        window.location.reload();
                                    } else {
                                        alert("删除失败!");
                                    }
                                }
                            });
                        })
                    })
                } else {
                    $(this).attr('disabled', "disabled");
                    $(this).attr('style', "background:#ffffff")
                }
            })

            // 计划状态为编制中，且用户正是责任人，方可提交审批
            $('#plansTable a.submitInfo').each(function (index, element) {
                if (that.list[index].status == "编制中" && custId == that.list[index].responsible.id) {
                    var id = that.list[index].id
                    var href = '/projmgt/plan/approval/submitInfo.html?id=' + id
                    $(this).attr('href', href)
                } else {
                    $(this).attr('disabled', "disabled");
                }
            })

        }
    })

    //输入搜索条件，初始化计划列表
    $('#submit').click(function () {
        //清空表格数据
        plansTable.destroy();
        plansTable = $('#plansTable').table(
            {
                url: '/ih/schedules/getSchedulesByCondition?' + $("#searchCondition").serialize(),
                columns: [
                    {
                        title: '序号',
                        increment: 1,
                        width: '50px'
                    },
                    {
                        title: '计划代号',
                        data: 'code'
                    },
                    {
                        title: '计划名称',
                        data: 'name'
                    },
                    {
                        title: '责任人',
                        data: 'responsible.name',
                    },
                    {
                        title: '状态',
                        data: 'status'
                    },
                    {
                        title: '分解计划',
                        data: 'resolved',
                        width: '50px'
                    },
                    {
                        title: '完成率',
                        element : "<span  class='pro'></span>"	
                    },
                    {
                        title: '说明',
                        data: 'state'
                    },
                    {
                        title: '操作',
                        width: '40%',
                        element: "<a  class='btn btn-primary  info' >信息</a>" + "<a  class='btn btn-primary taskOfPlan' >任务</a>" + "<a  class='btn btn-primary monitoring' >监控</a>"
                        + "<button  class='btn btn-danger delete'>删除</button>" + "<a class='btn btn-primary submitInfo' >提交审批</a>"
                    }],
                afterDraw: function () {
                    var that = this
        			$('#plansTable span.pro').each(function(index, element) {	
        				var progress
        				var s=that.list[index].progress
                        var ss=parseFloat(s)*100
                        progress=ss.toString()+"%"
        				$(this).append(progress)
        			})
                    // 查看信息详情
                    $('#plansTable a.info').each(function (index, element) {
                        var id = that.list[index].id
                        var href = '/projmgt/plan/compilation/planDetail.html?id=' + id
                        $(this).attr('href', href)
                    })

                    // 查看计划任务，若用户id与计划责任人id不同，则不显示按钮
                    $('#plansTable a.taskOfPlan').each(function (index, element) {
                        if (custId == that.list[index].responsible.id) {
                            var id = that.list[index].id
                            var href = '/projmgt/plan/compilation/taskOfPlan.html?id=' + id
                            $(this).attr('href', href)
                        } else {
                            $(this).attr('disabled', "disabled");
                        }
                    })

                    // 显示监控页面
                    $('#plansTable a.monitoring').each(function (index, element) {
                        var id = that.list[index].id
                        var href = '/projmgt/plan/monitoring/plan.html?id=' + id
                        $(this).attr('href', href)
                    })

                    // 计划状态为编制中，且用户正是责任人，方可进行删除操作，并弹出相关提示
                    $('#plansTable button.delete').each(function (index, element) {
                        if (that.list[index].status == "编制中" && custId == that.list[index].responsible.id) {
                            $(this).click(function () {
                                var scheduleId = that.list[index].id
                                var scheduleName = that.list[index].name
                                $(this).attr('data-toggle', "modal")
                                $(this).attr('data-target', "#myModal")

                                $("#confirmDeleteInfo").text("是否确认删除" + scheduleName + "？")
                                $("#confirmDelete").click(function () {
                                    $.ajax({
                                        url: "/ih/schedules/" + scheduleId,
                                        type: "delete",
                                        success: function (result) {
                                            if (result == 1) {
                                                alert("删除成功!");
                                                var c = plansTable.simplePagination.pagination('getPagesCount');
                                                plansTable.simplePagination.pagination('selectPage', c)
                                                window.location.reload();
                                            } else {
                                                alert("删除失败!");
                                            }
                                        }
                                    });
                                })
                            })
                        } else {
                            $(this).attr('disabled', "disabled");
                            $(this).attr('style', "background:#ffffff")
                        }
                    })

                    // 计划状态为编制中，且用户正是责任人，方可提交审批
                    $('#plansTable a.submitInfo').each(function (index, element) {
                        if (that.list[index].status == "编制中" && custId == that.list[index].responsible.id) {
                            var id = that.list[index].id
                            var href = '/projmgt/plan/approval/submitInfo.html?id=' + id
                            $(this).attr('href', href)
                        } else {
                            $(this).attr('disabled', "disabled");
                        }
                    })

                }
            })


    })

    //初始化计划模板
    $('#addPlanByModel').click(function () {
        $.ajax({
            type: 'GET',
            url: '/ih/universal-schedules',
            data: {
                pageSize: 0,
                page: 0
            },
            dataType: 'json',
            success: function (msg) {
                for (var i in msg.list) {
                    var univScheduleId = msg.list[i].id
                    var univScheduleName = msg.list[i].name
                    $('#universalSchedule').append('<option value=' + univScheduleId + '>' + univScheduleName + '</option>')
                }

            }
        })

    })


    // 将表单中的内容提交
    $('#confirm').click(function () {
        var univScheduleId = document.getElementById("universalSchedule").value
        if (univScheduleId == null) {
            alert("请选择计划模板！");
        } else {
            window.location = "createPlan.html?univScheduleId=" + univScheduleId
        }
    })

})