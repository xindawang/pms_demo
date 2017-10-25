package org.iothust.tools;

import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusEnum {
	MAKE("编制中"), APPROVE("审批中"), ACTIVATE("未激活"), ACCEPT("未接受"), EXECUTE("进行中"), RESOLVE("分解中"), ABORT("已终止"), COMPLETE(
			"已完成");
	private String name;

	private StatusEnum(String name) {
		this.name = name;
	}
	
	@Override
	@JsonValue
	public String toString(){
		return this.name;
	}
	
}
