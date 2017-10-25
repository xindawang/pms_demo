package org.iothust.controller;

import java.sql.Date;
import java.text.ParseException;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.iothust.dao.entity.DataEntity;
import org.iothust.dao.entity.ScheduleEntity;
import org.iothust.dao.entity.TaskEntity;
import org.iothust.dao.entity.UserEntity;
import org.iothust.dao.repository.ScheduleRepository;
import org.iothust.exceptionhandle.ScheduleNotFoundException;
import org.iothust.exceptionhandle.ScheduleStatusOperationException;
import org.iothust.exceptionhandle.UserUnlogginedException;
import org.iothust.service.DataService;
import org.iothust.service.ScheduleService;
import org.iothust.service.ScheduleWorkflowService;
import org.iothust.service.UserService;
import org.iothust.tools.DataRelTool;
import org.iothust.tools.JsonTool;
import org.iothust.tools.StatusEnum;
import org.iothust.tools.TimeTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

@RestController
@RequestMapping(value = "ih/schedules")
public class ScheduleController {
	@Autowired
	private ScheduleService ss;
	
	@Autowired
	private ScheduleRepository sr;

	@Autowired
	private ScheduleWorkflowService workflow;

	@Autowired
	private TaskService taskService;				//工作流中使用的TaskService

	@Autowired
	private org.iothust.service.TaskService ts;		//业务中使用的TaskService

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private HistoryService historyService;

	@Autowired
	private UserService userService;
	
	@Autowired
	private DataService dataService;

	@RequestMapping(value = "{schedule_id}", method = RequestMethod.GET)
	public String getById(@PathVariable Long schedule_id) {
		return JsonTool.objectToJson(ss.getById(schedule_id));
	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	public String getAll(int pageSize, int page) {
		PageHelper.startPage(page, pageSize);
		List<ScheduleEntity> list = ss.getAll();
		long total = ((Page<ScheduleEntity>) list).getTotal();
		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("total", total);
		return JsonTool.objectToJson(map);
	}

	//根据条件获取计划列表结果
	@RequestMapping(value = "getSchedulesByCondition")
	public String getSchedulesByCondition(HttpServletRequest request,int pageSize, int page) {
		Map<String, Object> map = new HashMap<>();
		try {
			String sst=request.getParameter("start");   //搜索的限定开始时间
			String set=request.getParameter("end");   //搜索的限定结束时间
			Date searchEndTime=null;	
			Date searchStartTime=null;
			String keyWord=request.getParameter("keyWord");
			String searchType=request.getParameter("searchType");
			if(sst==null||sst.equals("")){
				searchStartTime=null;		
			}else{
				searchStartTime=TimeTool.stringToSqlDate(sst);				
			}
			if(set==null||set.equals("")){
				searchEndTime=null;	
		
			}else{
				searchEndTime=TimeTool.stringToSqlDate(set);					
			}
			String scheduleStatus=request.getParameter("planStatus");
			if(keyWord.equals(""))keyWord=null;
			if(scheduleStatus!=null&&scheduleStatus.equals(""))scheduleStatus=null;
			PageHelper.startPage(page, pageSize);
			List<ScheduleEntity> list = ss.getSchedulesByCondition(keyWord,searchType,scheduleStatus,searchStartTime,searchEndTime);
			long total = ((Page<ScheduleEntity>) list).getTotal();
			map.put("list", list);
			map.put("total", total);
		}catch(Exception e){
		    e.printStackTrace();
		}
		return JsonTool.objectToJson(map);
	}


	@RequestMapping(value="search")
	public String getByFilters(HttpServletRequest request, HttpSession session){
		if (session.getAttribute("custId") == null) {
			throw new UserUnlogginedException();
		}
		Map<String, Object> params = new HashMap<>();
		List<String> names = Collections.list(request.getParameterNames());
		for(String name: names){
			params.put(name, request.getParameter(name));
		}
		params.put("userId", session.getAttribute("custId"));
		List<ScheduleEntity> list = ss.getSchedulesByFilters(params);
		long total = list.size();
		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		result.put("total", total);
		return JsonTool.objectToJson(result);

	}

	@RequestMapping(value = "", method = RequestMethod.POST)
	public String add(HttpServletRequest request) throws Exception {
		ScheduleEntity se = new ScheduleEntity();
		try {
			se.setCode(request.getParameter("code"));
			se.setName(request.getParameter("name"));
			se.setState(request.getParameter("state"));
			se.setStartTime(TimeTool.stringToSqlDate(request.getParameter("startTime")));
			se.setEndTime(TimeTool.stringToSqlDate(request.getParameter("endTime")));
			se.setSecurityLevel(Integer.valueOf(request.getParameter("securityLevel")));
			se.setPriority(Integer.valueOf(request.getParameter("priority")));
			se.setResponsibleId(Long.parseLong(request.getParameter("responsible")));
			se.setType(request.getParameter("type"));
			se.setPartner(request.getParameter("partner"));
			se.setCategory(request.getParameter("category"));
			if (request.getParameter("sourceId")==""){
				se.setSourceId(null);
			}else{
				se.setSourceId(Long.valueOf(request.getParameter("sourceId")));
			}
			if (!request.getParameter("univScheduleId").equals("undefined")){
				se.setUniversalSchedule(Long.valueOf(request.getParameter("univScheduleId")));
			}
			ss.addScheduleTransact(se);
			return "success";
		} catch (Exception exception) {
			exception.printStackTrace();
//			throw exception;
			return "service error!";
		}

	}

	@RequestMapping(value = "{schedule_id}", method = RequestMethod.POST)
	public String update(HttpServletRequest request) {
		ScheduleEntity se = ss.getById(Long.valueOf(request.getParameter("id")));
		try{
			if (se.getStatus() != StatusEnum.MAKE)
				return "此状态不可编辑！";
			se.setCode(request.getParameter("code"));
			se.setName(request.getParameter("name"));
			se.setState(request.getParameter("state"));
			se.setStartTime(TimeTool.stringToSqlDate(request.getParameter("startTime")));
			se.setEndTime(TimeTool.stringToSqlDate(request.getParameter("endTime")));
			se.setSecurityLevel(Integer.valueOf(request.getParameter("securityLevel")));
			se.setPriority(Integer.valueOf(request.getParameter("priority")));
			se.setResponsibleId(Long.valueOf(request.getParameter("responsible")));
			se.setType(request.getParameter("type"));
			se.setPartner(request.getParameter("partner"));
		}catch(ParseException e){
//			throw new
		}		
		try {
			ss.update(se);
			return "success";
		} catch (Exception e) {
			e.printStackTrace();
			return "scheduleService error!";
		}
	}

	@RequestMapping(value = "{schedule_id}", method = RequestMethod.DELETE)
	public int delById(@PathVariable Long schedule_id) {
		ScheduleEntity se = ss.getById(schedule_id);
		if (se.getStatus() != StatusEnum.MAKE)
			return 0;
		try {
			runtimeService.deleteProcessInstance(se.getProcessInstanceId(), "计划删除时对应流程实例终止");
		}catch (org.activiti.engine.ActivitiObjectNotFoundException e) {
			HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery()
					.processInstanceId(se.getProcessInstanceId()).singleResult();
			if (historicProcessInstance != null) {
				historyService.deleteHistoricProcessInstance(historicProcessInstance.getId());
			}
		}
		try {
			ss.delById(schedule_id);
			return 1;
		} catch (Exception e) {
			return 0;
		}
	}

	@RequestMapping(value = "{schedule_id}/tasks")
	public String getTasksByScheduleId(@PathVariable Long schedule_id) {
		List<TaskEntity> list = ts.getTasksByScheduleId(schedule_id);
		int total = list.size();
		Map<String, Object> map = new HashMap<>();
		map.put("total", total);
		map.put("list", list);
		return JsonTool.objectToJson(map);
	}


	@RequestMapping(value = "{schedule_id:\\d+}/progressInfo")
	public String getScheduleProgressInfo(@PathVariable Long schedule_id){
	    Map<String, Object> result = ss.getScheduleProgressInfo(schedule_id);
	    return JsonTool.objectToJson(result);
	}
	@RequestMapping(value="{schedule_id}/data", method = RequestMethod.GET)
	public String getData(@PathVariable String schedule_id){
		DataEntity de = new DataEntity();	
		de.setRelId(Long.valueOf(schedule_id));		
		DataRelTool dr = new DataRelTool("schedule");
		de.setRelTable(dr.getRelTable());
		de.setRelName(dr.getRelName());
	
		List<DataEntity> list = dataService.getData(de);
		int total = list.size();
		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		result.put("total", total);		
		return JsonTool.objectToJson(result);
	}
	
	@RequestMapping(value = "{scheduleId}/actions/for‐review", method = RequestMethod.POST)
	public ScheduleEntity reviewSchedule(HttpSession session, @PathVariable Long scheduleId,
			@RequestParam Long approverId, @RequestParam String extras) {
		if (session.getAttribute("custId") == null) {
			throw new UserUnlogginedException();
		}
		UserEntity cust = userService.getUserById((Long) session.getAttribute("custId"));
		UserEntity approver = userService.getUserById(approverId);
		if (approver == null) {
			throw new ScheduleNotFoundException(scheduleId);
		}
		ScheduleEntity schedule = ss.getById(scheduleId);
		if (schedule == null) {
			throw new ScheduleNotFoundException(scheduleId);
		}

		Task task = taskService.createTaskQuery()
				.taskAssignee(cust.getId().toString())
				.processInstanceId(schedule.getProcessInstanceId())
				.singleResult();
		if (task == null) {
			throw new ScheduleStatusOperationException(scheduleId, schedule.getStatus().toString());
		}
		Map<String, Object> variables = taskService.getVariables(task.getId());
		// 提交审批人、附加信息等流程变量
		variables.put("approverId", approverId);
		variables.put("approverName", approver.getName());
		variables.put("extras", extras);
		// 预设相关实体待到达的状态
		StatusEnum scheduleStatus = StatusEnum.APPROVE;
		StatusEnum currentTaskStatus = null;
		StatusEnum submitTaskStatus = StatusEnum.APPROVE;
		// 完成流程的用户任务，并更新相应实体的状态
		return workflow.completeTask(schedule, task, variables, scheduleStatus, currentTaskStatus, submitTaskStatus);
	}

	@RequestMapping(value = "{scheduleId}/actions/review", method = RequestMethod.POST)
	public ScheduleEntity approveSchedule(HttpSession session, @PathVariable Long scheduleId,
			@RequestParam Boolean approvalOpinion,
			@RequestParam String approvalInfo) {
		if (session.getAttribute("custId") == null) {
			throw new UserUnlogginedException();
		}
		UserEntity approver = userService.getUserById((Long) session.getAttribute("custId"));
		ScheduleEntity schedule = ss.getById(scheduleId);
		if (schedule == null) {
			throw new ScheduleNotFoundException(scheduleId);
		}

		Task task = taskService.createTaskQuery()
				.processInstanceId(schedule.getProcessInstanceId())
				.taskAssignee(approver.getId().toString())
				.taskName("审批")
				.singleResult();
		if (task == null) {
			throw new ScheduleStatusOperationException(scheduleId, schedule.getStatus().toString());
		}
		Map<String, Object> variables = taskService.getVariables(task.getId());
		variables.put("approvalOpinion", approvalOpinion);
		variables.put("approvalInfo", approvalInfo);
		StatusEnum scheduleStatus = null;
		StatusEnum subTaskStatus = null;
		StatusEnum currentStatus = null;
		if (approvalOpinion) {
			scheduleStatus = StatusEnum.EXECUTE;
			currentStatus = StatusEnum.EXECUTE;
			subTaskStatus = StatusEnum.ACCEPT; // 以后根据逻辑关系确定
			schedule.setApproveTime(new Date(System.currentTimeMillis()));
		} else {

			scheduleStatus = StatusEnum.MAKE;
			subTaskStatus = StatusEnum.MAKE;
		}
		return workflow.completeTask(schedule, task, variables, scheduleStatus, currentStatus, subTaskStatus);
	}

	@ExceptionHandler(ScheduleNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public Error ScheduleNotFound(ScheduleNotFoundException e) {
		Long scheduleId = e.getScheduleId();
		return new Error("Schedule + [" + scheduleId + "] + not found");
	}

	@ExceptionHandler(UserUnlogginedException.class)
	@ResponseStatus(HttpStatus.FORBIDDEN)
	public Error UserUnloggined(UserUnlogginedException e) {
		return new Error(e.getMessage());
	}

	@ExceptionHandler(ScheduleStatusOperationException.class)
	@ResponseStatus(HttpStatus.FORBIDDEN)
	public Error ScheduleForbiddenReview(ScheduleStatusOperationException e) {
		Long scheduleId = e.getScheduleId();
		String status = e.getStatus();
		return new Error("schedule id:" + scheduleId.toString() + " status:" + status
				+ " operation is invalid for this request");
	}

}
