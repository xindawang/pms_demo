function ajaxFileUpload() {    
    var inputFile = $("#file1 > input:file")[0];

    $.ajaxFileUpload({
        url: 'upload.jsp',                 //用于文件上传的服务器端请求地址
        fileElementId: inputFile,               //文件上传域的ID
        //data: { a: 1, b: true },            //附加的额外参数
        dataType: 'text',                   //返回值类型 一般设置为json
        success: function (data, status)    //服务器成功响应处理函数
        {
            alert("上传成功: " + data);

        },
        error: function (data, status, e)   //服务器响应失败处理函数
        {
            alert(e);
        },
        complete: function () {
            var jq = $("#file1 > input:file");
            jq.before(inputFile);
            jq.remove();
        }
    });
}


function getForm() {
    var form = new mini.Form("#form1");
    var data = form.getData(true, false);
    var s = mini.encode(data);
    alert(s);
    //form.setIsValid(false);
}
function setForm() {
    var obj = {
        String: "abc",
        Date: "2020-11-12",
        Boolean: 'Y',
        TreeSelect: "ajax",
        countrys: "cn",
        //countrys2: "de",
        countrys3: "usa"
    };
    var form = new mini.Form("#form1");
    form.setData(obj, false);
}

function resetForm() {
    var form = new mini.Form("#form1");
    form.reset();
}
function clearForm() {
    var form = new mini.Form("#form1");
    form.clear();
}

function submitForm() {
    

    //提交表单数据
    var form = new mini.Form("#form1");            
    var data = form.getData();      //获取表单多个控件的数据
    var json = mini.encode(data);   //序列化成JSON
    $.ajax({
        url: "../data/FormService.php?method=SaveData",
        type: "post",
        data: { submitData: json },
        success: function (text) {
            alert("提交成功，返回结果:" + text);
        }
    });

}
function loadForm() {
    //加载表单数据
    var form = new mini.Form("#form1");            
    $.ajax({
        url: "../data/FormService.php?method=LoadData",
        type: "post",
        success: function (text) {
            var data = mini.decode(text);   //反序列化成对象
            form.setData(data);             //设置多个控件数据
        }
    });
}
$(function() {
	mini.parse();	
	
});