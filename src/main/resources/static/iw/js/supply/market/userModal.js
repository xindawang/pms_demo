function _commit() {
	$.ajax({
		type : "post",
		// @RequestMapping(value = "/custPage/{condition}/{sys}",
		// produces = "text/plain")
		// http://localhost:81/ils/org/orgPage/condition;nameLike=/sys;offset=0;limit=10;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/org/custPage/{condition}/{sys}",
		data : {
			"condition" : {
				"nameLike" : $$("nameLike").value,
			},
			"sys" : {
				"offset" : $$("offset").value,
				"limit" : $$("limit").value,
				"token" : $.cookie("token")
			}
		},
		dataType : "json",
		async : false,
		martrix : true,
		success : function(jsonData) {
			if (!right(jsonData))
				return;
			console.log(jsonData);
			toView(jsonData, true);
		}
	});

}

var custName;
var createrId;
function chooseCust() {
	var name = $('input:radio:checked').parent().parent().find("td[id='name']").text();
	var corpName = $('input:radio:checked').parent().parent().find("td[id='corpName']").text();
	custName = name + " / " + corpName;
	$("input[id='custName']").val(custName);
	createrId = $('input:radio:checked').parent().parent().find("td[id='custId']").text();
	$("input[id='createrId']").val(createrId);

}

function saveReplier() {
	
	if(createrId == "" || createrId == undefined) return;
	
	for (var i = 0; i < $("[name='cloneCreaterIds']").length ; i++) {
		
		if ( $("[name='cloneCreaterIds']").eq(i).text() == createrId ) {
			tip("不能指定相同的答复人");
			return;
		}
	}
	
	var clone = "<tr> " +
			"<td style='display: none;'><span name='cloneCreaterIds'>"+ createrId +"</span></td>" +
			"<td><span name='cloneCustName'>"+ custName +"</span></td>" +
			"<td><span name='cloneDescr'>"+ $("#descrs").val() +"</span></td>" +
			"</tr>";
	$("[name='replierPageTemplet']").after(clone);
}

function clikCust(){
	$("#createrId").val("");
	$("#custName").val("");
	$("#descrs").val("");
	
	var map = {}
	for (var i = 0; i < $("[name='cloneCreaterIds']").length ; i++) {
		map[$("[name='cloneCreaterIds']").eq(i).text()] =  $("[name='cloneDescr']").eq(i).text();
	}
}


var custName;
var createrId;
var i = 0;
var id = "";
function proChoose() {
	var no = $('input:radio:checked').parent().parent().find("td[name='no']").text();
	var nsn = $('input:radio:checked').parent().parent().find("td[name='nsn']").text();
	var name = $('input:radio:checked').parent().parent().find("td[name='name']").text();

	for (var b = 0; b < $("[name='proQuestion']").length ; b++) {
		
		if ( $("[name='nos']").eq(b).text() == no ) {
			tip("不能指定相同的产品");
			return;
		}
		else 
			i++;
		
	}
	id += no + ",";
	var clone = "<tr name='proQuestions'>"  +
	"<td name='nos' style='display: none'>" + no + "</td>" +
	"<td>" + nsn + "</td>" +
	"<td>" + name + "</td>" +
	"<td><button type='button' class='btn btn-danger' onclick='' >删除</button></td>" +
	"</tr>";
	$("[name='proQuestion']").after(clone);
}








