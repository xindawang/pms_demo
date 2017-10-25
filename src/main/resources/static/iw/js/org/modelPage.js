/*_commit();
function _commit() {
	$.ajax({
		type: "post",
		url: apphost() + "/ils/org/makeModel/{map}/{sys}",
		data: { 
			"map": {"no": param("no"), "partNo": $$("partNo").value,
				"itemNameCode": $$("itemNameCode").value,
				"cateCode": $$("cateCode").value, "tag": $$("tag").value, 
				"scretLvl": $$("scretLvl").value},
			"sys": {"token":$.cookie("token")}
		}, 
		async: false,
		martrix: true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			location.href = "/iw/org/modelPage.html";
		}
	}); 
}*/
//执行修改,选当前选中行的ID
function modelDetail(el) {
    var no = $(el).parent().parent().find("[name='no']").val();
    location.href = "/iw/org/modelDetail.html?no=" + no;
}
