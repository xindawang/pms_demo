$(document).ready(function(){
	/* 对金额进行格式化 */
	function fMoney(s,n){
		if(n=='' || n== null || n== undefined){
			return '';
		}
		var r = "";
		n = (n>=0 && n <= 20)?n:2;
		s = parseFloat(( s + "").replace(/[^\d\.-]/g,"")).toFixed(n)+"";
		var l = s.split(".")[0].split("").reverse();
		var t = "";
		var length = l.length;
		for(i = 0; i<length; i++){
			t += l[i] + ((i+1)%3 == 0 && (i+1) != length ? "," :"");
		}
		if(n>0){
			r = s.split(".")[1];
			return "￥"+t.split("").reverse().join("") + "." + r;
		}else{
			return "￥"+t.split("").reverse().join("");
		}
	}
	$(".money").each(function(index,item){
		var text = $(item).text();
		text = fMoney(text,0);
		$(item).text(text);
	});
	
	//小数转百分比
	function fPercentage(num){
		return Math.round(num*10000/100.00)+"%";//小数点后二位百分比
		//return num*10000/100.00+"%";
	}
	$(".percentage").each(function(i,item){
		var text = $(item).text();
		text = fPercentage(text);
		$(item).text(text);
	});
	
	$(".form-date").datepicker({});
	
});