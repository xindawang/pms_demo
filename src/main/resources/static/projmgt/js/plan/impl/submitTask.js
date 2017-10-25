$(function() {
	
	var paramList = window.location.search.substring(1).split('&');
	var taskId
	for(i in paramList){
		var param = paramList[i]
		param = param.split('=')
		if(param[0]=='id')taskId = param[1]
	}
	
	var taskSecurityLevel	//为下文确定等级范围保留
	$.ajax({  
		   type: "GET",//请求方式  
		   url : "/ih/tasks/"+taskId,//地址，就是action请求路径  
		   dataType: "json",//数据类型text xml json  script  jsonp  
		   success: function(msg){//返回的参数就是 action里面所有的有get和set方法的参数  
			   console.log(msg)
			   $("#name").val(msg.name); 
			   $("#startTime").val(msg.startTime); 
			   $("#endTime").val(msg.endTime); 
			   $("#priority").val(msg.priority); 
			   $("#statement").val(msg.state);
			   taskSecurityLevel = msg.securityLevel;
		   }  
	});
	
	//获取密级
	var allSecurityLevel	//获取列表，对数据密级控制
	$.ajax({
		type : "GET",// 请求方式
        url : "/ih/security-level",
        async: false,
        dataType : "json",// 数据类型text xml json script jsonp
		success : function(msg) {// 返回的参数就是 action里面所有的有get和set方法的参数
			allSecurityLevel=msg;
		},
	});
	
	$('#submit').click(function(){
		var submitValidation = true
		$('#dataTable input.dataValue').each(function(index, element) {					
			if($(this).val()==""){
				submitValidation = false
			}
		})
		dataTable.$element.find('tbody>tr').each(function(index, element) {
			var id=$(this).data('id');
			var list = dataTable.options.list
			for(var i=0;i<list.length;++i){
				if(id==list[i].id){
					if(list[i].type==3){
						if($(this).children('td:eq(-1)').text()==""||$(this).children('td:eq(-1)').text()=="--"){
							submitValidation = false
							break;
						}
					}
				}	
			}
		})
		
		if (submitValidation == false){
			alert("请填写全部数据值！");
		}else{
			var list = new Array();
			$('#dataTable input.dataValue').each(function(index, element) {					
				var dataId = that.list[index].id;
				var dataVal = this.value;
				list.push({'dataId':dataId,'dataVal':dataVal})
			})
			$.ajax({
		    	url: '/ih/tasks/'+taskId+'/actions/complete',
		        type:"post",
		        data:{
		        	dataMap:JSON.stringify(list)
		        },
	            success: function (result) {
	                if (result==1) {
	                    alert("提交成功!");
	                    window.location="/iw/org/welcome.html";
	                }
	                else {
	                	alert("提交失败!");
	                }
	            }
			
			});
		}	        
	})
	
		//数据列表
	var that
	var dataTable = $('#dataTable').treeTable(
		{
			url : '/ih/tasks/'+taskId+'/data',
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
					title : '操作',
					element : "<div class='operation'></div>"
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
					file: 'string'
				}
				],
			afterDraw : function() {
				that=this					
				
				$('#dataTable div.operation').each(function(index, element) {
					if(that.list[index].type=="文件"||that.list[index].type==3){
						$(this).append("<button  type='file' class='btn btn-primary fileAdd' >附加</button>" )
						$(this).append("<button  class='btn btn-primary fileRemove' >删除</button>" )
					}
				})
				
				var valueCell
				var securityCell
				var dataId						//获取dataId
				//连接到隐藏文件选择框	
				$('#dataTable button.fileAdd').click(function() {
					valueCell = $(this).parents('tr').children()[10];
					securityCell = $(this).parents('tr').children()[9];
					$(this).attr('data-toggle','modal')						//增加模态框的链接
					$(this).attr('data-target','#securityLevelModal')
					dataId = $(this).parents('tr').data('id');
					if (valueCell.textContent==""||valueCell.textContent=="--"){
						$("#securityLevelSelect").empty();
					   for (var i in allSecurityLevel){
						   var id =allSecurityLevel[i].id;
						   var name =allSecurityLevel[i].name;
						   if (id>=taskSecurityLevel){
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
					          url: "/ih/data/actions/upload?"+"taskId="+taskId+"&dataId="+dataId+"&securityLevel="+securityLevel,
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
				
				
				$('#dataTable button.fileRemove').click(function() {
					var status = confirm("确定删除吗？")
					if (!status) {
						return false
					}
					
					var dataId = $(this).parents('tr').data('id');
					//获取值的内容,其行与按钮相同，列在按钮右侧
					valueCell= $(this).parents('tr').children()[10];
					securityCell= $(this).parents('tr').children()[9];
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
			}
		})
		
			//新增数据
	$('#addDataElement').click(
		function() {
            var i=1
			if($('#dataTable').find('td.addList:last').length>0){
				 i=parseInt($('#dataTable').find('td.addList:last').text())+parseInt('1')		
			}			
			dataTable.addRow([ i, '<input id="DataName"style="width:100px" class="atext"/>', '<input id="abbr" style="width:100px" class="atext"/>', '<input id="code" style="width:100px" class="atext"/>', 
				'<select id="fill" style="width:100px" class="form-control atext"><option value="0">选填</option><option value="1">必填</option></select>',
				'<select id="frequency" style="width:100px" class="form-control atext"><option value="0">一次</option><option value="1">多次</option></select>',
				'<select id="input_output" style="width:100px" class="form-control atext"><option value="0">输入</option><option value="1">输出</option><option value="2">输入输出</option></select>',
				'<select id="type" style="width:100px" class="form-control atext"><option value="0">文本</option><option value="1">数值</option><option value="2">物项</option><option value="3">文件</option></select>',
				'<button class="btn btn-primary confirm"><span>确认</span></button>' + '<button class="btn btn-primary cancel"><span>取消</span></button>' ], function() {
				$('#dataTable').find('button.cancel').click(function() {
                 window.location.reload();
				})

				$('#dataTable').find('button.confirm').click(function() {
					$.ajax({
						type : "post",
//						dataType : "json",
						url : "/ih/data",
						data : {
							name : $('#DataName').val(),
							abbr : $('#abbr').val(),
							code : $('#code').val(),
							fill : $('#fill').val(),
							frequency : $('#frequency').val(),
							input_output : $('#input_output').val(),
							type : $('#type').val(),
							relatedType : "task",
							id : taskId
						},
						success : function(data) {
							if (data == "success") {
								alert("添加成功");								
                                window.location.reload();
							} else {
								alert(data);
							}
						},
					})
				})
			});
			
		})
			
})