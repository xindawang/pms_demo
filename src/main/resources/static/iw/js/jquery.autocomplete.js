$.fn.autocomplete = function(options) {
	var $this = $(this);
	$this.find("input.complete").unbind('click');
	$this.find("input.complete").unbind('keypress');	
	var defaults = {
		initList:function(){}, //初始化下拉列表
		refreshList:function(){} //改变文本框中的值时会回调此函数
	};
	var opts = $.extend(defaults,options);
	opts.initList();
	var inputselect = $(this).find('input[type="hidden"]');	
	var val= inputselect.val();
	if(options=="val"){
		return val;
	}
	var complete = $(this).find("input.complete");
	if(val!=""){
		var option = $(this).find('a[data-val="'+val+'"]');
		var txt = option.text();
		complete.val(txt);
	}
	$this.find("input.complete").click(function(){
		var ul = $this.find("ul");
		if(ul.css("display")=="none"){
			ul.show();
		}else{
			ul.hide();
		}
		return false;
	});
	$this.find("input.complete").on('keypress',opts.refreshList);
	$this.find("ul li a").click(function(){
		var txt = $(this).text();
		$this.find('input.complete').val(txt);
		var value = $(this).attr("data-val");
		inputselect.val(value);
		$this.find("ul").hide();		
	});
	$(document).click(function(){
		$this.find("ul").hide();
	});
	$this.find("ul").hide();
};