$(function () {

    //此处id为taskId,而创建任务时id为scheduleId
    var custId = $.cookie('custId');
    var paramList = window.location.search.substring(1);
    var id
    param = paramList.split('=')
    if (param[0] == 'id')
        id = param[1]

    //将所有任务库显示在下拉框中,由插件实现
    $.ajax({
        type: "GET",
        url: "/ih/universaltask‐bases",
        dataType: "json",
        data: {
            page: 0,
            pageSize: 0
        },
        success: function (msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
            for (var i in msg.list) {
                var baseId = msg.list[i].id;
                var baseName = msg.list[i].name;
                $("#baseId").append("<option value=" + baseId + ">" + baseName + "</option>");
            }
        }
    });

    $.ajax({
        type: "GET",
        url: "/ih/universal‐tasks/" + id,// 地址，就是action请求路径
        dataType: "json",
        success: function (msg) {// 返回的参数就是 action里面所有的有get和set方法的参数

            $("#name").val(msg.name);
            $("#duration").val(msg.duration);
            $("#priority").val(msg.priority);
            $("#baseId").val(msg.baseId);
            $("#state").val(msg.state);
            $("#form").val(msg.form);

            if (msg.milestone == 1) {
                $("#milestone").attr('checked', "checked");
            }
            ;

        }
    });


    $('#edit').click(function () {
        $('.edit').attr('disabled', false);
    })

    $('#save').click(function () {
        //对里程碑是否勾选的处理
        var milestone
        if ($('#milestone').is(':checked')) {
            milestone = 1;
        } else {
            milestone = 0;
        }
        $.ajax({
            url: "/ih/universal‐tasks/" + id,
            type: "post",
            data: $("#uniTaskForm").serialize() + '&id=' + id + '&milestone=' + milestone,
            success: function (result) {
                if (result == "success") {
                    alert("保存成功!");
                    window.location = "/projmgt/plan/universal/planLib.html";
                }
                else {
                    alert(result);
                }
            }

        });

    })

    //数据列表
    var dataTable = $('#dataTable').treeTable({
        url: '/ih/universal‐tasks/' + id + '/data',
        columns : [
			{
				title : '序号',
				increment : 1,
				width : '50px'
			},
			{
				title : '数据元素名称',
				data : 'name',
				tree : true
			},
			{
				title : '简称',
				data : 'abbr'
			},
			{
				title : '代码',
				data : 'code'
			},
			{
				title : '选填/必填',
				data : 'fill',
				number : { //通过number元素转换所传参数
					'ZERO' : '选填',
					'ONE' : '必填'
				},
			},
			{
				title : '重复次数',
				data : 'frequency',
				number : { //通过number元素转换所传参数
					'ZERO' : '一次',
					'ONE' : '多次'
				},
			},
			{
				title : '输入/输出',
				data : 'input_output',
				number : { //通过number元素转换所传参数
					'ZERO' : '输入',
					'ONE' : '输出',
					'TWO' : '输入输出'
				},
			},
			{
				title : '类型',
				data : 'type',
				number : { //通过number元素转换所传参数
					'ZERO' : '文本',
					'ONE' : '数值',
					'TWO' : '物项',
					'THREE' : '文件'	
				},
			},
            {
                title: '操作',
                element: "<button  class='btn btn-primary upgrade' >升级</button>"
                + "<button  class='btn btn-primary downgrade' >降级</button>"
                + "<button  class='btn btn-primary up' >上移</button>"
                + "<button  class='btn btn-primary down' >下移</button>"
                + "<button  class='btn btn-danger delete' >删除</button>"
            }],
        afterDraw: function () {
            var that = this

            //升级按钮事件
            $('#dataTable button.upgrade').each(function (index, element) {
                var dataId = $(element).parent().parent().data('id')
                var parent = $(element).parent().parent().data('parent')
                $(this).click(function () {
                    if (parent != null) {
                        $.ajax({
                            url: "/ih/data/actions/upgrade",
                            type: "post",
                            data: {
                                id: dataId
                            },
                            success: function (result) {
                                if (result == 1) {
                                    alert("升级成功!");
                                    window.location = "taskDetail.html?id=" + id;
                                }
                                else {
                                    alert("升级失败!");
                                }
                            }
                        });

                    } else {
                        alert('此任务为一级任务，不能升级!')
                    }

                })
            })

            //降级按钮事件
            $('#dataTable button.downgrade').each(function (index, element) {
                var dataId = $(element).parent().parent().data('id')
                var order=parseInt($($(element).parents('tr').children('td')[0]).text())       //取出本行行号
                var parent = $(element).parent().parent().data('parent')              //本行父节点

                $(this).click(function () {
                    if (order == 1) {
                        alert("此任务不能降级")
                    }
                    else {
                        for (var i = 0; i < order - 1; i++) {
                            var prevParent = $($(this).parent().parent().prevAll()[i]).data('parent')  //循环向前查找相同父节点的节点
                            var prevDataId = $($(this).parent().parent().prevAll()[i]).data('id')
                            if (prevParent == parent) {
                                $.ajax({
                                    url: "/ih/data/actions/downgrade",
                                    type: "post",
                                    data: {
                                        id: dataId,
                                        prevDataId: prevDataId
                                    },
                                    success: function (result) {
                                        if (result == 1) {
                                            alert("降级成功!");
                                            window.location = "taskDetail.html?id=" + id;
                                        }
                                        else {
                                            alert("降级失败!");
                                        }
                                    }
                                });

                                break;
                            } else if (i == order - 2) {
                                alert("此任务不能降级！")
                            }

                        }    //for循环结束
                    }     //else


                })

            })

            //上移按钮事件
            $('#dataTable button.up').each(function (index, element) {
                var taskId = $(element).parent().parent().data('id')
                var order=parseInt($($(element).parents('tr').children('td')[0]).text())
                var parent = $(element).parent().parent().data('parent')

                $(this).click(function () {
                    if (order == 1) {
                        alert('此为首行任务无法上移!')
                    } else {
                        for (var i = 0; i < order - 1; i++) {
                            var prevParent = $($(this).parent().parent().prevAll()[i]).data('parent')  //循环向前查找相同父节点的节点
                            var prevDataId = $($(this).parent().parent().prevAll()[i]).data('id')
                            if (prevParent == parent) {
                                $.ajax({
                                    url: "/ih/data/actions/move",
                                    type: "post",
                                    data: {
                                        id: taskId,
                                        moveDataId: prevDataId
                                    },
                                    success: function (result) {
                                        if (result == 1) {
                                            alert("上移成功!");
                                            window.location = "taskDetail.html?id=" + id;
                                        }
                                        else {
                                            alert("上移失败!");
                                        }
                                    }
                                });

                                break;
                            } else if (i == order - 2) {
                                alert("此任务无法上移!")
                            }
                        }    //for循环结束
                    } //else
                })

            })
           
            //下移按钮事件
            $('#dataTable button.down').each(function (index, element) {
                var taskId = $(element).parent().parent().data('id')
                var order=parseInt($($(element).parents('tr').children('td')[0]).text())
                var maxorder=that.list.length
                var parent = $(element).parent().parent().data('parent')
                $(this).click(function () {
                    if (order == maxorder) {
                        alert('此任务不能下移！')
                    } else {
                        for (var i = 0; i < (maxorder - order); i++) {
                            var nextParent = $($(this).parent().parent().nextAll()[i]).data('parent')  //循环向前查找相同父节点的节点
                            var nextDataId = $($(this).parent().parent().nextAll()[i]).data('id')
                            if (nextParent == parent) {
                                $.ajax({
                                    url: "/ih/data/actions/move",
                                    type: "post",
                                    data: {
                                        id: taskId,
                                        moveDataId: nextDataId
                                    },
                                    success: function (result) {
                                        if (result == 1) {
                                            alert("下移成功!");
                                            window.location = "taskDetail.html?id=" + id;
                                        }
                                        else {
                                            alert("下移失败!");
                                        }
                                    }
                                });

                                break;
                            } else if (i == (maxorder - order - 1)) {
                                alert("此任务无法下移!")
                            }
                        }    //for循环结束
                    }//else结束
                })

            })


            $('#dataTable button.delete').each(function (index, element) {
                var delDataId = $(element).parent().parent().data('id')
                var delDataName = $($(element).parents('tr').children('td')[1]).text()
                var delDataParent = $(element).parent().parent().data('parent')
                var order=parseInt($($(element).parents('tr').children('td')[0]).text())
                var maxorder=that.list.length
                $(this).click(function () {
                    var status = confirm("确定删除" + delDataName + "吗？")
                    if (!status) {
                        return false
                    }

                    var parentList = new Array()
                    parentList.push(delDataParent)
                    var thisParent = delDataParent
                    for (var i = 0; i < order - 1; i++) {          //向上遍历查找父节点的集合
                        var prevParent = $($(this).parent().parent().prevAll()[i]).data('parent')  //循环向前查找父节点集合
                        var prevDataId = $($(this).parent().parent().prevAll()[i]).data('id')
                        if (delDataParent == null) {
                            break;
                        }

                        if (prevDataId == thisParent && prevParent != null) {
                            parentList.push(prevParent)
                            thisParent = prevParent
                        }

                        if (prevParent == null) {
                            parentList.push(prevParent)
                            break;
                        }

                    }    //for循环结束

                    var children = new Array()
                    for (var i = 0; i < (maxorder - order); i++) {
                        var nextParent = $($(this).parent().parent().nextAll()[i]).data('parent')  //循环向下查找相同父节点的节点
                        var nextDataId = $($(this).parent().parent().nextAll()[i]).data('id')

                        if ($.inArray(nextParent, parentList) != -1) {
                            break;
                        } else {
                            if (nextParent == delDataId) {
                                children.push(nextDataId)
                            }
                        }
                    }
//					console.log(children)	

                    $.ajax({
                        type: "delete",
                        url: "/ih/data/" + delDataId + "?relatedType=universalTask&children[]=" + children,
                        success: function (data) {
                            if (data == true) {
                                alert('删除成功')
                                window.location = "taskDetail.html?id=" + id
                            } else if (data == false) {
                                alert('删除失败')
                            } else {
                                alert('服务器错误')
                            }
                        }
                    });
                })        //点击事件
            })//删除事件结束
        }
    })

    //新增数据
    $('#addDataElement').click(function () {
        $('#addDataElementList').attr("disabled", true)
        $('#addDataElement').attr("disabled", true)
        var i = 1
        if ($('#dataTable').find('td.addList:last').length > 0) {
            i = parseInt($('#dataTable').find('td.addList:last').text()) + parseInt('1')
        }
        dataTable.addRow([ i, '<input id="DataName" class="atext"/>', '<input id="abbr" class="atext"/>', '<input id="code" class="atext"/>', 
			'<select id="fill" style="width:100px" class="form-control atext"><option value="0">选填</option><option value="1">必填</option></select>',
			'<select id="frequency" style="width:100px" class="form-control atext"><option value="0">一次</option><option value="1">多次</option></select>',
			'<select id="input_output" style="width:100px" class="form-control atext"><option value="0">输入</option><option value="1">输出</option><option value="2">输入输出</option></select>',
			'<select id="type" style="width:100px" class="form-control atext"><option value="0">文本</option><option value="1">数值</option><option value="2">物项</option><option value="3">文件</option></select>',
			'<button class="btn btn-primary confirm"><span>确认</span></button>' + '<button class="btn btn-primary cancel"><span>取消</span></button>' ], function() {
            $('#dataTable').find('button.cancel').click(function () {
                window.location = "taskDetail.html?id=" + id
            })

            $('#dataTable').find('button.confirm').click(function () {
                $.ajax({
                    type: "post",
                    // dataType: "json",
                    url: "/ih/data",
                    data: {
                        name: $('#DataName').val(),
                        abbr: $('#abbr').val(),
                        code: $('#code').val(),
                        fill : $('#fill').val(),
						frequency : $('#frequency').val(),
						input_output : $('#input_output').val(),
						type : $('#type').val(),
                        relatedType: "universalTask",
                        id: id
                    },
                    success: function (data) {
                        if (data == "success") {
                            alert("添加成功");
                            window.location = "taskDetail.html?id=" + id
                        } else {
                            alert(data);
                        }
                    }
                })
            })
        });

    })

    //选中
    function check($tr,checked) {
        if($tr.length==0)return;
        var id = $tr.data('id');
        var data = findDataById(dataTable.options.list, id);
        var parentid = $tr.data('parent');
        var checkbox = $tr.find(':checkbox');
        var children = $tr.nextAll('tr[data-parent="'+id+'"]')
        var parent = $tr.prevAll('tr[data-id="'+parentid+'"]')
        if(data.frequency===0){
            check(parent,checked)
        }else if(data.frequency===1){
            if(checked){
                check(parent,checked)
            }else {
                var sameTr = $tr.parent().children().slice(0,-1);
                //统计相同名字选中个数
                var count=0;
                for(var i=0; i<sameTr.length;i++){
                    if(!$(sameTr[i]).find(':checkbox').prop('checked'))continue
                    var thisData = findDataById(dataTable.options.list,$(sameTr[i]).data('id'))
                    if(thisData!=null&&thisData.name==data.name)count++;
                }
                if(count===1){
                    check(parent,checked)
                }
            }
        }
        if(checkbox.prop('checked')===checked)return;
        checkbox.prop('checked',checked);
        children.each(function () {
            check($(this),checked)
        })

    }

    function findDataById(list, id) {
        for(var i=0;i<list.length;++i){
            if(list[i].id===id)return list[i]
        }
        return null;
    }

    $("#addDataElementList").click(function () {
        $('#addDataElementList').attr("disabled", true)
        $('#addDataElement').attr("disabled", true)
        $('#dataTable').find('th:first').after('<th></th>')
        $('#dataTable').find('td.addList').after('<td><input type="checkbox"></td>')
        var i = parseInt($('#dataTable').find('td.addList:last').text()) + parseInt('1')
        dataTable.addRow([i, '<input class="atext" readonly/>', '<input class="atext" readonly/>', '<input class="atext" readonly/>',
                '<input class="atext" readonly/>', '<input class="atext" readonly/>', '<input class="atext" readonly/>',
                '<input class="atext" readonly/>', '<input class="atext" readonly/>',
                '<button class="btn btn-primary confirm">确认</button>' + '<button class="btn btn-primary cancel">取消</button>'], function () {
                $('#dataTable').find('button.cancel').click(function () {
                    window.location = "taskDetail.html?id=" + id
                })  //取消

            dataTable.$element.find('tbody input:checkbox').click(function () {
                var tr = $(this).closest('tr');
                $(this).prop('checked',!$(this).prop('checked'))
                check(tr,!$(this).prop('checked'));
            })


				$('#dataTable').find('button.confirm').click(function(){
					var dataIdList=new Array()	
					$("#dataTable input:checkbox").each(function(index,element){
					    if($(this).is(":checked")){
							dataId=$(this).parent().parent().data('id')
					    	dataIdList.push(dataId)
					    }
					})
					console.log(dataIdList)
					$.ajax({
						type : "post",
//							dataType : "json",
						url : "/ih/data/addDataList",
						data : {
							"dataIdList[]":dataIdList,
							relatedType:"universalTask",
							id:id
						},
						success : function(data) {
							if (data == "success") {
								alert("添加成功");								
                                window.location="taskDetail.html?id="+id
							} else {
								alert(data);
							}
						},
						error:function (data) {
                            alert(data)
                        }
					})					
					})//确认
            }) //添加一行
    })   //批量增加数据元素


})