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
	

$(document).ready(function(){	
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
	
	/*
	$('.treelist tr').dblclick(function(){
		if($(this).find('span.tree-collapsed').length>0){ //展开当前层次
			$(this).find('span.tree-collapsed').removeClass('tree-collapsed').addClass('tree-expanded');
			$(this).find('span.tree-folder').addClass('tree-folder-open');
			show_sub_lines(this);			
		}else if($(this).find('span.tree-expanded').length>0){ //收缩当前层次
			$(this).find('span.tree-expanded').removeClass('tree-expanded').addClass('tree-collapsed');
			$(this).find('span.tree-folder').removeClass('tree-folder-open');
			hide_sub_lines(this);
		}
		
	});*/
	$('.treelist ').on("dblclick",'tr',function(){
		if($(this).find('span.tree-collapsed').length>0){ //展开当前层次
			$(this).find('span.tree-collapsed').removeClass('tree-collapsed').addClass('tree-expanded');
			$(this).find('span.tree-folder').addClass('tree-folder-open');
			show_sub_lines(this);			
		}else if($(this).find('span.tree-expanded').length>0){ //收缩当前层次
			$(this).find('span.tree-expanded').removeClass('tree-expanded').addClass('tree-collapsed');
			$(this).find('span.tree-folder').removeClass('tree-folder-open');
			hide_sub_lines(this);
		}
		
	});
});