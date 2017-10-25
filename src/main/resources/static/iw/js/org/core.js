bootPATH = '/iw/css/bootstrap/js/';

document.write('<link rel="stylesheet" type="text/css" href="/iw/css/bootstrap/css/font-awesome.css"/>');
document.write('<!--[if lte IE 6]>');
document.write('<link rel="stylesheet" type="text/css" href="/iw/css/bootstrap/css/bootstrap-ie6.css"/>');
document.write('<link rel="stylesheet" type="text/css" href="/iw/css/bootstrap/css/ie.css"/>');
document.write('<link rel="stylesheet" type="text/css" href="/iw/css/bootstrap/css/non-responsive.css"/>');
document.write('<link rel="stylesheet" type="text/css" href="/iw/css/bootstrap/css/font-awesome-ie7.css"/>');
document.write('<![endif]-->');
document.write('<link rel="stylesheet" type="text/css" href="/iw/css/three/style.css"/>');


document.write('<!--[if lte IE 9]>');
document.write('<script src="' + bootPATH + 'html5shiv.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'respond.min.js" type="text/javascript" ></script>');
document.write('<script src="' + '/iw/js/placeholder.js" type="text/javascript" ></script>');
document.write('<script src="' + '/iw/js/PIE.js" type="text/javascript" ></script>');
document.write('<script src="' + bootPATH + 'jquery.pseudo.js" type="text/javascript" ></script>');
document.write('<![endif]-->');

document.write('<!--[if lte IE 6]>');	
document.write('<script src="' + '/iw/js/bootstrap-ie.js" type="text/javascript" ></script>');
document.write('<script src="' + '/iw/js/json2.js" type="text/javascript" ></script>');
document.write('<![endif]-->');

$(document).ready(function() {
	$("a").on("focus",function(){
		this.blur();
	});
	
	
	$('#top').load('/iw/org/top.html',function(){});	
	$('#left').load('/iw/org/left.html', function() {
		$("#menu > li.level1 > a").click(function() {
			$(this).addClass('current').next().show() // 下一个元素显示
			.parent().siblings().children("a").removeClass("current") // 父元素的兄弟元素的子元素<a>移除"current"
			.next().hide(); // 它的下一个元素隐藏
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
			
			if(navigator.userAgent.indexOf("MSIE 6.0") > 0) 
				var currMenu = $("#menu").find("a[href='http://" + location.host + $.cookie("pathName") + "']");
			else 
				var currMenu = $("#menu").find("a[href='" + $.cookie("pathName") + "']");

			if (currMenu.length>0) {
				//console.log(currMenu)
				$(currMenu).parent().parent().show();
				$(currMenu).addClass("current");
			}
		}
		var perms = $.find("[perm]");
		for (var i = 0, hasPerm = false; perm = perms[i]; i++) {
			if ( $.cookie("perms") && $.cookie("perms").include( $(perm).attr("perm") )) {
				continue;
			}
			if (!hasPerm) $(perm).remove();
			hasPerm = false;
		}
		$("#menu > li.level1 > a.current").parent().find('ul.level2').show(); //显示二级菜单
		var leftMenuLi = $("#left ul");
		for (var i = 0; leftMenu = leftMenuLi[i]; i++) {
			if($(leftMenuLi[i]).find("li").length > 0){
				continue;
			}
			$(leftMenu).parent().remove();
		}
	});
	
	if($.isFunction($.bootstrapIE6)) {
		$.bootstrapIE6($(document));
	}
	$('#content').height($(window).height()-140);	
	$('.modal').width($(window).width());
	$('.modal').height($(window).height());
	window.onresize = function() {
		$('#content').height($(window).height()-140);
		$('.modal').width($(window).width());
		$('.modal').height($(window).height());
	}
	
	
});


