/*****************************************************************************************
 * xxxValueTo函数
 *****************************************************************************************/
function itemOrModelTitle(el, value) {
	
}

function itemDetailByPageType(el, value) {
	if (value.pageType == "myItem") $(el).attr("href", "itemDetail.html?no=" + value.no);
	else if (value.pageType == "myModel") $(el).attr("href", "modelDetail.html?no=" + value.no);
	else if (value.pageType == "pub") $(el).attr("href", "pubItemDetail.html?no=" + value.no);
	else if (value.pageType == "children") $(el).attr("href", "pubItemDetail.html?no=" + value.no);
}

function supplyItemDetailByPageType(el, value) {
	$(el).attr("href", "supplyItemDetail.html?no=" + value.no);
}

function certItemDetailByPageType(el, value) {
	$(el).attr("href", "itemDetail.html?no=" + value.no);
}

function supplyItemPageTitle(el, value) {
	if (param("pageType") == "myItem") $(el).html("我的物项");
	else if (param("pageType") == "myModel") $(el).html("我的型号");
	else if (param("pageType") == "pub") $(el).html("已认证公开物项");
	else if (param("pageType") == "children") $(el).html("下级物项");
}

function showOrHiddenSaveDraftButton(el, value) {
	if (null == value || value == "" || value == "初始" || value == "暂存") {
		valueToWithNoFunc(el, "保存为草稿并返回");
	}
	else {
		$(el).parent().remove();
	}
}

function createOrModCertIntoBtn(el, value) {
	if (null == value || value == "" || value == "初始" || value == "暂存") {
		valueToWithNoFunc(el, "创建认证信息并返回");
	}
	else if (value == "认证中") {
		valueToWithNoFunc(el, "修改认证信息并返回");
	}
	else if (value == "认证通过" || value == "已取消" || value == "已拒绝") {
		$(el).parent().remove();
	}
}

function createOrModItemBtn(el, value) {
	if (null == value || value == "") {
		if (location.pathname.include("itemDetail.html")) valueToWithNoFunc(el, "创建物项并返回");
		else valueToWithNoFunc(el, "创建型号并返回");
	}
	else if (value == "初始" || value == "暂存" || value == "认证中") {
		if (location.pathname.include("itemDetail.html")) valueToWithNoFunc(el, "修改物项并返回");
		else valueToWithNoFunc(el, "修改型号并返回");
	}
	else if (value == "认证通过" || value == "已取消" || value == "已拒绝") {
		$(el).parent().remove();
	}
}

function createOrModItemWithCertBtn(el, value) {
	if (null == value || value == "") {
		if (location.pathname.include("itemDetail.html")) valueToWithNoFunc(el, "创建物项并完善认证信息");
		else valueToWithNoFunc(el, "创建型号并完善认证信息");
	}
	else if (value == "初始" || value == "暂存" || value == "认证中") {
		if (location.pathname.include("itemDetail.html")) valueToWithNoFunc(el, "修改物项并完善认证信息");
		else valueToWithNoFunc(el, "修改型号并完善认证信息");
	}
	else if (value == "认证通过" || value == "已取消" || value == "已拒绝") {
		$(el).parent().remove();
	}
	
}

function showAttr(templateClone, attr, replyCode) {
	
	templateClone.css("display", "");
	
	var els = templateClone.find("[name*='#{attrCode}']");
	for (var i = 0; el = els[i]; i++) 
		$(el).attr( "name", $(el).attr("name").replace("#{attrCode}", attr.code).replace("#{replyCode}", replyCode) );
	
	$("#attrs").append(templateClone);
	
}

function toViewAttrs(attrs, jattrs) {
	if (null == attrs) return;
	
	var template, templates, templateClone, replyCode, replyCodes, attrCode, data;
	
	for (var j = 0; attr = attrs[j]; j++) {
		
		attr.rowNo = j + 1;
		
		for (replyCode in attr.replyByReplyCode) attr[replyCode] = attr.replyByReplyCode[replyCode];
		
		switch (attr.modeType) {
		case "整数":
			replyCode = "integer";
			template = $.find("tr[name='整数']:hidden");
			templateClone = $(template).clone();
			showAttr(templateClone, attr, replyCode);
			break;
		case "小数":
			replyCode = "decimal";
			template = $.find("tr[name='小数']:hidden");
			templateClone = $(template).clone();
			showAttr(templateClone, attr, replyCode);
			break;
		case "一个单选框":
			replyCode = attr.replyCodes;
			template = $.find("tr[name='一个单选框']:hidden");
			templateClone = $(template).clone();
			showAttr(templateClone, attr, replyCode);
			break;
		case "一个公差":
			templates = $.find("tr[name='一个公差']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == 0 ? "normalValue" : i == 1 ? "upperValue" : "downValue";
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "文本":
			replyCode = "text";
			template = $.find("tr[name='文本']:hidden");
			templateClone = $(template).clone();
			showAttr(templateClone, attr, replyCode);
			break;
		case "两个单选框":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='两个单选框']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "三个单选框":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='三个单选框']:hidden");			
			for (var i = 0; template = templates[i]; i++) {
				replyCode = replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			
			break;
		case "四个单选框":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='四个单选框']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "五个单选框":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='五个单选框']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "六个单选框":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='六个单选框']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "一个单选框和一个整数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='一个单选框和一个整数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "integer" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "一个单选框和一个小数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='一个单选框和一个小数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "decimal" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "一个单选框和一个公差":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='一个单选框和一个公差']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i < templates.length - 3 ? replyCodes[i] : i == templates.length - 3 ? "tolerence.normal" : 
					(i == templates.length - 2 ? "tolerence.upper" : "tolerence.down");
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "两个单选框和一个整数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='两个单选框和一个整数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "integer" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "两个单选框和一个小数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='两个单选框和一个小数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "decimal" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "两个单选框和一个公差":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='两个单选框和一个公差']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i < templates.length - 3 ? replyCodes[i] : i == templates.length - 3 ? "tolerence.normal" : 
					(i == templates.length - 2 ? "tolerence.upper" : "tolerence.down");
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "三个单选框和一个整数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='三个单选框和一个整数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "integer" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "三个单选框和一个小数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='三个单选框和一个小数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "decimal" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "四个单选框和一个整数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='四个单选框和一个整数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "integer" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "四个单选框和一个小数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='四个单选框和一个小数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "decimal" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "五个单选框和一个小数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='五个单选框和一个小数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "decimal" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "六个单选框和一个小数":
			replyCodes = attr.replyCodes.split(",");
			templates = $.find("tr[name='六个单选框和一个小数']:hidden");
			for (var i = 0; template = templates[i]; i++) {
				replyCode = i == templates.length - 1 ? "decimal" : replyCodes[i];
				templateClone = $(template).clone();
				showAttr(templateClone, attr, replyCode);
			}
			break;
		case "一个图纸":
			replyCode = "draw";
			template = $.find("tr[name='一个图纸']:hidden");
			templateClone = $(template).clone();
			showAttr(templateClone, attr, replyCode);
			break;
		}
		
		attrCode = attr.code;
		// 显示左侧的物项名称，属性名称，回复名称
		data = {"result": {}};
		data.result[attrCode] = attr;
		toView(data);
		
	}
	
	// 显示右侧的回复的数据
	if (null != jattrs && jattrs != {}) {
		data = {"result": {}};
		for (attrCode in jattrs) data.result[attrCode] = jattrs[attrCode];
		console.log(data);
		toView(data);
	}
	
	$("input.form-control.integer").change(function() {
		if (null == jattrs[currAttrCode]) jattrs[currAttrCode] = {};
		jattrs[currAttrCode]["integer"] = $(this).val();});
	$("input.form-control.integer").click(function() {currAttrCode = $(this).attr("name").replace(/\..*/, "");});

	$("input.form-control.decimal").change(function() {
		if (null == jattrs[currAttrCode]) jattrs[currAttrCode] = {};
		jattrs[currAttrCode]["decimal"] = $(this).val();});
	$("input.form-control.decimal").click(function() {currAttrCode = $(this).attr("name").replace(/\..*/, "");});
	
	$("textarea.form-control.text").change(function() {
		if (null == jattrs[currAttrCode]) jattrs[currAttrCode] = {};
		jattrs[currAttrCode]["text"] = $(this).val();});
	$("textarea.form-control.text").click(function() {currAttrCode = $(this).attr("name").replace(/\..*/, "");});
	
	$("input.form-control.draw").change(function() {
		if (null == jattrs[currAttrCode]) jattrs[currAttrCode] = {};
		jattrs[currAttrCode]["draw"] = $(this).val();});
	$("input.form-control.draw").click(function() {currAttrCode = $(this).attr("name").replace(/\..*/, "");});
	
	$("input.form-control.normal").change(function() {
		if (null == jattrs[currAttrCode]) jattrs[currAttrCode] = {};
		jattrs[currAttrCode]["normal"] = $(this).val();});
	$("input.form-control.normal").click(function() {currAttrCode = $(this).attr("name").replace(/\..*/, "");});
	
	$("input.form-control.upper").change(function() {
		if (null == jattrs[currAttrCode]) jattrs[currAttrCode] = {};
		jattrs[currAttrCode]["upper"] = $(this).val();});
	$("input.form-control.upper").click(function() {currAttrCode = $(this).attr("name").replace(/\..*/, "");});
	
	$("input.form-control.down").change(function() {
		if (null == jattrs[currAttrCode]) jattrs[currAttrCode] = {};
		jattrs[currAttrCode]["down"] = $(this).val();});
	$("input.form-control.down").click(function() {currAttrCode = $(this).attr("name").replace(/\..*/, "");});
	
}

function roleStatusValueTo(el, value) {
	value = (value == 1 || value == "true" || value == true) ? "启用" : "禁用";
	valueToWithNoFunc(el, value);
}

function roleStatusButton(el, value) {
	value = (value == 1 || value == "true" || value == true) ? "禁用" : "启用";
	var cls = value == "禁用" ? "btn-danger" : "btn-primary";
	var spanCls = value == "禁用" ? "glyphicon-minus-sign" : "glyphicon-ok";
	$(el).removeClass("btn-danger");
	$(el).removeClass("btn-primary");
	$(el).addClass(cls);
	$(el).html('<span class="glyphicon ' + spanCls + '"></span> ' + value);
}	

function drawValueTo(el, value) {
	value = "/images/draw/" + value + ".png";
	valueToWithNoFunc(el, value );
}
function roleOptionValueTo(el, value) {
	var json = JSON.parse(value);
	valueToWithNoFunc(el, {'value':json.id, 'text':json.name} );
}
function grpCateAllOptionValueTo(el, value) {
	var json = JSON.parse(value);
	valueToWithNoFunc(el, {'value':json.grpCode, 'text':json.grpName} );
}
function cateAllOptionValueTo(el, value) {
	var json = JSON.parse(value);
	valueToWithNoFunc(el, {'value':json.code, 'text':json.name} );
}
function idSelectedValueTo(el, value) {
	/*var json = JSON.parse(value);*/
	var json = $.parseJSON(value);
	$(el).attr("value", json.id);
	if (json.selected == true) $(el).attr("checked", true);
	else $(el).attr("checked", false);
}

// from timeStamp to date String
function toYYYYMMDD(el,value) { 
	var date = new Date(value);
	valueToWithNoFunc(el, date.format("yyyy-MM-dd") );
}

// from timeStamp to full date String
function toYYYYMMDDHHMMSS(el,value) { 
	var date = new Date(value);
	valueToWithNoFunc( el,date.format("yyyy-MM-dd hh:mm:ss") );
}

// "2015-06-09T00:00:00Z" to 6.19 or 2016.6.19
function toDateFromSole(el,value) { 
	var date = new Date(new Date(value).valueOf() - 8 * 3600000);
	valueToWithNoFunc(el, (date.getFullYear() == new Date().getFullYear() ? "" : (date.getFullYear() + ".") ) + (date.getMonth() + 1) + "." + date.getDate() );
}

function imageValueTo(el,value) {
	if (value != "")
		el.src = filehost() + "/file/fileService/fetchThumb;domain=head;size=thumb;fullFileName=" + value + "/sys;terminal=pc";
}

function imageBackgroundValueTo(el,value) {
	if (value != "")
		$(el).css("backgroundImage","url(" + filehost() + "/file/fileService/fetchThumb;domain=head;size=thumb;fullFileName=" + value + "/sys;terminal=pc" + ")");
}

function QRCodeValueTo(el,value) {
	el.src = apphost() + "/part/back/QRCode/" + value + "/sys;sid=" + $.cookie("sid");
	$$("downloadQRCode").href = el.src;
}

function distanceValueTo(el, value) {
	var latlng = value[0].split(",");
	el.innerHTML = distance( parseFloat(latlng[0]), parseFloat(latlng[1]),  parseFloat($.cookie("lat")), parseFloat($.cookie("lon")) );
}
	
var EARTH_RADIUS = 6378137.0;    //单位M     var
var PI = Math.PI;
function getRad(d){ return d*PI/180.0; }
function distance(lat1,lng1,lat2,lng2) {
	var f = getRad((lat1 + lat2)/2);
	var g = getRad((lat1 - lat2)/2);
	var l = getRad((lng1 - lng2)/2);
	
	var sg = Math.sin(g);
	var sl = Math.sin(l);
	var sf = Math.sin(f);
	
	var s,c,w,r,d,h1,h2;
	var a = EARTH_RADIUS;
	var fl = 1/298.257;
	
	sg = sg*sg;
	sl = sl*sl;
	sf = sf*sf;
	
	s = sg*(1-sl) + (1-sf)*sl;
	c = (1-sg)*(1-sl) + sf*sl;
	
	w = Math.atan(Math.sqrt(s/c));
	r = Math.sqrt(s*c)/w;
	d = 2*w*a;
	h1 = (3*r -1)/2/c;
	h2 = (3*r +1)/2/s;
	
	var _distance = d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg)) // 米
	return _distance > 1000 ? (_distance / 1000).toFixed(1) : _distance.toFixed(0) ;
}

function adminStatusValueTo(el,value) {
	if (value == 0) {
		$(el).parent().parent().addClass("disable");
		$(el).html("已禁用");

	} else if (value == 1) {
		$(el).html("有效");
	}
}


function userNameValueTo(el,value) {
	if (value == "") value = "匿名用户";
	valueToWithNoFunc(el, value);
}

function genderImageSrcValueTo(el,value) {
	if (value == "")  return;
	el.src = value == "男" ? "/images/h5/male.png" : "/images/h5/female.png";
}
function genderSelectValueTo(el,value) {
	if (value == "")  return;
	$(el).val(value);
}

function tagLiValueTo(el, value) {
	if ( !value || value.trimAll() == "" ) return;
	var tags = value.replace(/\s+/g, " ").replace(/^ /, "").split(" ");
	for (var i = 0, tag; tag = tags[i]; i++)	{
		$(el).append('<li class="active">'+ tag + '</li>');
	}

}
function tagValueTo(el, value) {
	if ( !value || value.trimAll() == "" ) return;
	value = value.replace(/\s+/g, " ").replace(/^ /, "");
	valueToWithNoFunc(el, value);
}

function descrValueTo(el,value) {

	var descr = value;
	for (var i=0, title; i < descr.length; i++)
	{
		if (descr[i].title == "工作内容") $("#content").text(descr[i].value);
		else $("#require").text(descr[i].value);
			
	}
}


function dateValueTo(el, val) {
	val = val.substr(0,10);
	el.innerHTML = val;
}

function durationToChineseYMD(bid) {
	var ret = (bid.years == 0 ? "" : bid.years + "年") + (bid.months == 0 ? "" : "零" + bid.months + "月") + (bid.days == 0 ? "" : "零" + bid.days + "天"); 
	return ret.replace(/^零/, "").replace(/^零/, "");
}
function isDefaultValueTo(el, value) { if (value ) valueToWithNoFunc(el, "【默认】"); }
function disableIsDefault(el, value) { if (value ) el.style.display = "none"; }
function attrAndValueToData(el, value) { $(el).data($(el).attr("name"), value); }
function rateValueTo(el, value) { value = (value * 1000000)/10000; value = value + "%"; valueToWithNoFunc(el, value);}
function rateValueToWithoutPer(el, value) { value = (value * 1000000)/10000; valueToWithNoFunc(el, value);}
function ratioValueTo(el, value) { $(el).attr("data-percent", (value * 100).toFixed(2) + "%");}
function ratioValueTo2(el, value) { value = value == 1 ? "100%" : (value * 100).toFixed(2) + "%"; valueToWithNoFunc(el, value);}
function ratioWidthValueTo(el, value) { $(el).css("width", value * 100 + "%")}
function openBidStatusAsActive(el, value) { if (value == "投标中") $(el).parent().addClass("active"); $(el).attr("data-status", value);valueToWithNoFunc(el, value);}
function amountChineseValueTo(el, value) {value = toChineseCurrency(value); valueToWithNoFunc(el, value);}
function yearsValueTo(el, value) {
	if (value == 0) {
		$(el).parent().css("display","none");
		return;
	}
	valueToWithNoFunc(el, value);
}
function monthsValueTo(el, value) {
	if (value == 0) {
		$(el).parent().css("display","none");
		return;
	}
	valueToWithNoFunc(el, value);
}
function daysValueTo(el, value) {
	if (value == 0) {
		$(el).parent().css("display","none");
		return;
	}
	valueToWithNoFunc(el, value);
}
function yearsNoParentValueTo(el, value) {
	if (value == 0) {
		$(el).css("display","none");
		return;
	}
	value = value + "年";
	valueToWithNoFunc(el, value);
}
function monthsNoParentValueTo(el, value) {
	if (value == 0) {
		$(el).css("display","none");
		return;
	}
	value = value + "个月";
	valueToWithNoFunc(el, value);
}
function daysNoParentValueTo(el, value) {
	if (value == 0) {
		$(el).css("display","none");
		return;
	}
	value = value + "天";
	valueToWithNoFunc(el, value);
}
function assumeInterestAtFromTodayValueTo(el, value) {
	if (typeof(value) == "undefined") return;
	$(el).parent().parent().css("display", "");
	valueToWithNoFunc(el, value);
}

function includeMinAmountValueTo(el, value) {
	if(value == false) el.innerHTML = ">";
	else el.innerHTML = ">=";
}

function includeMaxAmountValueTo(el, value) {
	if(value == false) el.innerHTML = "<";
	else el.innerHTML = "<=";
}

//转换为千分位
function thousandValueTo(el, val) {
	val += '';  
	el.innerHTML = val.replace(/(?!^)(?=(\d{3})+($|\.))/g,",");
}

function newlineWithBr(el, value) { 
	valueToWithNoFunc(el, value.newlineWithBr());
}

function newlineWithSlashN(el, value) { 
	valueToWithNoFunc(el, value.newlineWithSlashN());
}

function thirdPartyTemplateValueTo(el, value) {
	var json = JSON.parse(value);
	valueToWithNoFunc(el, {'value':json.id, 'text':json.name} );
}
function raiseFromValueTo(el, value) {
	value = value.substr(0,10);
	valueToWithNoFunc(el, value);
}
function raiseToValueTo(el, value) {
	value = value.substr(0,10);
	valueToWithNoFunc(el, value);
}

function serviceFeeRateValueTo(el, value) {
	value = (value * 1000000) / 10000;
	valueToWithNoFunc(el, value);
}

function trueOrFalseValueTo(el, value) {
	value = value == true ? 1 : 0;
	valueToWithNoFunc(el, value);
}


/*****************************************************************************************
 * xxxValueTo函数 end
 *****************************************************************************************/

//上传日志接口
function makeBizLog(makeBizLogMap) {
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/makeBizLog/{map}/{sys}", produces = "text/plain")
		// 记录业务上一些重要的日志：增删改和登录
		// map参数的每项值必不可少；reqParams JSON字符串中的参数个数最多为5个，最少为2个，超过5个，捡重要的参数放进去
		// 这个Ajax请求的async=true，即必须是异步的，不管成功与否，业务继续走下去
		// http://10.2.201.91/ils/cloud/makeBizLog/map;opName=用户登录;reqParams={'idNo':230103197110206819,'checkcode':'ASDK'};domain=cust;action=login;reqURI=login.html;status=成功/sys;token=QIj%23yoaMvN%7fd%23%7eaHLMi%21%5fR%40J4fF%2c8Lj5pFXH9%3esDC5%5f%7dq%5cakh%60
		url: apphost() + "/ils/cloud/makeBizLog/{map}/{sys}", 
		data: {
			"map": makeBizLogMap,
			"sys": {"token": $.cookie("token")}
		}, 
		async: true,
		martrix: true,
		dataType: "json",
		success: function () {
		}
	}); 
}
