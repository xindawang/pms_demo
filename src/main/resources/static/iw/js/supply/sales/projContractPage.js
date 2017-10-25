//排序方式
var orderDefault = "CONTRACTNUM";
function orderBy(el, val) {

	var elValue = $(el).attr("value");

	if (elValue == "CONTRACTNUM") {
		$("#CONTRACTNUM").attr("class", "btn btn-primary");
	}
	orderDefault = elValue;

	if (elValue == "CONTRACTNUM"){
		$(el).attr("value", orderDefault + " DESC");
	}else{
		$(el).attr("value", orderDefault.replace(" DESC", ""));
	}
		
	orderDefault = $(el).attr("value");
	_commit();
}

//获取默认每页显示个数
var limit = $("#limit").val();
//进页面请求
_commit();
function _commit() {
	if(param("projId") == ""){
		tip("projId为空");
	}
	$.ajax({
	    type : "post",
	    // @RequestMapping(value = "/contractPage/{condition}/{orderBy}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/contractPage/condition;projId=;nameLike=/CONTRACTNO/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/contractPage/{condition}/{orderBy}/{sys}",		        
		data:{
			"condition": { 
				"projId": param("projId"),
				"nameLike":""
			},
			"orderBy":orderDefault,
			"sys": {
				"offset": $("#offset").val(),
				"limit": limit, 
				"token": $.cookie("token")
			}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			   console.log(jsonData);	
			   toView(jsonData, true);
		}
	});
}

//分页
function paginate() {
	if ($$("page-nav")) {
		$("#page-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("offset").value = $$("limit").value * (pageIndex - 1);

				_commit();
			}
		});
	}
}

//为最上方项目名称与间接赋值
function changeValueTo(el, val){
	var projName = $(el).parent().find("input[name='projName']").val() + "项目";
	$("#projName").text(projName);
	var projDescr = $(el).parent().find("input[name='projDescr']").val();
	$("#projDescr").text(projDescr);
	valueToWithNoFunc(el, val);
}

//点击改变页面显示个数
var clickOne = true;
function limitValueTo(el){
	limit = $(el).val().replace("个/页", "");
	if(clickOne){
		clickOne = false;
	}else{
		clickOne = true;
		_commit();
	}
}


function hrefOutContractNew() {
	location.href="/iw/supply/sales/outContractNew.html?projId=" + param("projId");
}