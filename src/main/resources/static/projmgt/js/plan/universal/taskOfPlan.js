$(function () {

    //创建计划模板的任务

    //id 为计划模板的id
    var custId = $.cookie('custId');
    var paramList = window.location.search.substring(1);
    var id
    param = paramList.split('=')
    if (param[0] == 'id')
        id = param[1]


    //任务模板库的初始化
    $.ajax({
        type: "GET",//请求方式
        url: "/ih/universaltask‐bases",
        data: {
            page: 0,
            pageSize: 0
        },
        dataType: "json",
        success: function (msgs) {//返回的参数就是 action里面所有的有get和set方法的参数
            for (var i in msgs.list) {
                var id = msgs.list[i].id;
                var name = msgs.list[i].name;
                $("#universalTaskBase").append("<option value=" + id + ">" + name + "</option>");
            }
        }
    });
    
    
	//获取密级
	$.ajax({
		type : "GET",// 请求方式
        url : "/ih/security-level",
        async: false,
        dataType : "json",// 数据类型text xml json script jsonp
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			   for (var i in msg){
				   var id =msg[i].id;
				   var name =msg[i].name;
				   $("#securityLevel").append("<option value="+id+">"+name+"</option>");	   
			   }
			   $('#securityLevel').val("4")
		},
	});

    //保存按钮事件,即为计划模板创建任务
    $('#save').click(function () {
        //对里程碑是否勾选的处理
        var milestone
        if ($('#milestone').is(':checked')) {
            milestone = 1;
        } else {
            milestone = 0;
        }
        $.ajax({
            url: "/ih/universal-schedules/task",
            type: "post",
            data: $("#uniScheduleTaskForm").serialize() + '&uniSchedule=' + id + '&milestone=' + milestone
            + '&responsible=0' + '&univTaskId=' + univTaskName+ '&univTaskBaseId=' + baseName,
            success: function (result) {
                if (result == "success") {
                    alert("保存成功!");
                    window.location = "planDetail.html?id=" + id;
                }
                else {
                    alert(result);
                }
            }

        });

    })

    //取消则返回计划模板详情页
    $('#cancel').click(function () {
        window.location = "planDetail.html?id=" + id;
    })

    var baseId
    var baseName
    //任务模板模板的联动
    $('#universalTaskBase').change(function () {
        $("#universalTask").text("");
        baseId = $(this).children(':selected').val();
        baseName = $(this).children(':selected').text();
        $.ajax({
            type: "GET",
            url: "/ih/universaltask‐bases/" + baseId + "/universaltasks",
            dataType: 'json',
            success: function (msg) {
                for (var i in msg) {
                    var tasId = msg[i].id
                    var taskName = msg[i].name
                    $('#universalTask').append('<option value=' + tasId + '>' + taskName + '</option>')
                }

            }

        });
    })

    var univTaskId
    var univTaskName
    //获取任务模板获取的数据
    $("#universalTask").change(function () {
        univTaskId = $(this).children(':selected').val();
        univTaskName = $(this).children(':selected').text();
        $.ajax({
            type: "GET",//请求方式
            url: "/ih/universal‐tasks/" + univTaskId,
            dataType: "json",
            success: function (msg) {//返回的参数就是 action里面所有的有get和set方法的参数
                $("#taskName").val(msg.name)
                $("#duration").val(msg.duration)
                $("#form").val(msg.form)
                $("#state").val(msg.state);
                $("#priority").val(msg.priority);

                if (msg.milestone == 1) {
                    $("#milestone").prop('checked', true);
                } else if (msg.milestone == 0) {
                    $("#milestone").prop('checked', false);
                }
            }
        });
    })


})