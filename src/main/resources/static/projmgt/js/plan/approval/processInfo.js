$(function() {
	
	//从session的cookie获取用户id
	var custId =$.cookie('custId');	
	//获取计划id
	var paramList = window.location.search.substring(1).split('&');
	var scheduleId
	for(i in paramList){
		var param = paramList[i]
		param = param.split('=')
		if(param[0]=='id')scheduleId = param[1]
	}
	
	//设置事项名称和责任人，而提交时间由列表中最早的提交时间动态获取
	$.ajax({  
		   type: "GET",//请求方式  
		   url: "/ih/schedules/"+scheduleId,//地址，就是action请求路径  
		   dataType: "json",//数据类型text xml json  script  jsonp  
		   success: function(msg){//返回的参数就是 action里面所有的有get和set方法的参数  
			   console.log(msg)
			   $("#itemName").val(msg.name); 
			   $("#personName").val(msg.responsible.name+"/"+msg.responsible.corp.name);
		   }  
		});
	
	var planDataTable = $('#processTable').table(
		{
			url: "/ih/process/schedule/"+scheduleId,
			columns : [
				{
					title : '序号',
					increment : 1,
					width : '50px'
				},
				{
					title : '审批过程',
					element : "<lable>审核</lable>"
				},
				{
					title : '报批时间',
					data : 'submitTime'
				},
				{
					title : '审批意见',
					data:'approvalOpinion',
					bool : {						//通过bool元素转换所传参数，亦可如monitoring->plan中的element元素一样实现
						'TRUE':'同意',
						'FALSE':'拒绝'
					},
				},
				{
					title : '审批人',
					data : 'approverName'
				},
				{
					title : '审批时间',
					data : 'approvalTime'
				},
				{
					title : '审批信息',
					data : 'extras',
					width : '200px'
				}
				],afterDraw : function() {
					var that = this
					//填入提交时间
					var firstTime=new Date(that.list[0].submitTime)
					var index =0;
					for (var i=1;i<that.list.length;i++){
						var nextTime = new Date(that.list[i].submitTime);
						if (nextTime<firstTime){
							firstTime=nextTime;
							index=i
						}
					}
					$("#submitTime").val(that.list[index].submitTime);		 //时间按降序排序，遍历列表，寻找时间最小值，即最早时间
				}
		})
				
})