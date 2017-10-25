/*
 * 列表渲染显示，判断ID是否存在
 */
Commit();
function Commit() {

	if (!param("id")) return;
	
	$.ajax({		
		type: "post",
		//@RequestMapping(value = "/custDetail/{id}/{sys}", produces = "text/plain")
		//http://localhost:81/ils/three/custDetail/1/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
		url: apphost() + "/ils/three/custDetail/{id}/{sys}",
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
			toView(jsonData);   
		}
			
		});
}
//修改密码
function modPass(){
	$.ajax({		
		type: "post",
		//@RequestMapping(value = "/resetPass/{idNo}/{sys}", produces = "text/plain")
		// http://localhost:81/ils/three/resetPass/230103197110206819/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41url: apphost() + "/ils/three/modPass/{map}/{sys}",
		data:{
			"idNo": {"idNo": $$("idNo").value},			
			"sys": {"token": $.cookie("token") }
		},
		async: false,
		martrix:true,
		dataType: "json",
		success: function (jsonData) {
			if (!right(jsonData)) return;
			console.log(jsonData);
			toView(jsonData);   
		}
			
		});
}

/*
 * 修改、新增用户，表单验证
 */
function makeCust() {
	
	if($$("idNo").value.length=null || $$("idNo").value.length!=18){
		$$("idNo").focus();
		tip("身份证号码不可为空,并且为18位有效身份证！");
		return;
	}
	if($$("name").value.length=null){
		$$("name").focus();
		tip("请输入姓名！");
		return;
	}
	if($$("name").value.length<2 && $$("name").value.length>5){
		$$("name").focus();
		tip("您的姓名不合法，请输入有效姓名！");
		return;
	}	
	if($$("phones").value.length==0 || $$("phones").value.length!=11){
		$$("phones").focus();
		tip("手机号码不可为空，并且为11位有效号码！");
		return;
	}	
$.ajax({
	    type : "post",
	    //@RequestMapping(value = "/makeCust/{map}/{sys}", produces = "text/plain")
	    //http://localhost:81/ils/three/makeCust/map;name=资小军;corpId="123";scretLvl="公开";email="123@qq.com";idType="身份证";idNo=230103197110206819;phones=13585948849;channel=self;terminal=ios/sys
		url: apphost() + "/ils/three/makeCust/{map}/{sys}",		        
			data:{
				"map": {
					"id": param("id"),
					"no": $$("no").value,				
					"idNo": $$("idNo").value,
					"name": $$("name").value, 
					"scretLvl": $$("scretLvl").value,
					"status": $$("status").value,
					"gender": $$("gender").value,  
					"email": $$("email").value,
					"phones": $$("phones").value},
					
				"sys": {"token": $.cookie("token")}
					
			},
		dataType: "json",
		async: false,
		martrix:true,
		success : function(jsonData) {
			
			if (!right(jsonData)) return;
			   console.log(jsonData);			
			location.href = "/iw/three/custPage.html";
			   
		}
	});
	

}