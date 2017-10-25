package org.iothust.tools;

public class DataRelTool {
	
	private String relTable;
	private String relName;
	public DataRelTool(String string){
		switch (string){
		case "universalSchedule":
			relTable = "universal_schedule_data";
			relName = "schedule_id";
			break;
		case "universalTask":
			relTable = "universal_task_data";
			relName = "task_id";
			break;
		case "schedule":
			relTable = "schedule_data";
			relName = "schedule_id";
			break;
		case "task":
			relTable = "task_data";
			relName = "task_id";
			break;
		default:
			System.err.println("数据相关类型格式错误！");
		}
	}
	
	public String getRelTable(){
		return relTable;
	}
	
	public String getRelName(){
		return relName;
	}
}
