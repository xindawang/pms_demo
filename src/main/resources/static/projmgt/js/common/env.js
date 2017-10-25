document.write('<script type="text/javascript" src="/projmgt/plugin/jquery-1.11.2.min.js"></script>')
//document.write('<script type="text/javascript" src="/projmgt/plugin/jqueryui/jquery-ui.min.js"></script>')
document.write('<script type="text/javascript" src="/projmgt/plugin/jquery.cookie.js"></script>')
document.write('<script type="text/javascript" src="/projmgt/plugin/bootstrap/js/bootstrap.min.js"></script>')
document.write('<script type="text/javascript" src="/projmgt/js/common/iotLogin.js"></script>')
document.write('<script type="text/javascript" src="/projmgt/js/common/userValidation.js"></script>')
document.write('<script type="text/javascript" src="/projmgt/js/common/addAttribute.js"></script>')

document.write('<link rel="stylesheet" type="text/css" href="/projmgt/plugin/bootstrap/css/bootstrap.css" />')
// document.write('<link rel="stylesheet" type="text/css" href="/iw/css/three/style.css" />')
document.write('<link rel="stylesheet" type="text/css" href="/iw/css/style.css" />')
document.write('<link rel="stylesheet" type="text/css" href="/projmgt/css/projmgt.css" />')


// document.write('<link rel="stylesheet" type="text/css" href="/projmgt/plugin/bootstrap/css/font-awesome.css"/>');
// document.write('<!--[if lte IE 6]>');
// document.write('<link rel="stylesheet" type="text/css" href="/projmgt/plugin/bootstrap/css/bootstrap-ie6.css"/>');
// document.write('<link rel="stylesheet" type="text/css" href="/projmgt/plugin/bootstrap/css/ie.css"/>');
// document.write('<link rel="stylesheet" type="text/css" href="/projmgt/plugin/bootstrap/css/non-responsive.css"/>');
// document.write('<link rel="stylesheet" type="text/css" href="/projmgt/plugin/bootstrap/css/font-awesome-ie7.css"/>');
// document.write('<script src="/projmgt/plugin/bootstrap-ie.js" type="text/javascript" ></script>');
// document.write('<script src="/projmgt/plugin/json2.js" type="text/javascript" ></script>');
// document.write('<![endif]-->');
// document.write('<!--[if lte IE 9]>');
// document.write('<script src="/projmgt/plugin/html5shiv.js" type="text/javascript"></script>');
// document.write('<script src="/projmgt/plugin/respond.min.js" type="text/javascript" ></script>');
// document.write('<script src="/projmgt/js/common/placeholder.js" type="text/javascript" ></script>');
// document.write('<script src="/projmgt/plugin/PIE.js" type="text/javascript" ></script>');
// document.write('<script src="/projmgt/plugin/jquery.pseudo.js" type="text/javascript" ></script>');
// document.write('<![endif]-->');

PAGE_SIZE=5;
String.prototype.include = function (pattern) {
    return this.indexOf(pattern) > -1;
}

function apphost() {
	
  return (/^t\.|test/).test(window.location.host) ? "" : "";
	
}

function right(jsonData) {
	if (typeof(jsonData.result.code) != 'undefined' && jsonData.result.code == 11) {
		if ( /^\/iw\/three\//.test(window.location.pathname) ) {
			$.removeCookie("loginName", {"path": "/"});
			$.removeCookie("corpName", {"path": "/"});
			$.removeCookie("sid", {"path": "/"});
			window.location = "/iw/org/login.html";
		} else if ( /^\/iw\/org\//.test(window.location.pathname) ) {
			$.removeCookie("custId", {"path": "/"});
			$.removeCookie("token", {"path": "/"});
			$.removeCookie("loginName", {"path": "/"});
			$.removeCookie("corpId", {"path": "/"});
			$.removeCookie("corpCode", {"path": "/"});
			$.removeCookie("corpName", {"path": "/"});
			$.removeCookie("perms", {"path": "/"});
			$.removeCookie("token", {"path": "/"});
			window.location = "/iw/org/login.html";
		} else if ( /^\/iw\/admin\//.test(window.location.pathname) ) {
			$.removeCookie("userId", {"path": "/"});
			$.removeCookie("sid", {"path": "/"});
			window.location = "/iw/admin/login.html";
		}
		return false;
	} else if (typeof(jsonData.result.code) != 'undefined') {
		tip(jsonData.result.err);
		return false;
	} else
		return true;
}