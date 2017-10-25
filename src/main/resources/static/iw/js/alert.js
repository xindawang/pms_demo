/**
 * myalert("只有一个参数则为alert");
 * myalert("标题","2个入参则为confirm");
 */

if(document.getElementById) {
    window.myalert = function(title,txt) {
        createMyAlert(title,txt);
    }
}
// 如果有title，则是confirm，没有则是alert
function createMyAlert(title,txt) {
    // shortcut reference to the document object
    d = document;
    // if the modalContainer object already exists in the DOM, bail out.
    if(d.getElementById("my_alert")) return;
    // create the modalContainer div as a child of the BODY element
    var span = d.getElementsByTagName("body")[0].appendChild(d.createElement("span"));
    span.id = "my_alert";
    if (arguments.length == 1) {txt = title; title = "";}
    var inner_html = ""
    inner_html += '<div class="thickdiv" style="z-index:1"></div>'
    inner_html += '<div class="thickbox" style="z-index:9999999;left: 10%; top: 40%; width: 310px; height: 158px;">'
    inner_html += '<div class="thickwrap" style="width: 350px;">'
    inner_html += '<div class="thicktitle" style="width:330"><span>提示</span></div>'
    inner_html += '<div class="thickcon" id="" style="width: 290px; height: 106px; padding-left: 10px; padding-right: 10px;overflow-y:hidden"">'
    inner_html += '<div class="m flexbox"><div class="mc"><div class="tip-box icon-box"><span class="warn-icon m-icon"></span><div class="item-fore">'
    if (arguments.length == 1 || title == "") {// alert
        inner_html += '<div id="_detail" class="ftx-03">' + txt + '</div><div class="op-btns">'
        inner_html += '<a id="_cancel" href="javascript:;" class="btn-9" onclick="removeMyAlert();return true;">确定</a>'
    } else {// confirm
        inner_html += '<h3 id="_title" class="ftx04">' + title + '</h3><div id="_detail" class="ftx-03">' + txt + '</div><div class="op-btns">'
        inner_html += '<a id="_cancel" href="javascript:;" class="btn-9" onclick="removeMyAlert();return true;">确定</a>'
        inner_html += '<a id="_cancel" href="javascript:;" class="btn btn-12 ml10" onclick="removeMyAlert();return false;">取消</a></div></div></div></div></div></div>'
    }
    inner_html += '<a id="close" href="javascript:;" class="thickclose" onclick="removeMyAlert();return false;">×</a></div></div>'
    span.innerHTML = inner_html;
}
// removes the custom alert from the DOM
function removeMyAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("my_alert"));
}
