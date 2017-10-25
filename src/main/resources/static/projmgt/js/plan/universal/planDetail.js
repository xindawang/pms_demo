$(function(){
	
	//id 为计划模板的id
	var custId =$.cookie('custId');
	var paramList = window.location.search.substring(1);
	var id
	param = paramList.split('=')
	if (param[0] == 'id')
		id = param[1]		

 //计划名称，说明显示
		$.ajax({  
		   type: "GET",
		   url: "/ih/universal-schedules/"+id,
		   dataType: "json",
		   success: function(msg){//返回的参数就是 action里面所有的有get和set方法的参数  
			   $("#name").val(msg.name);		  		   
			   $("#state").val(msg.state);
		   }  
		});
	
	$('#editPlan').click(function(){
		$('.edit').attr("disabled",false);
	})
	var planDataTable = $('#planDataTable').treeTable(
			{
				url : '/ih/universal-schedules/'+id+'/data',
				type:"get",
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
					//需求中计划模板数据无此格
//					{
//						title : '输入/输出',
//						data : 'input_output',
//						number : { //通过number元素转换所传参数
//							'ZERO' : '输入',
//							'ONE' : '输出',
//							'TWO' : '输入输出'
//						},
//					},
					
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
						title : '操作',
						element : "<button  class='btn btn-primary up'>上移</button>"
							+ "<button  class='btn btn-primary down'>下移</button>"
							+ "<button  class='btn btn-danger delete'>删除</button>"	
					} ],
				afterDraw : function() {
					var that=this
					
					//上移按钮事件
					$('#planDataTable button.up').each(function(index ,element){
						var taskId=$(element).parent().parent().data('id')
						var order=$(element).parents('tr').children('td')[0].textContent
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
						var order=$(element).parents('tr').children('td')[0].textContent
						var maxorder=that.list.length;
						var parent=$(element).parent().parent().data('parent')
						$(this).click(function(){

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
                   //删除数据					
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
								url : "/ih/data/"+dataId+"?relatedType=universalSchedule",
								dataType : 'json',
								success : function(data) {
									if (data == true) {
										alert('删除成功')
					                    window.location="planDetail.html?id="+id;
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
					$('#addData').attr("disabled",true)
					$('#addDataList').attr("disabled",true)					
					var i=1
					if($('#planDataTable').find('td.addList:last').length>0){
						 i=parseInt($('#planDataTable').find('td.addList:last').text())+parseInt('1')								
					}			
					planDataTable.addRow([ i, '<input id="DataName" class="atext"/>', '<input id="abbr" class="atext"/>', '<input id="code" class="atext"/>', 
						'<select id="fill" style="width:100px" class="form-control atext"><option value="0">选填</option><option value="1">必填</option></select>',
						'<select id="frequency" style="width:100px" class="form-control atext"><option value="0">一次</option><option value="1">多次</option></select>',
						//需求中计划模板数据无此格
//						'<select id="input_output" style="width:100px" class="form-control atext"><option value="0">输入</option><option value="1">输出</option><option value="2">输入输出</option></select>',
						'<select id="type" style="width:100px" class="form-control atext"><option value="0">文本</option><option value="1">数值</option><option value="2">物项</option><option value="3">文件</option></select>',
						'<select id="securityLevel" style="width:100px" class="form-control atext"><option value="1">机密</option><option value="2">秘密</option><option value="3">内部</option><option value="4" selected="selected">非密</option></select>',											
						'<button class="btn btn-primary confirm"><span>确认</span></button>' + '<button class="btn btn-primary cancel"><span>取消</span></button>' ], function() {
						$('#planDataTable').find('button.cancel').click(function() {
		                    window.location="planDetail.html?id="+id;
						})

						$('#planDataTable').find('button.confirm').click(function() {
							$.ajax({
								type : "post",
//								dataType : "json",
								url : "/ih/data",
								data : {
									name : $('#DataName').val(),
									abbr : $('#abbr').val(),
									code : $('#code').val(),
									fill : $('#fill').val(),
									frequency : $('#frequency').val(),
									type : $('#type').val(),
									securityLevel : $('#securityLevel').val(),
									relatedType : "universalSchedule",
									id : id
								},
								success : function(data) {
									if (data == "success") {
										alert("添加成功");								
		                                window.location="planDetail.html?id="+id
									} else {
										alert(data);
									}
								}
							})
						})
					});
					
				})


  //为计划模板添加任务
	$('#addTasks').click(function(){
		window.location ='taskOfPlan.html?id=' + id	
		
	})
				
  //计划模板的任务列表的初始化
		    var tasksTable = $('#tasksTable').treeTable(
			{
				url:'/ih/universal-schedules/'+id+'/tasks',
				type:"get",
				columns : [
					{
						title : '序号',
						increment : 1,
						width : '50px'
					},
					{
						title : '任务名称',
						data : 'name',
						tree:true
					},
					{
						title : '工期',
						data : 'duration'
					},
					{
						title : '操作',
						element : "<button  class='btn btn-primary upgrade' >升级</button>" + "<button  class='btn btn-primary downgrade' >降级</button>"
							+ "<button  class='btn btn-primary up'>上移</button>" + "<button  class='btn btn-primary down'>下移</button>"
							+ "<button  class='btn btn-danger delete'>删除</button>"
					} 
					],
					afterDraw : function() {
						var that = this
						
						//升级任务
						$('#tasksTable button.upgrade').each(function(index,element){
							var taskId=$(element).parent().parent().data('id')
							var parent=$(element).parent().parent().data('parent')
                            $(this).click(function(){
                            	if(parent!=null){
									$.ajax({
								    	url: "/ih/universal-schedules/"+taskId+"/actions/upgrade",
								        type:"post",
                                        success: function (result) {
							                if (result==1) {
							                    alert("升级成功!");
							                    window.location="planDetail.html?id="+id;
							                }
							                else {
							                	alert("升级失败!");
							                }                                       	
                                        }
									});								        
                            		
                            	}else{
                            		alert('此任务为一级任务，不能升级!')
                            	}

                            })
							
						})
						
						//降级任务
						$('#tasksTable button.downgrade').each(function(index, element){
							var taskId=$(element).parent().parent().data('id')
                            var order=parseInt($($(element).parents('tr').children('td')[0]).text())        //取出本行行号   
                            var parent=$(element).parent().parent().data('parent')              //本行父节点
                           	                             
                               $(this).click(function(){   
                            	 if(order==1)
                            		 {alert("此任务不能降级")}
                            	 else{
                                  for(var i=0;i<order-1;i++){ 
                                	  var prevParent=$($(this).parent().parent().prevAll()[i]).data('parent')  //循环向前查找相同父节点的节点
                                 	  var prevTaskId=$($(this).parent().parent().prevAll()[i]).data('id')                                   	  
                                	  if(prevParent==parent){
      									$.ajax({
    								    	url: "/ih/universal-schedules/"+taskId+"/actions/downgrade",
    								        type:"post",
    								        data:{
    								        	prevTaskId:prevTaskId
    								        },
                                            success: function (result) {
    							                if (result==1) {
    							                    alert("降级成功!");
    							                    window.location="planDetail.html?id="+id;
    							                }
    							                else {
    							                	alert("降级失败!");
    							                }                                       	
                                            }
    									});	
                                		  
                                		  break;
                                	}else if(i==order-2){
                                		alert("此任务不能降级！")
                                	}
	  
                                 }    //for循环结束
                            	}     //else
                                  
                               })
						})

						//上移任务
						$('#tasksTable button.up').each(function(index ,element){
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
		                             	  var prevTaskId=$($(this).parent().parent().prevAll()[i]).data('id')    
		                            	  if(prevParent==parent){
		    									$.ajax({
		  								    	url: "/ih/universal-schedules/"+taskId+"/actions/move",
		  								        type:"post",
		  								        data:{
		  								        	 moveTaskId:prevTaskId
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
						
						//下移任务
						$('#tasksTable button.down').each(function(index ,element){
							var taskId=$(element).parent().parent().data('id')
							var order=parseInt($($(element).parents('tr').children('td')[0]).text())
							var maxorder=that.list.length
							var parent=$(element).parent().parent().data('parent')
							$(this).click(function(){
								if(order==maxorder){
									alert('此任务不能下移！')
								}else{
								for(var i=0;i<(maxorder-order);i++){
		                              var nextParent=$($(this).parent().parent().nextAll()[i]).data('parent')  //循环向前查找相同父节点的节点
		                           	  var nextTaskId=$($(this).parent().parent().nextAll()[i]).data('id')    
		                          	  if(nextParent==parent){
		  									$.ajax({
		  								    	url: "/ih/universal-schedules/"+taskId+"/actions/move",
										        type:"post",
										        data:{
										        	moveTaskId:nextTaskId
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
							
						
						$('#tasksTable button.delete').each(function(index, element){
							var delTaskId = $(element).parent().parent().data('id')
							var delTaskName = $($(element).parents('tr').children('td')[1]).text()
							var delTaskParent = $(element).parent().parent().data('parent')
							var order=parseInt($($(element).parents('tr').children('td')[0]).text())
						    var maxorder=that.list.length	
							$(this).click(function() {
								var status = confirm("确定删除"+delTaskName+"吗？")
								if (!status) {
									return false
								}
																
								var parentList=new Array()      
		                     	parentList.push(delTaskParent)
								var thisParent=delTaskParent
								for(var i=0;i<order-1;i++){          //向上遍历查找父节点的集合
			                          var prevParent=$($(this).parent().parent().prevAll()[i]).data('parent')  //循环向前查找父节点集合
			                       	  var prevTaskId=$($(this).parent().parent().prevAll()[i]).data('id') 
			                       	  if(delTaskParent==null){
			                       		  break;
			                       	  }

			                      	  if(prevTaskId==thisParent&&prevParent!=null){
										parentList.push(prevParent)
										thisParent=prevParent                         								
			                          }
			                          
			                       	  if(prevParent==null){
			                       		  parentList.push(prevParent)
			                       		  break;
			                       	  }                          
			                        	
							     }    //for循环结束			
								
								var children=new Array()
								for(var i=0;i<(maxorder-order);i++){
		                            var nextParent=$($(this).parent().parent().nextAll()[i]).data('parent')  //循环向下查找相同父节点的节点
		                         	var nextTaskId=$($(this).parent().parent().nextAll()[i]).data('id') 

			                       	  if($.inArray(nextParent,parentList)!=-1){       
			                      		    break ;
			                      	  } else{
		                                       if(nextParent==delTaskId){
		                                    	   children.push(nextTaskId)
		                                       }
			                      	  }                         	 
		                            }								

								$.ajax({
									type : "delete",
									url : "/ih/universal-schedules/task?id="+delTaskId+"&children[]="+children,
									dataType : 'json',
//									data : {
//										'id' : delTaskId,
//										'children[]':children
//									},
									success : function(data) {
										if (data == 1) {
											alert('删除成功!')
						                    window.location="planDetail.html?id="+id;                                     
										} else if (data == 0) {
											alert('删除失败!')
										}else{
											alert('服务器错误!')
										}
									}
								});
							})
						})
							
					
					}							

	
			})
	
})