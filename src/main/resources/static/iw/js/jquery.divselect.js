$.fn.divselect = function(options) {
	var $this = $(this);
	var inputselect = $(this).find('input[type="hidden"]');	
	var val= inputselect.val();
	if(options=="val"){
		return val;
	}
	var cite = $(this).find("cite");
	
	if(val!=""){
		var option = $(this).find('a[data-val="'+val+'"]');
		var txt = option.text();
		cite.html(txt);
	}
	$(this).find("cite").click(function(){
		var ul = $(this).parent().find("ul");
		console.log(ul.css("display"));
		if(ul.css("display")=="none"){
			ul.show();			
			//ul.slideDown("fast");
		}else{
			ul.hide();
			//ul.slideUp("fast");
		}
		return false;
	});
	$(this).find("ul li a").click(function(){
		var txt = $(this).text();
		$(this).parent().parent().parent().find("cite").html(txt);
		var value = $(this).attr("data-val");
		inputselect.val(value);
		$(this).find("ul").hide();		
	});
	$(document).click(function(){
		$this.find("ul").hide();
	});
};