$(function () {

    var paramList = window.location.search.substring(1).split('&');
    var scheduleId
    for (i in paramList) {
        var param = paramList[i]
        param = param.split('=')
        if (param[0] == 'id') scheduleId = param[1];
    }

    var custId = $.cookie('custId');

    //传入项目代号，项目名称及说明
    $.ajax({
        type: "GET",//请求方式
        url: "/ih/schedules/" + scheduleId,//地址，就是action请求路径
        dataType: "json",//数据类型text xml json  script  jsonp
        success: function (msg) {//返回的参数就是 action里面所有的有get和set方法的参数
            console.log(msg)
            $("#code").val(msg.code);
            $("#name").val(msg.name);
            $("#state").val(msg.state);
        }
    });

    //动态获取审批人id,获取审批人同机构下的人员列表
    $.ajax({
        type: "GET",//请求方式
        url: "/ih/user/workmates",//地址，就是action请求路径
        dataType: "json",//数据类型text xml json  script  jsonp
        success: function (msg) {//返回的参数就是 action里面所有的有get和set方法的参数
            console.log(msg)
            for (var i in msg) {
                var id = msg[i].id;
                var name = msg[i].name;
                $("#approverId").append("<option value=" + id + ">" + name + "</option>");
            }
        },
        error: function (msg) {
            alert(msg);
        }
    });

    //提交审批按钮事件
    $('#submit').click(function () {
        $.ajax({
            url: "/ih/schedules/" + scheduleId + "/actions/for‐review",
            type: "post",
            data: $("#submitInfoForm").serialize(),
            success: function (result) {
                if (result.status == "审批中") {
                    alert("提交成功!");
                    window.location = "../compilation/planOverview.html";
                }
                else {
                    alert("提交失败!");
                }
            },
            error: function (error) {
                alert(error.responseJSON.message);
            }
        });
    })

})