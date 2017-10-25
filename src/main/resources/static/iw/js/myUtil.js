/*****************************************************************************************
 *小数点后最多两位小数 
 *****************************************************************************************/
	function amount(th){
	    var regStrs = [
	        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
	        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
	        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
	        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
	    ];
	    for(i=0; i<regStrs.length; i++){
	        var reg = new RegExp(regStrs[i][0]);
	        th.value = th.value.replace(reg, regStrs[i][1]);
	    }
	}
	
    function getFloatStr(num){  
        num += '';  
        num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符  
          
        if(/^0+/) //清除字符串开头的0  
            num = num.replace(/^0+/, '');  
        if(!/\./.test(num)) //为整数字符串在末尾添加.00  
            num += '.00';  
        if(/^\./.test(num)) //字符以.开头时,在开头添加0  
            num = '0' + num;  
        num += '00';        //在字符串末尾补零  
        num = num.match(/\d+\.\d{2}/)[0];  
        return num;
    };
    
/*****************************************************************************************
 *小数点后最多两位小数end 
 *****************************************************************************************/
  
 // js中做减法时，出现小数位增加bug
function accSub(arg1, arg2) { 
    var r1, r2, m, n; 
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 } 
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 } 
    m = Math.pow(10, Math.max(r1, r2)); 
    n = (r1 >= r2) ? r1 : r2; 
    return ((arg1 * m - arg2 * m) / m).toFixed(n); 
} 
    
    
/*****************************************************************************************
 *map构造器 begin 
 *****************************************************************************************/   
    function Map() {  
        this.elements = new Array();  
        //获取MAP元素个数  
        this.size = function() {  
            return this.elements.length;  
        };  
        //判断MAP是否为空  
        this.isEmpty = function() {  
            return (this.elements.length < 1);  
        };  
        //删除MAP所有元素  
        this.clear = function() {  
            this.elements = new Array();  
        };  
        //向MAP中增加元素（key, value)   
        this.put = function(_key, _value) {  
            this.elements.push( {  
                key : _key,  
                value : _value  
            });  
        };  
        //删除指定KEY的元素，成功返回True，失败返回False  
        this.remove = function(_key) {  
            var bln = false;  
            try {  
                for (i = 0; i < this.elements.length; i++) {  
                    if (this.elements[i].key == _key) {  
                        this.elements.splice(i, 1);  
                        return true;  
                    }  
                }  
            } catch (e) {  
                bln = false;  
            }  
            return bln;  
        };  
        //获取指定KEY的元素值VALUE，失败返回NULL  
        this.get = function(_key) {  
            try {  
                for (i = 0; i < this.elements.length; i++) {  
                    if (this.elements[i].key == _key) {  
                        return this.elements[i].value;  
                    }  
                }  
            } catch (e) {  
                return null;  
            }  
        };  
        //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL  
        this.element = function(_index) {  
            if (_index < 0 || _index >= this.elements.length) {  
                return null;  
            }  
            return this.elements[_index];  
        };  
        //判断MAP中是否含有指定KEY的元素  
        this.containsKey = function(_key) {  
            var bln = false;  
            try {  
                for (i = 0; i < this.elements.length; i++) {  
                    if (this.elements[i].key == _key) {  
                        bln = true;  
                    }  
                }  
            } catch (e) {  
                bln = false;  
            }  
            return bln;  
        };  
        //判断MAP中是否含有指定VALUE的元素  
        this.containsValue = function(_value) {  
            var bln = false;  
            try {  
                for (i = 0; i < this.elements.length; i++) {  
                    if (this.elements[i].value == _value) {  
                        bln = true;  
                    }  
                }  
            } catch (e) {  
                bln = false;  
            }  
            return bln;  
        };  
        //获取MAP中所有VALUE的数组（ARRAY）  
        this.values = function() {  
            var arr = new Array();  
            for (i = 0; i < this.elements.length; i++) {  
                arr.push(this.elements[i].value);  
            }  
            return arr;  
        };  
        //获取MAP中所有KEY的数组（ARRAY）  
        this.keys = function() {  
            var arr = new Array();  
            for (i = 0; i < this.elements.length; i++) {  
                arr.push(this.elements[i].key);  
            }  
            return arr;  
        };  
    }
/*****************************************************************************************
 *map构造器 end
 *****************************************************************************************/ 
    
//判断某元素是否在数组中
Array.prototype.contains = function(needle) {
	for(i in this) {
		if(this[i] == needle) return true
	}
	return false;
}
    
//两秒后本页刷新
function localSecond() {
	setTimeout(function() {
		location.reload();
	},2000)
}    

//两秒后返回上一页
function backSecond() {
	setTimeout(function() {
		window.history.go(-1);
	},2000)
}    

//两秒后刷新本页面
function reloadSecond() {
	setTimeout(function() {
		window.location.reload();
	},2000)
}

//获取系统当前时间 yyyy-MM-dd
function getNowFormateDate() {
	var date = new Date();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();

	if(month >= 1 && month <= 9) 
		month = "0" + month;
	
	if(strDate >= 1 && strDate <= 9) 
		strDate = "0" + strDate;
	
	var curDate = date.getFullYear() + "-" + month + "-" + strDate;
	
	return curDate;
}

//把时间变成日期，输入：2017-09-08 10:10:00，返回: "2017-09-08"
function toDate(curDate) {
	if(curDate == "" || curDate == null)
		return "";
	else 
		return curDate.substring(0,4) + "-" + curDate.substring(5,7) + "-" + curDate.substring(8,10);
}

//引用  1、ajaxfileupload.js 2.<input type="file" name="file" id="file">
//上传文件
/*function myAjaxFileUpload() {
	$.ajaxFileUpload({
		url : url,
		url : apphost() + "/ils/supply/makeMaterial/map;id=" + 0 + ";projId=" + param("id") + ";bizNo=" + param("no") + ";typ=问题资料;descr=" + $("#showDescr").val() + "/sys;token=" + $.cookie("token"),
		secureuri: false,
		fileElementId: 'file',
		dataType : "text",
		success : function(data, status) {
			data = JSON.parse(data.replaceAll("<pre.[^>]*>|</pre>",""))
			console.log(data)
		}
	});
}*/





