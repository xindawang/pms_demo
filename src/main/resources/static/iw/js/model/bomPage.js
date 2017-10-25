var htmlTemp = $("tr[name='children0Template']").clone();

function htmlChildTemp(jsonData) {
	htmlTemp.attr("name", "children" + numTemp + "Template");
	htmlTemp.attr("data-parent", jsonData.result.children[0].parentId);
	htmlTemp.attr("data-hasreq", 0);
	htmlTemp.attr("class", "");
	htmlTemp.find("div[class='tree-node tree-root-one tree node-last']").prepend(treeIndent);	
	htmlTemp.find("span[class='tree-hit tree-expanded']").attr("class", "tree-hit tree-collapsed");	
	htmlTemp.find("span[class='tree-icon tree-folder tree-folder-open']").attr("class", "tree-icon tree-folder");	
}

var treeIndent = "<span class='tree-indent'></span>";
//目前的层级
var numTemp = 0;
var curClick;
var curId = param("id");
//下级配置渲染
configChildren();
function configChildren() {
	$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/configChildren/{parentId}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/model/configChildren/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/model/configChildren/{parentId}/{sys}",		        
		data:{
			"parentId": curId,					
			"sys": {"token": $.cookie("token")}					
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if(!right(jsonData)) return;
			console.log(jsonData);
			var allChildren = [];
			allChildren = jsonData.result.children; 
			if(numTemp == 0) {
				if(allChildren.length == 0 ) return;
				//有数据就把lvl=0的数据渲染上去
				if(allChildren.length > 0 ) {
					var children0 = [];
					for(var i = 0; lvl0Bom = jsonData.result.children[i]; i++) {
						if(lvl0Bom.lvl == 0) {
							children0[0] = lvl0Bom;
							children0 = allChildren.splice(i,1);
							jsonData.result.children0 = children0; 
							toView(jsonData);
						}
					}
				}
				if(allChildren.length == 0 ) {
					//把第一行的样式变换下
					//hasreq = 0
					$($("tr[name='children0Template']")[1]).find("span[class='tree-hit tree-expanded']").attr("class", "tree-hit tree-collapsed");	
					$($("tr[name='children0Template']")[1]).find("span[class='tree-icon tree-folder tree-folder-open']").attr("class", "tree-icon tree-folder");	
				}
				//不止一条时把剩余的一级子节点渲染上去
				if(allChildren.length > 0 ) {
					numTemp = 1;
					//公用模板方法
					htmlChildTemp(jsonData);
					console.log($("tr[name='children0Template']")[1]);
					$($("tr[name='children0Template']")[1]).after(htmlTemp);
					var curNumTemp = "children" + numTemp;
					var dataTemp = {};
					dataTemp.result = {};
					dataTemp.status = "succ";
					dataTemp.result[curNumTemp] = allChildren;
					toView(dataTemp);
					$($("tr[name='children1Template']")[0]).remove();
				}
			}else if(numTemp > 0) {
				if(allChildren.length > 0) {
					htmlChildTemp(jsonData);
					//网页面粘贴模板
					curClick.after(htmlTemp)
					
					var dataTemp = {};
					dataTemp.result = {};
					dataTemp.status = "succ";
					
					var curNumTemp = "children" + numTemp;
					dataTemp.result[curNumTemp] = allChildren;
					toView(dataTemp);
					$($("tr[name='children" + numTemp  + "Template']")[0]).remove();
					curClick.after($(".treelist").find("tbody tr").slice($(".treelist").find("tbody tr").length - allChildren.length))
					console.log(dataTemp);
				}
			}
		}
	});
}	

//展开整个树
function tree_expanded_all(objId){
	objId += ' tbody ';
	$(objId).find('span.tree-collapsed').removeClass('tree-collapsed').addClass('tree-expanded');
	$(objId).find('span.tree-folder').addClass('tree-folder-open');
	$(objId).find('tr').show();		
}

//收缩整个树,root 节点不隐藏
function tree_collapsed_all(objId,root_data_id){
	objId += ' tbody ';
	$(objId).find('span.tree-expanded').removeClass('tree-expanded').addClass('tree-collapsed');
	$(objId).find('span.tree-folder').removeClass('tree-folder-open');
	$(objId).find('tr').hide();
	$(objId).find('tr[data-id='+root_data_id+']').show();
	
	
}
	
//当前点击行加上点击样式
$('.treelist tr').click(function(){
	$('.treelist tr.tree-node-selected').removeClass('tree-node-selected');
	$(this).addClass('tree-node-selected');		
});

//递归调用隐藏子节点
function hide_sub_lines(current){
	var val = $(current).data('id');		
	var subs = $(current).parent().find('tr[data-parent="'+val+'"]');		
	if(subs.length>0){
		subs.hide();
		$.each(subs,function(index,item){
			hide_sub_lines(item);
		});
	}
	return;
}

//递归调用显示子节点
function show_sub_lines(current){
	var val = $(current).data('id');
	if($(current).find('span.tree-collapsed').length>0){
		return;
	}
	var subs = $(current).parent().find('tr[data-parent="'+val+'"]');		
	if(subs.length>0){
		subs.show();
		$.each(subs,function(index,item){
			show_sub_lines(item);
		});
	}
	return;		
}

//双击当前行的操作
$('.treelist ').on("dblclick",'tr',function(){
	if($(this).find('span.tree-collapsed').length>0){ //展开当前层次
		$(this).find('span.tree-collapsed').removeClass('tree-collapsed').addClass('tree-expanded');
		$(this).find('span.tree-folder').addClass('tree-folder-open');
		show_sub_lines(this);
		
		var datahasreq = $(this).attr("data-hasreq");
		if(datahasreq == 0) {
			numTemp += 1;
			$(this).attr("data-hasreq", 1)
			curId = $(this).find("span[name='id']").text();
			curClick = $(this);
			configChildren();
		}else 
			return;
		
	}else if($(this).find('span.tree-expanded').length>0){ //收缩当前层次
		$(this).find('span.tree-expanded').removeClass('tree-expanded').addClass('tree-collapsed');
		$(this).find('span.tree-folder').removeClass('tree-folder-open');
		hide_sub_lines(this);
	}
	
});

function dataIdValueTo(el, val) {
	$(el).parent().parent().attr("data-id", val);
	valueToWithNoFunc(el, val)
}

function leafedValueTo(el, val) {
	if(val == 1) {
		$(el).parent().find("span[class='tree-icon tree-folder']").attr("class", "tree-icon tree-file");
		$(el).parent().find("span[class='tree-hit tree-collapsed']").remove();
		$(el).parent().prepend(treeIndent);
	}
}

function nodeQueryPage() {
	location.href='nodeQueryPage.html?id=' + param("id");
}

$("#configName").val(param("configName"));
$("#modelName").val(param("modelName"));
