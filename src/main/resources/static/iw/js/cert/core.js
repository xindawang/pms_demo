bootPATH = '/iw/css/bootstrap/js/';
document.write('<!--[if lte IE 9]>');
document.write('<script src="' + bootPATH + 'jquery.pseudo.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'html5shiv.js" type="text/javascript"></sc' + 'ript>');
//document.write('<script src="' + bootPATH + 'respond.min.js" type="text/javascript" ></sc' + 'ript>');
document.write('<![endif]-->');

document.write('<!--[if lte IE 6]>');
document.write('<script src="' + bootPATH + 'jquery.placeholder.min.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'bootstrap-ie.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + '/iw/js/json2.js" type="text/javascript" ></script>');
document.write('<![endif]-->');

$(function() {	
	$('#top').load('/iw/cert/top.html');	
	$('#left').load('/iw/cert/left.html',function() {
		$(this).height($(window).height()-50);
		
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
			
			if(navigator.userAgent.indexOf("MSIE 6.0") > 0) 
				var currMenu = $("#menu").find("a[href='http://" + location.host + $.cookie("pathName") + "']");
			else 
				var currMenu = $("#menu").find("a[href='" + $.cookie("pathName") + "']");

			if (currMenu) {
				console.log(currMenu)
				$(currMenu).parent().parent().show();
				$(currMenu).addClass("current");
			}
		}
		
		var perms = $.find("[perm]");
		for (var i = 0, hasPerm = false; perm = perms[i]; i++) {
			if ( $.cookie("perms") && $.cookie("perms").include( $(perm).attr("perm") )) {
				hasPerm = true;
				continue;
			}
			if (!hasPerm) $(perm).remove();
		}

		$("#menu > li.level1 > a.current").parent().find('ul.level2').show(); //显示二级菜单
	});
	$('#content').height($(window).height()-140);
	window.onresize = function() {
		$('#content').height($(window).height()-140);
	}
});