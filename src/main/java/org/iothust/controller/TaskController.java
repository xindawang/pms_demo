package org.iothust.controller;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.iothust.asyncservice.ScheduleNotifyService;
import org.iothust.dao.entity.DataEntity;
import org.iothust.dao.entity.ScheduleEntity;
import org.iothust.dao.entity.TaskEntity;
import org.iothust.exception.AddException;
import org.iothust.exception.DeleteException;
import org.iothust.exception.UpdateException;
import org.iothust.service.DataService;
import org.iothust.service.ScheduleService;
import org.iothust.service.TaskService;
import org.iothust.tools.DataRelTool;
import org.iothust.tools.JsonTool;
import org.iothust.tools.StatusEnum;
import org.iothust.tools.TimeTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "ih/tasks")
public class TaskController {
	@Autowired
	private TaskService ts;
	@Autowired
	private ScheduleService ss;

	@Autowired
	private ScheduleNotifyService scheduleNotifyService;

	@Autowired
	private DataService dataService;

	@RequestMapping(value="{task_id}/data", method = RequestMethod.GET)
	public String getData(@PathVariable String task_id){
		DataEntity de = new DataEntity();	
		de.setRelId(Long.valueOf(task_id));		
		DataRelTool dr = new DataRelTool("task");
		de.setRelTable(dr.getRelTable());
		de.setRelName(dr.getRelName());
	
		List<DataEntity> list = dataService.getData(de);
		int total = list.size();
		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		result.put("total", total);		
		return JsonTool.objectToJson(result);
	}
	
	// 升级任务
	@RequestMapping(value = "{task_id}/actions/upgrade", method = RequestMethod.POST)
	public int upgradeTask(@PathVariable Long task_id) {
		TaskEntity te = ts.getTaskById(task_id);	
		if (te.getStatus() != StatusEnum.MAKE)
			return 0;
		try {
			ts.upgrade(task_id);
			return 1;
		} catch (UpdateException e) {
			return 0;
		}
	}
	
	// 降级计划任务
	@RequestMapping(value = "{task_id}/actions/downgrade", method = RequestMethod.POST)
	public int downgradeTask(@PathVariable Long task_id,Long prevTaskId) {
		TaskEntity te = ts.getTaskById(task_id);	
		if (te.getStatus() != StatusEnum.MAKE)
			return 0;
		try {
			ts.downgrade(task_id, prevTaskId);;
			return 1;
		} catch (UpdateException e) {
			return 0;
		}
	}

	//上移下移计划任务
	@RequestMapping(value = "{task_id}/actions/move", method = RequestMethod.POST)
	public int moveTask(@PathVariable Long task_id,Long moveTaskId) {
		TaskEntity te = ts.getById(task_id);	
		if (te.getStatus() != StatusEnum.MAKE)
			return 0;
		try {
			ts.moveTask(task_id,moveTaskId);
			return 1;
		} catch (UpdateException e) {
			return 0;
		}
	}
	
	@RequestMapping(value = "{task_id}", method = RequestMethod.GET)
	public String getById(@PathVariable Long task_id) {
		return JsonTool.objectToJson(ts.getById(task_id));
	}

	@RequestMapping(value = "", method = RequestMethod.POST)
	public String addTask(HttpServletRequest request) {
		TaskEntity te = new TaskEntity();
		try{
			te.setScheduleId(Long.valueOf(request.getParameter("schedule")));
			ScheduleEntity se = ss.getById(te.getScheduleId());
			if (se.getStatus() != StatusEnum.MAKE) {
				return "此计划状态不可编辑！";
			}
			te.setName(request.getParameter("name"));
			te.setState(request.getParameter("state"));
			te.setStartTime(TimeTool.stringToSqlDate(request.getParameter("startTime")));
			te.setEndTime(TimeTool.stringToSqlDate(request.getParameter("endTime")));
			te.setSecurityLevel(Integer.valueOf(request.getParameter("securityLevel")));
			te.setPriority(Integer.valueOf(request.getParameter("priority")));
			te.setResponsibleId(Long.valueOf(request.getParameter("responsible")));
			te.setMilestone(Integer.valueOf(request.getParameter("milestone")));
			te.setResources(request.getParameter("resources"));
			te.setForm(request.getParameter("form"));
			te.setParent(null);
			String univTaskName= request.getParameter("univTaskName");
			String univTaskBaseName= request.getParameter("univTaskBaseName");
			if (univTaskName!=null && univTaskBaseName!=null) {
				te.setUniversalTask(univTaskName);
				te.setUniversalTaskBase(univTaskBaseName);
			}
		}catch (ParseException e) {
			e.printStackTrace();
			return "time error";
		}		
		try {
			ts.add(te);
			return "success";
		} catch (AddException e) {
			return "error "+e.getMessage();
		} catch (Exception e) {
			e.printStackTrace();
			return "has error";
		}
	}

	
	@RequestMapping(value = "{task_id}", method = RequestMethod.POST)
	public String updateTask(HttpServletRequest request) {
		TaskEntity te = ts.getById(Long.valueOf(request.getParameter("id")));
		try{
			if (te.getStatus() != StatusEnum.MAKE)
				return "此计划状态不可编辑！";
			te.setName(request.getParameter("name"));
			te.setState(request.getParameter("state"));
			te.setStartTime(TimeTool.stringToSqlDate(request.getParameter("startTime")));
			te.setEndTime(TimeTool.stringToSqlDate(request.getParameter("endTime")));
			te.setPriority(Integer.valueOf(request.getParameter("priority")));
			te.setResponsibleId(Long.valueOf(request.getParameter("responsible")));
			te.setMilestone(Integer.valueOf(request.getParameter("milestone")));
			te.setResources(request.getParameter("resources"));
			te.setForm(request.getParameter("form"));
		}catch (ParseException e) {
			return "TaskService error";
		}
		try {
			ts.update(te);
			return "success";
		} catch (UpdateException e) {
			e.printStackTrace();
			return "TaskService error";
		}
	}
	
	//删除任务
	@RequestMapping(value = "{task_id}", method = RequestMethod.DELETE)
	public int delLevelTask(HttpServletRequest request,@PathVariable Long task_id){
		Long delTaskId=Long.valueOf(task_id);
		TaskEntity te = ts.getById(delTaskId);
		if (te.getStatus() != StatusEnum.MAKE)
			return 0;
		String[] taskChildren=request.getParameterValues("children[]");
		List <Long> childrenList=new ArrayList<>();
		if(taskChildren==null||taskChildren.length==0||taskChildren[0].isEmpty()){
			try {
				ts.delById(delTaskId);
				return 1;
			} catch (DeleteException e) {
				e.printStackTrace();
				return 0;
			}
		}else{

			for(int i=0;i<taskChildren.length;i++)
				childrenList.add(Long.valueOf(taskChildren[i]));
			try {
				ts.delLevelTask(te,childrenList);
				return 1;
			} catch (DeleteException | UpdateException e) {
				e.printStackTrace();
				return 0;
			}
		}
		
	}
	
	

	@RequestMapping(value = "{task_id}/actions/receive", method = RequestMethod.POST)
	public int acceptTask(@PathVariable Long task_id) {
		TaskEntity te = ts.getById(task_id);
		if (te.getStatus() != StatusEnum.ACCEPT)
			return 0;
		try {
			ts.acceptTask(task_id);
			return 1;
		} catch (UpdateException e) {
			e.printStackTrace();
			return 0;
		}
	}

	//提交任务
	@RequestMapping(value = "{task_id}/actions/complete", method = RequestMethod.POST)
	public int finishTask(@PathVariable Long task_id, String dataMap) {
		TaskEntity te = ts.getById(task_id);
		if (te.getStatus() != StatusEnum.EXECUTE)
			return 0;
		try {
			List<Map<String,String>> list = JsonTool.jsonToListMap(dataMap);
			System.out.println();
			if (list.size()!=0){
				dataService.updateTaskDataValue(list);
			}
			ts.finishTask(task_id);
			ScheduleEntity schedule = ss.getById(te.getScheduleId());
			//异步推送计划进度信息
			scheduleNotifyService.notifySchedule(schedule);
			return 1;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	@RequestMapping(value = "{task_id}/actions/abort", method = RequestMethod.POST)
	public int abortTask(@PathVariable Long task_id) {
		TaskEntity te = ts.getById(task_id);
		if (te.getStatus() != StatusEnum.EXECUTE)
			return 0;
		try {
			ts.abortTask(task_id);
			return 1;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	@RequestMapping(value = "{task_id}/actions/resolve", method = RequestMethod.POST)
	public String resolveTask(HttpServletRequest request) throws ParseException{
		ScheduleEntity se = new ScheduleEntity();
		try{
			se.setCode(request.getParameter("code"));
			se.setName(request.getParameter("name"));
			se.setState(request.getParameter("state"));
			se.setStartTime(TimeTool.stringToSqlDate(request.getParameter("startTime")));
			se.setEndTime(TimeTool.stringToSqlDate(request.getParameter("endTime")));
			se.setPriority(Integer.valueOf(request.getParameter("priority")));
			se.setResponsibleId(Long.parseLong(request.getParameter("responsible")));
			if(!request.getParameter("univScheduleId").equals("undefined")){
				se.setUniversalSchedule(Long.valueOf(request.getParameter("univScheduleId")));
			}
			se.setTaskId(Long.valueOf(request.getParameter("superTask")));
			se.setSecurityLevel(Integer.valueOf(request.getParameter("securityLevel")));
			se.setType(request.getParameter("type"));
			se.setPartner(request.getParameter("partner"));
			TaskEntity te = ts.getById(se.getTaskId());
			if (te.getStatus() != StatusEnum.EXECUTE)
				return "此任务状态不可编辑！";
			ts.resolveTask(se);
			return "success";
		} catch (Exception e) {
			e.printStackTrace();
			return "TaskController error";
		}
	}
}
