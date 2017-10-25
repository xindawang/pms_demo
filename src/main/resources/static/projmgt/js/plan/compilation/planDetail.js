$(function() {
	
	var custId =$.cookie('custId');
	
	var paramList = window.location.search.substring(1).split('&');
	var id
	var planStatus
	for(i in paramList){
		var param = paramList[i]
		param = param.split('=')
		if(param[0]=='id')id = param[1]
	}
	
	var token = $.cookie('token');
	$.ajax({
		type : "GET",// 请求方式
		url : "/ils/model/myModelPage/condition;codeLike=;techStatus=/sys;limit=10;offset=0;token="+token,// 地址，就是action请求路径
		async: false,
		dataType : "json",// 数据类型text xml json script jsonp
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			console.log(msg)
            	for (var i in msg.result.myModelPage){
                	var id =msg.result.myModelPage[i].id;
                	var name =msg.result.myModelPage[i].name;
				   $("#type").append("<option value="+id+">"+name+"</option>");	   
			   }
		},
	});
	
	//将所有机构显示在参与机构多选框中,由插件实现
	$.ajax({
		type : "GET",// 请求方式
		url : "/ih/user/allCorps",// 地址，就是action请求路径
		async: false,
		dataType : "json",// 数据类型text xml json script jsonp
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
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
	
	var responsibleId
	var scheduleSecurityLevel
	$.ajax({  
		   type: "GET",//请求方式  
		   url: "/ih/schedules/"+id,//地址，就是action请求路径  
		   async:false,
		   dataType: "json",//数据类型text xml json  script  jsonp  
		   success: function(msg){//返回的参数就是 action里面所有的有get和set方法的参数  
			   console.log(msg)
			   $("#code").val(msg.code); 
			   $("#name").val(msg.name); 
			   $("#startTime").val(msg.startTime); 
			   $("#endTime").val(msg.endTime);
//			   $("#securityLevel").val(msg.securityLevel);
			   scheduleSecurityLevel=msg.securityLevel
			   $("#priority").val(msg.priority);
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
			   $("#organization").val(msg.responsible.corp.name);
			   $("#responsible").val(msg.responsible.name)
			   planStatus=msg.status
			   responsibleId=msg.responsible.id		//记录责任人id,并等待向后台传输
		   }  
		});
	
	
	
	// 根据用户ID填入绑定的责任人和机构，计划只能以本人为责任人
	var responsibleSecurityLevel	//获取责任人密级，控制计划级别
	$.ajax({
		type : "GET",
		url : "/ih/user/userCorp",
		async: false,
		dataType : "json",
		data : {
			id : responsibleId		//向后台传责任人id
		},
		success : function(msg) {
			responsibleSecurityLevel=msg.secretLvl
		},
		error :function(msg) {
			alert(msg);
			window.location = "planOverview.html";
		}
	});
		
    //将计划责任人密级字符串转换为代码
	function convertSecretLvl(secretString){
		if (secretString=="机密"){
			return 52;
		}else if (secretString=="秘密"){
			return 51;
		}else if (secretString=="内部"){
			return 41;
		}else if (secretString=="非密"){
			return 21;
		}else {
			return secretString;
		}
	}
	
	//获取密级
	var allSecurityLevel
	$.ajax({
		type : "GET",// 请求方式
        url : "/ih/security-level",
		async: false,
        dataType : "json",// 数据类型text xml json script jsonp
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			allSecurityLevel=msg
			   for (var i in msg){
				   var id =msg[i].id;
				   var name =msg[i].name;
				   var secutiyCode=msg[i].code;
				   if (convertSecretLvl(responsibleSecurityLevel)>=secutiyCode){
					   $("#securityLevel").append("<option value="+id+">"+name+"</option>");
				   }	   
			   }
			$("#securityLevel").val(scheduleSecurityLevel);
		},
	});
	
	//编辑按钮事件,判断是否可编辑
	$('#edit').click(function() {
		console.log(planStatus)
		if (planStatus!="编制中"){
			alert("此状态不可编辑！");
		}else if(custId!=responsibleId){
			alert("非责任人不可编辑！");
		}else{
			$('#planDetailForm .edit').attr('disabled', false)
			$('#partner').attr('disabled', false).selectpicker('refresh')
			$('#save,#editTask,#addData').attr('style',"background:#ebebeb").attr('disabled', false)
			$('#startTime, #endTime').attr('style',"background:#ffffff")			
		}
	})
	
	//保存并编辑按钮事件，与保存事件类似，只有返回页面不同
	$('#editTask').click(function(){
		//多选下拉框传值方法，以","相连，传入参数是同样以","分割
		var partner="";
		var obj = document.getElementById("partner");
		for(var i=0;i<obj.options.length;i++){
			if(obj.options[i].selected){
				if(partner==""){
					partner=obj.options[i].value;
				}else{
					partner=partner +","+obj.options[i].value;
				}
			}
		}
		
		$.ajax({
	    	url: "/ih/schedules/"+id,
	        type:"post",
            data:$("#planDetailForm").serialize()+'&id='+id+'&partner='+partner+'&responsible='+responsibleId,
            success: function (result) {
            	if (result == "success") {
					alert("保存成功!");
            		window.location="taskOfPlan.html?id="+id;
            	} else {
					alert(result);
				}
            }		
		}); 
	})
	
	//保存按钮事件
	$('#save').click(function(){
		//多选下拉框传值方法，以","相连，传入参数是同样以","分割
		var partner="";
		var obj = document.getElementById("partner");
		for(var i=0;i<obj.options.length;i++){
			if(obj.options[i].selected){
				if(partner==""){
					partner=obj.options[i].value;
				}else{
					partner=partner +","+obj.options[i].value;
				}
			}
		}
		
		$.ajax({
	    	url: "/ih/schedules/"+id,
	        type:"post",
            data:$("#planDetailForm").serialize()+'&id='+id+'&partner='+partner+'&responsible='+responsibleId,
            success: function (result) {
            	if (result == "success") {
					alert("保存成功!");
            		window.location="planOverview.html?id="+id;
            	} else {
					alert(result);
				}
            }		
		}); 
	})
	
	//计划数据列表
	var planDataTable = $('#planDataTable').treeTable(
		{
			url : '/ih/schedules/'+id+'/data',
			type: 'GET',
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
//				{
//					title : '输入/输出',
//					data : 'input_output',
//					number : { //通过number元素转换所传参数
//						'ZERO' : '输入',
//						'ONE' : '输出',
//						'TWO' : '输入输出'
//					},
//				},
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
					title : '值',
					data : 'value',
//					file: 'string'
				},
				{
					title : '数据值操作',
					element : "<div class='operation'></div>"
				},
				{
					title : '操作',
					element : "<button  class='btn btn-primary up'>上移</button>"
						+ "<button  class='btn btn-primary down'>下移</button>"
						+ "<button  class='btn btn-danger delete'>删除</button>"	
				} ],
			afterDraw : function() {
				var that=this
				$('#planDataTable div.operation').each(function(index, element) {
					if(that.list[index].type=="文件"||that.list[index].type==3){
						$(this).append("<button  type='file' class='btn btn-primary fileAdd' >附加</button>" )
						$(this).append("<button  class='btn btn-primary fileRemove' >删除</button>" )
					}else{
						$(this).append("<button  class='btn btn-primary valueUpdate' disabled='disabled'>上传</button>" )
						$(this).append("<button  class='btn btn-primary dataUpdate' >修改</button>" )
					}
				})
				
				$('#planDataTable button.dataUpdate').click(function() {
					//点击修改，新增输入框
					$(this).parent().children()[0].disabled=false;
					valueCell = $(this).parents('tr').children()[8];					
					var input = document.createElement('input');  //创建input节点
					input.setAttribute('class', 'dataValue')
					if (valueCell.textContent!="--"){
						input.setAttribute('value', valueCell.textContent)
					}					
					valueCell.textContent=""
					valueCell.appendChild(input)
					//点击修改，新增下拉框
					securityCell = $(this).parents('tr').children()[7];
					securityCell.textContent=""
					var select = document.createElement('select');
					select.setAttribute('class', 'dataValue')
					select.setAttribute('class', 'form-control')
					select.setAttribute('style', 'width:80px')
					for (var i in allSecurityLevel){
						var id =allSecurityLevel[i].id;
						var name =allSecurityLevel[i].name;
						if (id>=scheduleSecurityLevel){
							select.options.add(new Option(name,id));
						}
					}					
					securityCell.appendChild(select)
				})
				
				var valueCell
				var securityCell
				var dataId						//获取dataId
				//连接到隐藏文件选择框	
				$('#planDataTable button.fileAdd').click(function() {
					valueCell = $(this).parents('tr').children()[8];
					securityCell = $(this).parents('tr').children()[7];
					$(this).attr('data-toggle','modal')						//增加模态框的链接
					$(this).attr('data-target','#securityLevelModal')
					dataId = $(this).parents('tr').data('id');
					if (valueCell.textContent==""||valueCell.textContent=="--"){
						$("#securityLevelSelect").empty();
						   for (var i in allSecurityLevel){
							   var id =allSecurityLevel[i].id;
							   var name =allSecurityLevel[i].name;
							   if (id>=scheduleSecurityLevel){
								   $("#securityLevelSelect").append("<option value="+id+">"+name+"</option>");
							   }						   
						   }		
					}else{
						alert("请先删除已上传的文件！");
						$(this).attr('data-target','')
					}				
				})
				
				$('#securityLevelConfirm').click(function() {
					securityCell.textContent=$('#securityLevelSelect').find("option:selected").text();
					securityLevel = $('#securityLevelSelect').val();				
					$('#file').click();		
				})
				
				
				
				var securityLevel="";	//初始化文件密级
				//ajax文件上传需要使用控件（ajaxSubmit），实现伪ajax
				$('#uploadForm').submit(function(){
					$(this).each(function(index, element) {
						$(this).ajaxSubmit({ 
					          url: "/ih/data/actions/upload?"+"scheduleId="+id+"&dataId="+dataId+"&securityLevel="+securityLevel,
					          type: 'put',  
//					          data: $('#uploadForm').serialize+"taskId="+taskId+"&dataId="+dataId,
					          cache: false,  
					          contentType: false,
					          processData: false,  
					          success: function (returndata) {  
					              alert(returndata);  
					          },  
					          error: function (returndata) {  
					              alert(returndata);  
					          }  
					     }); 
					})
					return false; // 阻止表单自动提交事件
				})
	
				//在表格中“值”的位置显示文件名
				$('#file').change(function() {
					var filePath = $(this).val().split('\\');
					filePath = filePath[filePath.length-1].split('/');
					//调用控件
					$('#uploadForm').submit()
					//获取文件名
					var fileName =filePath[filePath.length-1]
					//根据“附加”按钮，向“值”的单元传入参数
					valueCell.textContent=fileName
					$('#file').val("");
				})
				
				
				$('#planDataTable button.fileRemove').click(function() {
					var status = confirm("确定删除吗？")
					if (!status) {
						return false
					}
					
					var dataId = $(this).parents('tr').data('id');
					//获取值的内容,其行与按钮相同，列在按钮右侧
					valueCell= $(this).parents('tr').children()[8];
					securityCell= $(this).parents('tr').children()[7];
					$.ajax({
						type : "delete",
						url : "/ih/data/"+dataId+"/action/truncate",
						dataType : 'json',
						success : function(data) {
							if (data == true) {
								alert('删除成功')
								valueCell.textContent="--"	//将删除后的值置为空
								securityCell.textContent="--"
							} else if (data == false) {
								alert('删除失败')
							}else{
								alert('服务器错误')
							}
						}
					});
				})
				
				//更新计划数据值按钮
				$('#planDataTable button.valueUpdate').click(function(){
					dataId = $(this).parents('tr').data('id');
					var inputValue =  $(this).parents('tr').children()[8].children[0].value;
					var securityValue =  $(this).parents('tr').children()[7].children[0].value;
					if (inputValue==""){
						alert("数据值为空！");
					}else{
						$.ajax({
							type : "post",
							url : "/ih/data/"+dataId+"/action/updateValue",
							data:{
								inputValue:inputValue,
								securityLevel:securityValue,
							},
							dataType : 'json',
							success : function(data) {
								if (data == true) {
									alert('上传成功')
									window.location.reload();
								} else if (data == false) {
									alert('上传失败')
								}else{
									alert('服务器错误')
								}
							}
						});
					}
				})
				
				//上移按钮事件
				$('#planDataTable button.up').each(function(index ,element){
					var taskId=$(element).parent().parent().data('id')
					var order=parseInt($($(element).parents('tr').children('td')[0]).text())
					var parent=$(element).parent().parent().data('parent')
                    $(this).click(function(){
                    	if(order==1)
                    		{
                    		alert('此为首行任务无法上移!')
                    		}else{
    							for(var i=0;i<order-1;i++){
                              	  var prevParent=$($(this).parent().parent().prevAll()[i]).data('parent')  //循环向前查找相同父节点的节点
                             	  var prevDataId=$($(this).parent().parent().prevAll()[i]).data('id')    
                            	  if(prevParent==parent){
    									$.ajax({
  								    	url: "/ih/data/actions/move",
  								        type:"post",
  								        data:{
  								        	id:taskId,
  								        	moveDataId:prevDataId
  								        },
                                          success: function (result) {
  							                if (result==1) {
  							                    alert("上移成功!");
  							                    window.location="planDetail.html?id="+id;
  							                }
  							                else {
  							                	alert("上移失败!");
  							                }                                       	
                                          }
  									});	
                              		  
                              		  break;
                              	  }else if(i==order-2){
                              		   alert("此任务无法上移!")
                              	  }
    							}    //for循环结束
                         } //else
                    })
					
				})  
				
				
				
				//下移按钮事件
				$('#planDataTable button.down').each(function(index ,element){
					var taskId=$(element).parent().parent().data('id')
					var order=parseInt($($(element).parents('tr').children('td')[0]).text())
					var maxorder=that.list.length
					var parent=$(element).parent().parent().data('parent')
					$(this).click(function(){
						console.log(maxorder-order-1)
						if(order==maxorder){
							alert('此任务不能下移！')
						}else{
						for(var i=0;i<(maxorder-order);i++){
                              var nextParent=$($(this).parent().parent().nextAll()[i]).data('parent')  //循环向前查找相同父节点的节点
                           	  var nextDataId=$($(this).parent().parent().nextAll()[i]).data('id')    
                          	  if(nextParent==parent){
  									$.ajax({
								    	url: "/ih/data/actions/move",
								        type:"post",
								        data:{
								        	id:taskId,
								        	moveDataId:nextDataId
								        },
                                        success: function (result) {
							                if (result==1) {
							                    alert("下移成功!");
							                    window.location="planDetail.html?id="+id;
							                }
							                else {
							                	alert("下移失败!");
							                }                                       	
                                        }
									});	
                            		  
                            		  break;
                            	}else if(i==(maxorder-order-1)){
                            		  alert("此任务无法下移!")
                            	}
  							}    //for循环结束	
						}//else结束
					})
				})

				$('#planDataTable button.delete').each(function(index, element) {
					var dataId = $(element).parent().parent().data('id')
					var dataName = $($(element).parents('tr').children('td')[1]).text()
					$(this).click(function() {
						var status = confirm("确定删除"+dataName+"吗？")
						if (!status) {
							return false
						}
						$.ajax({
							type : "delete",
							url : "/ih/data/"+dataId+"?relatedType=schedule",
							dataType : 'json',
							success : function(data) {
								if (data == true) {
									alert('删除成功')
                                    window.location="planDetail.html?id="+id
								} else if (data == false) {
									alert('删除失败')
								}else{
									alert('服务器错误')
								}
							}
						});
					})
				})
			}
		})
		
		//新增数据
		$('#addData').click(
			function() {
				$('#addDataList').attr("disabled",true)
				$('#addData').attr("disabled",true)				
                var i=1
				if($('#planDataTable').find('td.addList:last').length>0){
					 i=parseInt($('#planDataTable').find('td.addList:last').text())+parseInt('1')		
				}
				planDataTable.addRow([ i, '<input id="DataName" class="atext"/>', '<input id="abbr" class="atext"/>', '<input id="dataCode" class="atext"/>', 
					'<select id="fill" style="width:100px" class="form-control atext"><option value="0">选填</option><option value="1">必填</option></select>',
					'<select id="frequency" style="width:100px" class="form-control atext"><option value="0">一次</option><option value="1">多次</option></select>',
//					'<select id="input_output" style="width:100px" class="form-control atext"><option value="0">输入</option><option value="1">输出</option><option value="2">输入输出</option></select>',
					'<select id="dataType" style="width:100px" class="form-control atext"><option value="0">文本</option><option value="1">数值</option><option value="2">物项</option><option value="3">文件</option></select>',
					'<select id="dataSecurityLevel" style="width:100px" class="form-control atext"><option value="1">机密</option><option value="2">秘密</option><option value="3">内部</option><option value="4" selected="selected">非密</option></select>',					
					'<button class="btn btn-primary confirm"><span>确认</span></button>' + '<button class="btn btn-primary cancel"><span>取消</span></button>' ], function() {
					$('#planDataTable').find('button.cancel').click(function() {
                        window.location="planDetail.html?id="+id
					})

					$('#planDataTable').find('button.confirm').click(function() {
						$.ajax({
							type : "post",
//							dataType : "json",
							url : "/ih/data",
							data : {
								name : $('#DataName').val(),
								abbr : $('#abbr').val(),
								code : $('#dataCode').val(),
								fill : $('#fill').val(),
								frequency : $('#frequency').val(),
//								input_output : $('#input_output').val(),
								securityLevel : $('#dataSecurityLevel').val(),
								type : $('#dataType').val(),
								relatedType : "schedule",
								id : id
							},
							success : function(data) {
								if (data == "success") {
									alert("添加成功");								
                                    window.location="planDetail.html?id="+id
								} else {
									alert(data);
								}
							},
						})
					})
				});
				
			})
			
			
})