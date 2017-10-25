bootPATH = '/iw/css/bootstrap/js/';
document.write('<!--[if lte IE 9]>');
document.write('<script src="' + bootPATH + 'html5shiv.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'respond.min.js" type="text/javascript" ></script>');
document.write('<script src="' + '/iw/js/placeholder.js" type="text/javascript" ></script>');
document.write('<script src="' + '/iw/js/PIE.js" type="text/javascript" ></script>');
document.write('<script src="' + bootPATH + 'jquery.pseudo.js" type="text/javascript" ></script>');
document.write('<![endif]-->');

document.write('<!--[if lte IE 6]>');	
document.write('<script src="' + '/iw/js/bootstrap-ie.js" type="text/javascript" ></script>');
document.write('<![endif]-->');

$(function() {
	if(navigator.userAgent.indexOf("MSIE")>0){
		if(navigator.userAgent.indexOf("MSIE 6.0")>0 || navigator.userAgent.indexOf("MSIE 8.0")){
			$(".btn").each(function(){
				PIE.attach(this);
			});
			$(".panel").each(function(){
				PIE.attach(this);
			});
			$("input").each(function(){
				PIE.attach(this);
			});
			$("a").on("focus",function(){
				this.blur();
			});
		}
	}
	$('#top').load('/iw/admin/top.html');
	
	$('#left').load('/iw/admin/left.html',function() {
		
		$("#menu > li.level1 > a").click(function() {
			
			$(this).addClass('current').next().show() // 下一个同级元素显示
			.parent().siblings().children("a").removeClass("current") // 父元素的兄弟元素的子元素<a>移除"current"
			.next().hide(); // 它的下一个同级元素隐藏
			return false;
		});
		
		$("ul.level2 a").click(function() {
			
			$("ul.level2  a").removeClass("current");
			$(this).addClass('current');
			$.cookie('pathName', this.href.replace("http://" + location.host, ""), {'path': '/'});
			
			location = this.href;
			
			return false;
		});
		
		if ($.cookie("pathName") ) {
			var currMenu = $.find("[href='" + $.cookie("pathName") + "']");
			if (currMenu) {
				console.log(currMenu)
				$(currMenu).parent().parent().show();
				$(currMenu).addClass("current");
			}
		}
		
		$($.find("[roles]:not([roles*='" + $.cookie("loginName") + "'])")).remove();
		
		$("#menu > li.level1 > a.current").parent().find('ul.level2').show(); //显示二级菜单

	});
	$('#content').height($(window).height()-52);
	window.onresize = function() {
		$('#content').height($(window).height()-52);
	}

})
