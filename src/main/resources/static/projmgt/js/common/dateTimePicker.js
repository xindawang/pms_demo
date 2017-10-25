document.write('<link href="/projmgt/plugin/dateTime/bootstrap-datepicker.min.css" rel="stylesheet">')
document.write('<script type="text/javascript" src="/projmgt/plugin/dateTime/bootstrap-datepicker.min.js" charset="UTF-8"></script>')
document.write('<script type="text/javascript" src="/projmgt/plugin/dateTime/bootstrap-datepicker.zh-CN.min.js" charset="UTF-8"></script>')
document.write('<link href="/projmgt/plugin/dateTime/bootstrap-datetimepicker.min.css" rel="stylesheet">')
document.write('<script type="text/javascript" src="/projmgt/plugin/dateTime/bootstrap-datetimepicker.min.js" charset="UTF-8"></script>')
document.write('<script type="text/javascript" src="/projmgt/plugin/dateTime/bootstrap-datetimepicker.zh-CN.js" charset="UTF-8"></script>')
$(function(){
    $('.form_datetime').datetimepicker({
        weekStart: 1,
        todayBtn: 'linked',
		autoclose: true,
		todayHighlight: true,
		startView: 2,
        showMeridian: true,
        language:'zh-CN',
        minView: "month",
        format:'yyyy-mm-dd'
    });

    $('.input-daterange').datepicker({
        todayBtn: "linked",
        clearBtn: true,
        autoclose: true,
        language: "zh-CN",
        format:'yyyy-mm-dd'
    });
})