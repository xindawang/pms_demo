$(function() {
	
	var paramList = window.location.search.substring(1).split('&');
	var taskId
	for(i in paramList){
		var param = paramList[i]
		param = param.split('=')
		if(param[0]=='id')taskId = param[1]
	}
	$.ajax({  
			type : "GET",// 请求方式
			url : "/ih/tasks/"+taskId,// 地址，就是action请求路径
			dataType : "json",// 数据类型text xml json script jsonp
		   success: function(msg){//返回的参数就是 action里面所有的有get和set方法的参数  
			   console.log(msg)
			   $("#name").val(msg.name); 	
			   $("#priority").val(msg.priority);
			   $("#startTime").val(msg.startTime);
			   $("#endTime").val(msg.endTime);
			   $("#statement").val(msg.state);
			   $("#acceptTime").val(msg.acceptTime);
			   $("#finishTime").val(msg.finishTime);
		   }  
	});	
	
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
						'ZERO' : '机密',
						'ONE' : '秘密',
						'TWO' : '内部',
						'THREE' : '公开'	
					},
				},
				{
					title : '值',
					element : "<a class='value'></a>"
				}],
			afterDraw : function() {
				var that=this
				$('#dataTable a.value').each(function(index, element) {
					var dataId = $(element).parent().parent().data('id')
					for (var i=0;i<that.list.length;i++){
						if (that.list[i].id==dataId)
						var fullName = that.list[i].value;
					}				
					if (fullName!=null){
						var full = fullName.split("\\")
						var fileName = full[full.length-1].split("/")						
						$(this).text(fileName[fileName.length-1])
						var href = "/ih/data/actions/download?fullName="+fullName+"&fileName="+fileName
						$(this).attr('href', href)
					}
				})
			}
		})
})