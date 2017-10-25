//点击切换显示页面
$("#myproj li").click(function() {
	
	var hrefVal = $($(this).find("a")).attr("href");
	
	if(hrefVal == "#process") {
		//问题列表分页控件
		paginate();
	}else if(hrefVal == "#flow") {
		typ = "技术资料";

		offset = $$("flowOffset").value;
		limit = $$("flowLimit").value;
		total = $$("flowTotal").value;
		bmpPage_nav = $$("flowPage-nav");
		bmpPaginate();	
		
	}else if(hrefVal == "#node") {
		typ = "项目文件资料";
		
		offset = $$("nodeOffset").value;
		limit = $$("nodeLimit").value;
		total = $$("nodeTotal").value;
		bmpPage_nav = $$("nodePage-nav");
		bmpPaginate();
		
	}else{
		
	}
})

//分页
function paginate(el) {
	if ($$("page-nav")) {
		$("#page-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("offset").value = $$("limit").value * (pageIndex - 1);

				_commit();
			}
		});
	}
}

function bmpPaginate() {
	if (bmpPage_nav) {
		$(bmpPage_nav).pagination({
			items: total,
			itemsOnPage: limit,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				offset = limit* (pageIndex - 1);
			}
		});
	}
}

var id;
var processId;
var nodeId;
//流程定义表
//列表请求
_myProcessCommit();
function _myProcessCommit() {
	var processNameLike = $$("processNameLike").value;
	if(processNameLike == undefined || processNameLike == null){
		processNameLike = "";
	}
	$.ajax({ 
		  type: "post", 
		    // @RequestMapping(value = "/myProcess/{condition}/{sys}", produces = "text/plain")
			// http://localhost:81/ils/admin/myProcess/condition;nameLike=流程名称/sys;offset=0;limit=10;sid=2FirU7AKR6VrA-AlT8gkxg
		   url : apphost() + "/ils/admin/myProcess/{condition}/{sys}",
		   data:{
			"condition": { 
					"nameLike": processNameLike
			},
			"sys": {
				"offset": $$("offset").value,
				"limit": $$("limit").value, 
				"sid": $.cookie("sid")}
		    },
		    dataType : "json",
		    async: false,
		    martrix:true,
		    success: function (jsonData) {
		    	if (!right(jsonData)) return;
		    	console.log(jsonData);
		    	for(var i=0; processPage = jsonData.result.processPage[i]; i++){
		    		$("#nodeProcessName").append("<option value=" + processPage.id + ">" + processPage.name + "</option>");
		    		$("#flowProcessName").append("<option value=" + processPage.id + ">" + processPage.name + "</option>");
		    	}
		    	toView(jsonData,true);
		   }
	});
}

//创建修改
function makeProcess() {
	if(id == undefined || id == null){
		id = "";
	}
	$.ajax({
	    type : "post",
	    // @RequestMapping(value = "/makeProcess/{map}/{sys}", produces = "text/plain")
        // http://localhost:81/ils/admin/custPageByRole/map;id=;name=;bizTab=;statusColName=;instanceIdColName=;currTaskIdsColName=/sys;sid=2FirU7AKR6VrA-AlT8gkxg
		url: apphost() + "/ils/admin/makeProcess/{map}/{sys}",		        
			data:{
				"map": {
					"id": id,
					"name": $("#proProcessName").val(),				
					"bizTab": $("#proBizTab").val(),
					"statusColName": $("#proStatusColName").val(),
					"instanceIdColName":  $("#proInstanceIdColName").val(),				
					"currTaskIdsColName": $("#proCurrTaskIdsColName").val()
				},
				"sys": {
					"sid": $.cookie("sid")
				}
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   console.log(jsonData);
			   var myProcessArr = jsonData.result.processPage;
			   if(id == ""){
				   tip("创建成功");
			   }else{
				   tip("修改成功");
			   }
			   localSecond();
			   toView(jsonData, true);
		}
	});
}

//流程节点表
_myNodeCommit();
function _myNodeCommit() {
	var nodeNameLike = $$("nodeNameLike").value;
	if(nodeNameLike == undefined || nodeNameLike == null){
		nodeNameLike = "";
	}
	$.ajax({ 
		  type: "post", 
		   // @RequestMapping(value = "/myNode/{condition}/{sys}", produces = "text/plain")
		   // http://localhost:81/ils/admin/myNode/condition;nameLike=流程名称/sys;offset=0;limit=10;sid=2FirU7AKR6VrA-AlT8gkxg
		   url : apphost() + "/ils/admin/myNode/{condition}/{sys}",
		   data:{
			"condition": { 
					"nameLike": $$("nodeNameLike").value
			},
			"sys": {
				"offset": $$("offset").value,
				"limit": $$("limit").value, 
				"sid": $.cookie("sid")}
		    },
		    dataType : "json",
		    async: false,
		    martrix:true,
		    success: function (jsonData) {
		    	if (!right(jsonData)) return;
		    	console.log(jsonData);
		    	for(var i=0; nodePage = jsonData.result.nodePage[i]; i++){
		    		$("#nodeName").append("<option value=" + nodePage.id + ">" + nodePage.name + "</option>");
		    	}
		    	toView(jsonData,true);
		   }
	});
}

function makeNode() {
	if(id == undefined || id == null){
		id = "";
	}
	$.ajax({
	    type : "post",
	    // @RequestMapping(value = "/makeNode/{map}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/admin/makeNode/map;id=;processId=;name=;firsted=;lasted=;multiInstanced=;typ=/sys;sid=2FirU7AKR6VrA-AlT8gkxg
		url: apphost() + "/ils/admin/makeProcess/{map}/{sys}",		        
			data:{
				"map": {
					"id": id,
					//"processId":processId,
					"processId":$("#nodeProcessName").val(),
					"name": $("#nodeName").val(),				
					"firsted": $("input[name='first']:checked").val(),
					"lasted": $("input[name='last']:checked").val(),
					"multiInstanced":  $("input[name='more']:checked").val(),				
					"typ": $("#nodeTyp").val()
				},
				"sys": {
					"sid": $.cookie("sid")
				}
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   console.log(jsonData);	
			   var nodeArr = jsonData.result.processPage;
			   if(id == ""){
				   tip("创建成功");
			   }else{
				   tip("修改成功");
			   }
			   localSecond();
			   toView(jsonData, true);
		}
	});
}

//节点流转表
_myFlowCommit();
function _myFlowCommit() {
	var flowNameLike = $$("flowNameLike").value;
	if(flowNameLike == undefined || flowNameLike == null){
		flowNameLike = "";
	}
	$.ajax({ 
		  type: "post", 
		   // @RequestMapping(value = "/myFlow/{condition}/{sys}", produces = "text/plain")
		   // http://localhost:81/ils/admin/myFlow/condition;nameLike=流程名称/sys;offset=0;limit=10;sid=2FirU7AKR6VrA-AlT8gkxg
		   url : apphost() + "/ils/admin/myFlow/{condition}/{sys}",
		   data:{
			"condition": { 
					"nameLike": $$("flowNameLike").value
			},
			"sys": {
				"offset": $$("offset").value,
				"limit": $$("limit").value, 
				"sid": $.cookie("sid")}
		    },
		    dataType : "json",
		    async: false,
		    martrix:true,
		    success: function (jsonData) {
		    	if (!right(jsonData)) return;
		    	console.log(jsonData);
		    	toView(jsonData,true);
		   }
	});
}

function makeFlow() {
	if(id == undefined || id == null){
		id = "";
	}
	$.ajax({
	    type : "post",
	    // @RequestMapping(value = "/makeFlow/{map}/{sys}", produces = "text/plain")
	    // http://localhost:81/ils/admin/makeFlow/map;id=;processId=;nodeId=;nodeName=;parentNodeId=;action=;beforeScript=;afterScript=;ruleScript=/sys;sid=2FirU7AKR6VrA-AlT8gkxg
		url: apphost() + "/ils/admin/makeFlow/{map}/{sys}",		        
			data:{
				"map": {
					"id": id,
					//"processId": processId,
					"processId":$("#nodeProcessName").val(),
					//"nodeId": nodeId,	
					"nodeId": $("#nodeName").val(),
					"nodeName": $("#nodeName : selected").text(),
					"parentNodeId": $("#parentNodeId").val(),
					"action":  $("#action").val(),				
					"beforeScript": $("#beforeScript").val(),
					"afterScript":  $("#afterScript").val(),				
					"ruleScript": $("#ruleScript").val()
				},
				"sys": {
					"sid": $.cookie("sid")
				}
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   console.log(jsonData);	
			   var flowArr = jsonData.result.processPage;
			   if(id == ""){
				   tip("创建成功");
			   }else{
				   tip("修改成功");
			   }
			   localSecond();
			   toView(jsonData, true);
		}
	});
}

//点击某一行在页面下方显示详情
function chooseCurrentTr(el){
	var chooseName = $(el).parent().parent().parent().parent().attr("id");
	if(chooseName == "myProcess"){
		choCurTr(el, myProcessArr);
	}
	if(chooseName == "nodeArr"){
		choCurTr(el, nodeArr);
	}
	if(chooseName == "flow"){
		choCurTr(el, flowArr);
	}
}

//点击取消清空填写内容
function clearResizable(){
	var chooseName = $(el).parent().parent().parent().parent().attr("id");
	if(chooseName == "myProcess"){
		readyToMake(myProcessArr);
	}
	if(chooseName == "nodeArr"){
		readyToMake(nodeArr);
	}
	if(chooseName == "flow"){
		readyToMake(flowArr);
	}
}