function callback(){
	$("#projLoginName").val($.cookie("loginName"));
}

//创建项目
function makeProj() {
	$.ajax({ 
    	type: "post", 
    	//@RequestMapping(value = "/makeProj/{map}/{sys}", produces = "text/plain")
    	// http://localhost:81/ils/supply/makeProj/map;id=0;projNo=BH001;code=DH001;name=项目名;country=沙特;consumer=空军;scretLvl=非密;feature=延续项目_续订;focusOn=精密公司;dealState=正在履约;state=搁置（指受国家政策、或目标国内政策等原因导致项目被搁置）;involvedModelId=2;descr=;/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
    	url : apphost() + "/ils/supply/makeProj/{map}/{sys}",
    	data:{
    		"map" :{
    			"id":"0",
    			"projNo":$("#projNo").val(),
    			"code":$("#code").val(),
    			"name":$("#name").val(),
    			"country":$("#country").val(),
    			"consumer":$("#consumer").val(),
    			"scretLvl":$("#scretLvl").val(),
    			"feature":$("#feature").val(),
    			"focusOn":$("#focusOn").val(),
    			"dealState":$("#dealState").val(),
    			"state":$("#state").val(),
    			"involvedModels":$("#involvedModels").val(),
    			"descr":$("#descr").val()
    		},
    		"sys": {
    			"token": $.cookie("token")
    		}
    	},
    	dataType : "json",
    	async: false,
    	martrix:true,
    	success: function (jsonData) {
    		if (!right(jsonData)) return;
    		console.log(jsonData);
    		tip("项目创建成功！");
    		backSecond();
    	}
	});
}