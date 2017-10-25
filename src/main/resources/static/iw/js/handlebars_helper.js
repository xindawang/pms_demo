//当前js 依赖 jQuery  
//当前js 依赖 underscope.js 
(function($) {
    var compiled = {};
    $.fn.handlebars = function(template, data,append) {
        if (template instanceof jQuery) {
            template = $(template).html();
        }
    compiled[template] = Handlebars.compile(template);
	if(append){
		this.append(compiled[template](data))
	}else{
		this.html(compiled[template](data));		
	}
    
    };
})(jQuery);
//$('#content').handlebars($('#template'), { name: "Alan" });
/*
*  content_id   渲染的目标id
*  template_id  渲染的行模板id
*  tree_data    渲染的json 数据（根节点唯一）
*  obj          当前渲染的行对象
*/

function render_sub_tree(content_id,template_id,tree_data,obj){	
	var objs = _.where(tree_data,{'parent':obj.id});
	//console.log(objs);
	if(objs.length>0){
		//console.log(tree_data);
		//console.log(objs);
		obj.have_sub_node = true;
		$('#'+content_id).handlebars($('#'+template_id), obj,true);
		
		$.each(objs,function(index,item){
			//console.log(item);
			render_sub_tree(content_id,template_id,tree_data,item);
		});
	}else{
		obj.have_sub_node = false;		
		$('#'+content_id).handlebars($('#'+template_id), obj,true);
	}
}


function render_tree(content_id,template_id,json_data) {
	$('#'+content_id).html(''); //清空表格	
	var objs = _.where(json_data,{'depth':'1'})	;
	$.each(objs,function(index,obj){
		obj.is_root = true;
		render_sub_tree(content_id,template_id,json_data,obj);
	});
}

Handlebars.registerHelper('compare',function(left,operator,right,options){
	if(arguments.length<3){
		throw new Error('Handlerbars Helper compare needs 2 paremeters');
	}
	var operators = {
		'==':     function(l,r) {return l==r;},
		'===':    function(l,r) {return l===r;},
		'!=':     function(l,r) { return l != r; },
		'!==':    function(l,r) { return l !== r; },
		'<':      function(l,r) { return l < r; },
		'>':      function(l,r) { return l>r; },
		'<=':     function(l,r) { return l <= r; },
		'>=':     function(l,r) { return l >= r; },
		'typeof': function(l,r) { return typeof l == r; }
	};
	if(!operators[operator]){
		throw new Error("Handlerbars Helper compare doesn't know the operator");
	}
	var result = operators[operator](left,right);
	if(result){
		return options.fn(this);
	}else{
		return options.inverse(this);
	}
});

Handlebars.registerHelper('indent',function(depth,options){
	var render_depth = depth;
	var str = '';
	for(var i=1;i<render_depth;i++){
		str += '<span class="tree-indent"></span>';
	}
	return str;
	
});