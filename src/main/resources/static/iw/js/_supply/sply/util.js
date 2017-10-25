(function(){
	$(document).ready(function(){
		//页面中插入html片段
		$("div.includeHtml").each(function(obj){
			var url = $(this).data("url");
			if(url){
				$(this).load(url);
			}
			
		});
		
		//Modal 中插入html片段
		$.each($("div.modal-body"),function(index,modal){
			var url = $(this).data("url");
			if(url){
				$(this).load(url);
			}
		});
		
		
		//table 点击显示明细行
		$("button.showdetail").on("click",function(){
			var that = $(this);
			var id = $(this).data("id");
			var trs = $("tr.detail");
			$.each(trs,function(index,detail){
				if($(detail).data("id")==id){
					if($(detail).is(":hidden")){
						$(detail).show();
						console.log($(this));
						that.find('span').addClass("glyphicon-minus").removeClass("glyphicon-plus");
					}else{
						$(detail).hide();
						that.find('span').addClass("glyphicon-plus").removeClass("glyphicon-minus");
					}
				}
			});
		});
		
		if($(".st_tree").length > 0){
			$(".st_tree").SimpleTree({
				click:function(a){
					$(".st_tree li").css({"background-color":'#ffffff'});
					$(".st_tree li a").css({'color':'#222'});
					$(a).parent().css({"background-color":"#2884d7",'color':'#ffffff'});
					$(a).css({'color':'#ffffff'});
					/*
					if(!$(a).attr("hasChild"))
						alert($(a).attr("ref"));*/
				}
			});			
		}
		
		
		//nav-tabs
		$("ul.nav-tabs li a").on("click",function(e){
			e.preventDefault();
			$(this).tab('show');
		});
		
		$("div.panel .panel-heading ").on("click","span.icon-collapse-top",function(){
			$(this).removeClass("icon-collapse-top").addClass("icon-collapse");
			$(this).parent().parent().next().hide();
			
		});
		$("div.panel .panel-heading ").on("click","span.icon-collapse",function(){
			$(this).removeClass("icon-collapse").addClass("icon-collapse-top");
			$(this).parent().parent().next().show();
			
		});
		
	});
})();