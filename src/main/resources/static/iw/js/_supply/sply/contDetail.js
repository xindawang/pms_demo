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
			
			
			// 展开所有一级配套表下的二级配套表
			var inventories = jsonData.result.inventories;
			var subInventories = jsonData.result.subInventories;

			// 按照一级配套表的id对二级配套表分组
			var subInvGrp = {};
			for (var i = 0; inv = inventories[i]; i++) {
				subInvGrp[inv.id] = [];
			}
			
			for (var j = 0; subInv = subInventories[j]; j++) {
				subInvGrp[subInv.parentId].push(subInv);
			}
			
			// 根据一级配套表找到其对于tr行，并在其下append所有的该一级配套表的二级配套表
			var invTr;
			var template = "<tr data-parent='#{parentId}'><input type='hidden' value=#{id} name='id'/> <input type='hidden' name='parentId' value=#{parentId}>" +
					       	  	"<td>" +
						       	  	"<div class='tree-node tree-root-one tree node-last'>" +
						       	  	"<input type='hidden' name='no' value='#{no}'/>" +
						       	  	"<span class='tree-indent'></span><span class='tree-indent'></span><span class='tree-icon tree-file'></span>" +
						       	  	"<span class='tree-title' name='itemName'>#{itemName}</span></div>" +
					       	  	"</td>" +
								"<td name='nsn'>#{nsn}</td>" +
								"<td name='partNo'>#{partNo}</td>"+
								"<td name='status'>#{status}</td>"+
								"<td class='text-right' >	" +
									"<span  class='number' name='num'>#{num}</span>" +									
								"</td>" +
								"<td class='text-right' name='totalPrice'>#{totalPrice}" +
								"</td>" +								
								"</tr>"
			var templateClone = template;
			
			for (var invIdKey in subInvGrp) {
				
				if (subInvGrp[invIdKey].length == 0) continue;
				
				invTr = $("tr[name='inventoriesTemplate']:visible input[value=" + invIdKey + "]").parent();
				
				for (var i = 0; subInv = subInvGrp[invIdKey][i]; i++) {
					if (subInv.id == null) subInv.id = "";
					if (subInv.parentId == null) subInv.parentId = "";
					if (subInv.no == null) subInv.no = "";
					if (subInv.itemName == null) subInv.itemName = "";
					if (subInv.nsn == null) subInv.nsn = "";
					if (subInv.num == null) subInv.num = "0";
					if (subInv.totalPrice == null) subInv.totalPrice = "0";
					if (subInv.partNo == null) subInv.partNo = "";
					console.log(subInv.totalPrice);
					template = template.replaceAll("#{status}", subInv.status);
					template = template.replaceAll("#{id}", subInv.id);
					template = template.replaceAll("#{parentId}", subInv.parentId);
					template = template.replaceAll("#{no}", subInv.no);
					template = template.replaceAll("#{itemName}", subInv.itemName);
					template = template.replaceAll("#{nsn}", subInv.nsn);
					template = template.replaceAll("#{num}", subInv.num);
					template = template.replaceAll("#{totalPrice}", subInv.totalPrice);
					template = template.replaceAll("#{partNo}", subInv.partNo);					
					invTr.after(template);
					template = templateClone;
				}
			}
			
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