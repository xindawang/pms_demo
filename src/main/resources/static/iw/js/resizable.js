/*  
function chooseCurrentTr(el){
	choCurTr(el, myRoomPriceHistAlls)
}

function clearResizable(){
	readyToMake(myRoomPriceHistAlls)
}
 */

function choCurTr(el, keyAndValues) {
	$(".activerTr").css("background-color", "white");
	$(".activerTr").removeClass("activerTr")
	$(el).addClass("activerTr")
	$("tr[name=" + $(el).attr("name") + "]").removeClass("background-color");
	$(el).css("background-color", "#eee2d7")
	id = $(el).find("input[name='id']").val();
	//processId = $(el).find("input[name='processId']").val();
	//nodeId = $(el).find("input[name='nodeId']").val();

	for(var i = 0; keyAndValue = keyAndValues[i]; i++) {
		if(keyAndValue.id == id) {
			for(var j = 0; inputTextId = $($.find("input[type='text']")[j]).attr("id"); j++) {
				$("#" + inputTextId).val(keyAndValue[inputTextId])
			}
			
			for(var j = 0; inputDateId = $($.find("input[type='date']")[j]).attr("id"); j++) {
				if(keyAndValue[inputDateId] != null)
				$("#" + inputDateId).val(keyAndValue[inputDateId].substring(0, 10))
			}
			
			for(var j = 0; inputHiddenId = $($.find("input[type='hidden']")[j]).attr("id"); j++) {
				$("#" + inputHiddenId).val(keyAndValue[inputHiddenId])
			}

			var firstRadioName;
			for(var j = 0; radioName = $($.find("input[type='radio']")[j]).attr("name"); j++) {
				if(firstRadioName == radioName) continue;
				firstRadioName = radioName;
				$("input:radio[name=" + radioName + "][checked='checked']").prop("checked", false);
				for(var x = 0; curRadioName = $("input:radio[name=" + radioName + "]")[x]; x++) {
					if($(curRadioName).val() == String(keyAndValue[radioName])) {
						curRadioName.checked = true;
						break;
					}
				}
			}

			var firstCheckBoxName;
			for(var j = 0; checkboxName = $($.find("input[type='checkbox']")[j]).attr("name"); j++) {
				if(firstCheckBoxName == checkboxName) continue;
				firstCheckBoxName = checkboxName;
				$("input:checkbox[name=" + checkboxName + "]").prop("checked", false);
				for(var x = 0; curCheckBoxName = $("input:checkbox[name=" + checkboxName + "]")[x]; x++) {
					var checkboxValues = String(keyAndValue[checkboxName]).split(",");
					for(var y = 0; checkboxValue = checkboxValues[y]; y++) {
						if($(curCheckBoxName).val() == checkboxValue) {
							curCheckBoxName.checked = true;
							break;
						}
					}
				}
			}

			for(var j = 0; selectId = $($("select")[j]).attr("id"); j++) {
				$("#" + selectId).val(keyAndValue[selectId])
			}

		}
	}
}

function readyToMake(keyAndValues) {
	for(var j = 0; inputTextId = $($.find("input[type='text']")[j]).attr("id"); j++) {
		$("#" + inputTextId).val("")
	}

	for(var j = 0; inputDateId = $($.find("input[type='date']")[j]).attr("id"); j++) {
		$("#" + inputDateId).val("");
	}
	
	var firstRadioName;
	for(var i = 0; radioName = $($.find("#resizable input[type='radio']")[i]).attr("name"); i++) {
		if(firstRadioName == radioName) continue;
		firstRadioName = radioName;
		$("#resizable input:radio[name=" + radioName + "][checked='checked']").attr("checked", false);
		$("#resizable input:radio[name=" + radioName + "]")[0].checked = true;
	}
	
	var firstCheckboxName;
	for(var i = 0; checkboxName = $($.find("#resizable input[type='checkbox']")[i]).attr("name"); i++) {
		if(firstCheckboxName == checkboxName) continue;
		firstCheckboxName = checkboxName;
		$("#resizable input:checkbox[name=" + checkboxName + "]").attr("checked", false);
	}
	
	id = 0;
}