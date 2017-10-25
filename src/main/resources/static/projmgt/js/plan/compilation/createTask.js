$(function () {

    var custId = $.cookie('custId');
    //此处id为scheduleId,而修改任务时id为taskId
    var paramList = window.location.search.substring(1).split('&');
    var id
    for (i in paramList) {
        var param = paramList[i]
        param = param.split('=')
        if (param[0] == 'id') id = param[1]
    }

    $.ajax({
        type: "GET",//请求方式
        url: "/ih/user/allCorps",//获取所有责任人
        asyn: false,
        dataType: "json",//数据类型text xml json  script  jsonp
        data: {
            id: custId
        },
        success: function (msg) {//返回的参数就是 action里面所有的有get和set方法的参数
            console.log(msg)
            var corps = msg;
            var sub = new Array(); // sub是第一层“0”的子集
            var subIndex = 0
            for (var i in corps) {
                var id = corps[i].id;
                var name = corps[i].name;
                var parentId = corps[i].parentId;
                if (parentId == 0) {
                    sub[subIndex++] = id
                    $("#choose").append("<li class='dropdownCorp' id=" + "li" + id + "><a>" + name + "</a></li>");
                }
            }
            var subSub = addSubMenu(corps, sub); //调用层级显示公司方法
            while (subSub.length != 0) {
                subSub = addSubMenu(corps, subSub);//逐层调用方法显示
            }

        },
        error: function () {
            console.log('error')
        }
    });

    function addSubMenu(allCorps, sub) {
        var subSub = new Array();
        var subSubIndex = 0
        for (var s in sub) {
            var hasSub = false
            for (var i in allCorps) {
                var id = allCorps[i].id;
                var name = allCorps[i].name;
                var parentId = allCorps[i].parentId;
                if (parentId == sub[s]) {
                    if (!hasSub) {
                        $("#" + "li" + sub[s]).addClass("dropdown-submenu");
                        $("#" + "li" + sub[s]).append("<ul id=ul" + sub[s] + " class='dropdown-menu'></ul>");
                        hasSub = true;
                    }
                    subSub[subSubIndex++] = id;
                    $("#" + "ul" + sub[s]).append("<li class='dropdownCorp' id=" + "li" + id + "><a>" + name + "</a></li>");
                }
            }
        }
        return subSub;
    }

    var allCusts	// 获取所有用户
    var flag	//设置标志位，让内层li在被调用后，外层li不再被调用，而点击选择按钮重新选择时，外层仍可以选择
    $("#choose").on("click", ".dropdownCorp", function () {
        if (flag == true) {
            console.log($(this));
            var corps = $(this)[0].innerText.split(/\r?\n/);		//按换行符分离字段
            $("#respCorp").val(corps[0])
            var thisCorpId = $(this)[0].id.replace("li", "");		//删除上文所加字符串
            $("#respPerson").empty();								//清空下拉框责任人
            $.ajax({
                type: "GET",//请求方式
                url: "/ih/user/allUsers",//获取所有责任人
                dataType: "json",//数据类型text xml json  script  jsonp
                data: {
                    id: custId
                },
                success: function (msg) {//返回的参数就是 action里面所有的有get和set方法的参数
                    allCusts = msg
                    for (var i in msg) {
                        var id = msg[i].id;
                        var name = msg[i].name;
                        var corpName = msg[i].corp.name;
                        var corpId = msg[i].corp.id;
                        if (corpId == thisCorpId) {
                            $("#respPerson").append("<option value=" + id + ">" + name + "/" + corpName + "</option>");
                        }
                    }
                }
            });
            flag = false;
        }
    });

    $("#chooseButton").click(function () {		//单击选择时恢复上层li可选
        flag = true;
    });

    var responsibleId
    $("#confirm").click(function () {		//模态框确认按钮事件
        responsibleId = document.getElementById("respPerson").value
        for (var i in allCusts) {
            var id = allCusts[i].id;
            var name = allCusts[i].name;
            var corpName = allCusts[i].corp.name;
            if (responsibleId == id) {
                $("#responsible").val(name + "/" + corpName);
            }
        }
    });
    
	var scheduleSecurityLevel	//获取计划密级，控制任务密级	
	$.ajax({
        type: "GET",//请求方式
        url: "/ih/schedules/" + id,//地址，就是action请求路径
        async: false,
        dataType: "json",//数据类型text xml json  script  jsonp
        success: function (msg) {
            scheduleSecurityLevel = msg.securityLevel;
        }
    });
	
	//获取密级
	$.ajax({
		type : "GET",// 请求方式
        url : "/ih/security-level",
        dataType : "json",// 数据类型text xml json script jsonp
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			console.log(msg)
			var scheduleSecurityCode
				for (var i in msg){
				   var id =msg[i].id;
				   if (id==scheduleSecurityLevel){
					   scheduleSecurityCode = msg[i].code;
				   }	   
			   }
			   for (var i in msg){
				   var id =msg[i].id;
				   var name =msg[i].name;
				   var secutiyCode=msg[i].code;
				   if (secutiyCode<=scheduleSecurityCode){
					   $("#securityLevel").append("<option value="+id+">"+name+"</option>");
				   }	   
			   }
		},
	});
    
    $.ajax({
        type: "GET",//请求方式
        url: '/ih/universaltask‐bases',//获取任务模板库
        data: {
            pageSize: 0,
            page: 0
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


    var univTaskId		//初始值为null,若选择任务模板则值改变
    var univTaskBaseId	//初始值为null,若选择任务模板库则值改变，后台需判断两个Id是否都不为空，否则都不进行存储
    var univTaskName
    var univTaskBaseName
    //保存按钮事件
    $('#save').click(function () {
        //对里程碑是否勾选的处理
        var milestone
        if ($('#milestone').is(':checked')) {
            milestone = 1;
        } else {
            milestone = 0;
        }
        var data = $("#taskDetailForm").serialize() + '&schedule=' + id + '&milestone=' + milestone + '&responsible=' + responsibleId
        if(univTaskName!=null&&univTaskBaseName!=null)
            data+='&univTaskName=' + univTaskName + '&univTaskBaseName=' + univTaskBaseName;
        $.ajax({
            url: "/ih/tasks",
            type: "post",
            data: data,
            success: function (result) {
                if (result == "success") {
                    alert("保存成功!");
                    window.location = "taskOfPlan.html?id=" + id;
                } else {
                    alert(result);
                }
            }

        });

    })

    //取消则返回计划任务列表
    $('#cancel').click(function () {
        window.location = "taskOfPlan.html?id=" + id;
    })

    //对任务模板联动选择的初步设想
    $("#universalTaskBase").change(function () {
        univTaskBaseId = $(this).children(':selected').val()
        univTaskBaseName = $(this).children(':selected').text();
        $("#universalTask").text("");
        $.ajax({
            type: "GET",//请求方式
            url: "/ih/universaltask‐bases/" + univTaskBaseId + "/universaltasks",//地址，就是action请求路径
            dataType: "json",
            success: function (msg) {//返回的参数就是 action里面所有的有get和set方法的参数
                for (var i in msg) {
                    var id = msg[i].id;
                    var name = msg[i].name;
                    $("#universalTask").append("<option value=" + id + ">" + name + "</option>");
                }

            }
        });
    })

    var duration
    //根据任务模板获取数据
    $("#universalTask").change(function () {
        univTaskId = $(this).children(':selected').val()
        univTaskName = $(this).children(':selected').text();
        $.ajax({
            type: "GET",//请求方式
            url: '/ih/universal‐tasks/' + univTaskId,//地址，就是action请求路径
            dataType: "json",
            success: function (msg) {//返回的参数就是 action里面所有的有get和set方法的参数
                $("#taskName").val(msg.name)
                $("#form").val(msg.form)
                $("#state").val(msg.state);
                $("#priority").val(msg.priority);
                duration = msg.duration;
                if (msg.milestone == 1) {
                    $("#milestone").prop('checked', true);
                } else if (msg.milestone == 0) {
                    $("#milestone").prop('checked', false);
                }
            }
        });
    })

    $("#startTime").change(function () {
        if (duration != null && $("#endTime").val() == "") {
            var startTime = $("#startTime").val()
            $("#endTime").val(getEndTime(startTime, duration));
        }
    })

    $("#endTime").change(function () {
        if (duration != null && $("#startTime").val() == "") {
            var endTime = $("#endTime").val()
            $("#startTime").val(getStartTime(endTime, duration));
        }
    })

    function getStartTime(endTime, duration) {
        var rest = duration;
        var lastDay = new Date(endTime);
        lastDay.setDate(lastDay.getDate() - 1);
        while (rest > 1) {
            if (isWorkday(lastDay)) {
                rest--;
            }
            lastDay.setDate(lastDay.getDate() - 1);
        }
        return lastDay.getFullYear() + "-" + (numFormat(lastDay.getMonth() + 1)) + "-" + numFormat(lastDay.getDate());
    }

    function getEndTime(startTime, duration) {
        var rest = duration;
        var nextDay = new Date(startTime);
        nextDay.setDate(nextDay.getDate() + 1);
        while (rest > 1) {
            if (isWorkday(nextDay)) {
                rest--;
            }
            nextDay.setDate(nextDay.getDate() + 1);
        }
        return nextDay.getFullYear() + "-" + (numFormat(nextDay.getMonth() + 1)) + "-" + numFormat(nextDay.getDate());
    }

    function numFormat(number) {
        var nineMonth = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9)
        if ($.inArray(number, nineMonth) != -1) {
            return "0" + number;
        } else {
            return number;
        }
    }

    function isWorkday(date) {
        var date = new Date(date);
        var getday = date.getDay();
        if (getday == 0 || getday == 6) {
            return false;
        } else {
            return true;
        }
    }

})