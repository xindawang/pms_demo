contractDetail();
function contractDetail() {

	if (!param("id")) return;
	
	$.ajax({		
		type: "post",
		//@RequestMapping(value = "/contractDetail/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/contractDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/contractDetail/{id}/{sys}",
		data:{
			"id": param("id"),			
			"sys": {"token": $.cookie("token") }
		},
		async: false,
		martrix:true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			
			$("#regAt").val(jsonData.result.contractDetail.regAt);
			
			toView(jsonData,true);  
			
			
			
		}
		
			
		});
}

function _custsCommit(){
	
	/*var corpId = $$("aCorpId").value;
	 var itemDisplay = $("#firstuserModal").css("display");
	    if(itemDisplay == 'none'){
	            $("input[id='custName']").val("");
	    }*/
	$.ajax({
		type: "post",
		//@RequestMapping(value = "/custByCorpIdPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/org/custByCorpIdPage/condition;corpId=1;nameLike=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/custByCorpIdPage/{condition}/{sys}",
		data:{
			"condition": {
				"corpId": 2,
				"nameLike": ""},			
	        "sys": {"offset": $$("custOffset").value, "limit": $$("custLimit").value,"token":$.cookie("token")}			
		},
		dataType: "json",
		async: false,
		martrix:true,
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData,true);
		}
	});
}

function custsPaginate() {
	if ($$("custPage-nav")) {
		$("#custPage-nav").pagination({
			items: $$("custTotal").value,
			itemsOnPage: $$("custLimit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {
				$$("custOffset").value = $$("custLimit").value * (pageIndex - 1);
				_custsCommit();
			}
		});
	}
}

function changeIcon(el, val){
	if(val == 0) 
	  $(el).after("<span class='tree-indent'></span><span class='tree-icon tree-file'></span>")
	if(val > 0) {
		var id = $(el).parent().parent().parent().find("input[name='id']").val();
		$(el).parent().parent().parent().attr("data-id", id);
		var no =  $(el).parent().find("div[name='no']").text();
		var template = $(el).parent().parent().parent().clone();
		$(el).after("<span class='tree-hit tree-expanded'></span><span class='tree-icon tree-folder tree-folder-open'></span>")
		template.attr("name", no + "Template")
		template.find("[name='subInventories']").after("<span class='tree-indent'></span><span class='tree-indent'></span><span class='tree-icon tree-file'></span>")
		$(el).parent().parent().parent().after(template);
	}
		
}