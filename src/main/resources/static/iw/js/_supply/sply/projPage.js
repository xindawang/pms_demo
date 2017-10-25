/*//项目列表
var status = "";
alert(1);
_commit();
projPaginate();
function _commit() {
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/myProjPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/myProjPage/condition;nameLike=;scretLvl=公开,秘密;status=初始,已报价/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/myProjPage/{condition}/{sys}",
		data:{
			"condition": {
				"nameLike": $$("nameLike").value, 
				"status": "",
				"scretLvl": ""},
				
	        "sys": {
	        	"offset": $$("offset").value,
	    		"limit": $$("limit").value, 
	    		"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix: true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);	
			alert(jsonData);
			toView(jsonData,true);
			
			if(jsonData.result.myProjPage.length > 0) {
				if(jsonData.result.myProjPage[0].parentId > 0 && $.cookie("corpId") == jsonData.result.myProjPage[0].corpId) {
					$(".totalSupplyPriceDisPlay").show();
					$(".disctSupplyPriceDisPlay").show();
				}
			}
			alert(2);
		}
	});
}

function projPaginate() {
	if ($$("projPage-nav")) {
		alert(3);
		$("#projPage-nav").pagination({
			items: $$("projTotal").value,
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("offset").value = $$("limit").value * (pageIndex - 1);
				alert(4);
				_commit();
				projPaginate();
			}
		});
	}
}

//项目流标
function failProj(el) {	
	var no = $(el).parent().parent().find("[name='no']").val();
	if (confirm("是否确认流标？")){
	$.ajax({ 
		type: "post", 
		//@RequestMapping(value = "/failProj/{no}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/failProj/asdfaskwe23sd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url : apphost() + "/ils/supply/failProj/{no}/{sys}",
		data:{
			"no": no,
				
	        "sys": {"token": $.cookie("token")}
		},
		dataType : "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			_commit();
		}
	});
	}
}	
//获取当前状态值，完成按钮隐藏
function myProjStatus(el,val) {
	if (val == "已流标" || val == "已生成合同" || val == "折价待确认" || val == "折扣已拒绝") {
		$(el).parent().find("[id='myProjStatus']").hide();
	};
	
	if(val == "折价待确认") 
		$(el).parent().find("button[name='confirmProjDisctPriceDisplay']").show();
	
	valueToWithNoFunc(el,val);
}
//页面传参
function projPageHref(el) {
	var no = $(el).parent().find("[name='no']").val();
	var id = $(el).parent().find("[name='id']").val();
	location.href = "/iw/supply/projDetail.html?id=" + id + "&&no=" + no;
}

function confirmProjDisctPrice(el) {
	var no = $(el).parent().parent().find("input[name='no']").val();
	var agreed = $(el).find("input[name='agreed']").val();
	console.log(no, agreed);
	if(no != undefined && agreed != undefined) {
		$.ajax({ 
			type: "post", 
			//@RequestMapping(value = "/confirmProjDisctPrice/{no}/{agreed}/{sys}", produces = "text/plain")
			// http://localhost:81/ils/org/confirmProjDisctSupplyPrice/asdfaskwe23sd/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
			url : apphost() + "/ils/supply/confirmProjDisctPrice/{no}/{agreed}/{sys}",
			data:{
				"no": no,			
				"agreed": agreed,			
		        "sys": {"token": $.cookie("token")}
			},
			dataType : "json",
			async: false,
			martrix:true,
			success: function (jsonData) {
				if (!right(jsonData)) return;
				console.log(jsonData);
				window.location.reload();
			}
		});
	} else 
		return; 
}

function contractIdValueTo(el, val) {
	if(val == 0) 
		$(el).parent().hide();
		

}
	

*/