allPendQuote();
//型号管理列表
function allPendQuote() {
  $.ajax({ 
  	type: "post", 
  	// @RequestMapping(value = "/allPendQuote/{condition}/{sys}", produces = "text/plain")
	// http://localhost:81/ils/supply/allPendQuote/condition;inquiryNum=/sys;token=+OnqzVby&slash86&backslash5H}OAvAG4Gj&semicolonQV^41
  	url : apphost() + "/ils/supply/allPendQuote/{condition}/{sys}",
  	data:{
			"condition": {
				"inquiryNum": ""
			},
			"sys": {
				"token": $.cookie("token")}
  	},
  	dataType : "json",
  	async: false,
  	martrix:true,
  	success: function (jsonData) {
  		if (!right(jsonData)) return;
  		console.log(jsonData);
  		var quoteData = {};
  		quoteData.status = "succ";
  		quoteData.result = {};
  		quoteData.result.allPendQuote = jsonData.result.allPendQuote;
	    for(var i = 0 ; myAllPendQuote = quoteData.result.allPendQuote[i] ; i++){
		   myAllPendQuote.RN = i + 1;
	    }
	    quoteData.result.dual = "";
	    toView(quoteData,true);
  	}
  });
}

//分页
function Paginate() {
	if ($$("page-nav")) {
		$("#page-nav").pagination({
			items: $$("total").value,
			itemsOnPage: $$("limit").value,
			cssStyle: "light-theme",
			onPageClick: function(pageIndex, event) {

				$$("offset").value = $$("limit").value * (pageIndex - 1);

				_commit();
			}
		});
	}
}

//去内部报价
function toInnerQuoteDetail(el){
	var id = $(el).parent().parent().find("input[name='id']").val();
	location.href = "/iw/supply/sales/innerQuoteDetail.html?id=" + id;
}