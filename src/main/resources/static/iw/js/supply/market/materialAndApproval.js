var typ;
$("#myproj li").click(function() {
	var hrefVal = $($(this).find("a")).attr("href");

	if(hrefVal == "#basic") {
		
	}else if(hrefVal == "#material") {
		typ = "技术资料";
		materialPage();
	}else if(hrefVal == "#approval") {
		typ = "项目文件资料";
		materialPage();
	}else if(hrefVal == "#export") {
		
	}else if(hrefVal == "#inside") {
		
	}else if(hrefVal == "#qa") {
		
	}
})


//项目资料列表
function materialPage() {
	$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/materialPage/{condition}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/materialPage/condition;projId=1;bizNo=;typ=技术资料/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/materialPage/{condition}/{sys}",		        
			data:{
				"condition": {
					"projId": param("id"),
					"bizNo":  param("no"),				
					"typ": typ
				},
				"sys": {"token": $.cookie("token")}
					
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

//删除资料
function delMaterial(el) {
	var id = $($(el).find("input[name='id']")).val();
	$.ajax({
		type : "post",
		//@RequestMapping(value = "/delMaterial/{id}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/supply/delMaterial/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/supply/delMaterial/{id}/{sys}",		        
		data:{
			"id": id,
			"sys": {"token": $.cookie("token")}
		},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			tip("删除成功！")
			localSecond();
		}
	});
}

//下载资料
function downMaterial(el) {
	var curFileId = $($(el).find("input[name='id']")).val();
	//http://localhost:81/ils/supply/downMaterial/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	location.href = apphost() + "/ils/supply/downMaterial/" + curFileId + "/sys;token=" + $.cookie("token");
}
