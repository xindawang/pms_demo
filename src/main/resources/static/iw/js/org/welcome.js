function word(el){
	if ( el.text == "代办工作") {
		$("#forWord").show();
		$("#doWord").hide();
		return;
	}
	
	if ( el.text == "已办工作") {
		$("#forWord").hide();
		$("#doWord").show();
		return;
	}
	
	
}