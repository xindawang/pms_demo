$(document).ready(function(){
	var showpdf = false;
	
	
	$(".btn-link-td").on("click", function() {		
		if($(this).find("span.glyphicon-chevron-up").length > 0){			
			$(this).find("span.glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
			$(this).parent().parent().parent().parent().find("tbody").hide();
						
		}
		else if($(this).find("span.glyphicon-chevron-down").length > 0){			
			$(this).find("span.glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");			
			$(this).parent().parent().parent().parent().find("tbody").show();		
		}
	});
	
	$("#viewplan").click(function(){
		showpdf = !showpdf;
		if(showpdf){
			$("#mediaContainer").height($(window).height()-250);
			$("#fileContainer").height($(window).height()-250);
			var url = '/ils/zone/downExpertYearPlan/' + new Date().getFullYear() + "/sys;token=" + $.cookie("token");
			$('#fileContainer').attr('src', url);
			$("#mediaContainer").show();
			$('#fileContainer').show();
			$('#majorgrp').hide();
		}else{
			$("#mediaContainer").hide();
			$('#fileContainer').hide();
			$('#majorgrp').show();
		}
	});
	
});

$.ajax({
	type: "post",
	// @RequestMapping(value = "/expertYearPlan/{year}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/org/expertYearPlan/2017/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
	url: apphost() + "/ils/zone/expertYearPlan/{year}/{sys}",
	data:{
		"year": new Date().getFullYear(),			
        "sys": {"token":$.cookie("token")}			
	},
	dataType: "json",
	async: false,
	martrix:true,
	success: function (data) {
		if (!right(data)) return;
		console.log(data);
		toView(data);
	}
});

function fileNameValueTo(el, value) {
	
	el.href = '/ils/zone/downExpertYearPlan/' + new Date().getFullYear() + "/" + grpName + "/sys;token=" + $.cookie("token");
	el.download = value;
}
$(document).ready(function(){
	$.getJSON("../js/zone/plan.js",function(data){				
		render_tree('expertgrp_content','row_template',data);
	});			
});
