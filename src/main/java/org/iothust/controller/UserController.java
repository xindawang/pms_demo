package org.iothust.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.github.pagehelper.Page;
import org.activiti.engine.HistoryService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.task.Task;
import org.iothust.dao.entity.ScheduleEntity;
import org.iothust.dao.entity.TaskEntity;
import org.iothust.dao.entity.UserEntity;
import org.iothust.exceptionhandle.UserUnlogginedException;
import org.iothust.service.ScheduleService;
import org.iothust.service.UserService;
import org.iothust.tools.JsonTool;
import org.iothust.tools.TimeTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@RestController
@RequestMapping(value = "ih/user")
public class UserController {
	@Autowired
	private UserService us;
	
	@Autowired
	private ScheduleService ss;
	
	@Autowired
	private HistoryService historyService;
	
	@Autowired
	private org.activiti.engine.TaskService taskService;				//工作流中使用的TaskService
	
	@Autowired
	private org.iothust.service.TaskService ts;		//业务中使用的TaskService

	@RequestMapping(value = "allCorps")
	public String getAllCorps() {
		return JsonTool.objectToJson(us.getAllCorps());
	}

	@RequestMapping(value = "workmates")
	public String getWorkmates(HttpSession session) {
		if (session.getAttribute("custId") == null) {
			throw new UserUnlogginedException();
		}
		return JsonTool.objectToJson(us.getWorkMates((Long) session.getAttribute("custId")));
	}

	@RequestMapping(value = "userCorp")
	public String getUserCorp(Long id, HttpSession session) {
		if (session.getAttribute("custId") == null) {
			throw new UserUnlogginedException();
		}
		return JsonTool.objectToJson(us.getUserCorp((Long) session.getAttribute("custId")));
	}

	@RequestMapping(value = "searchUsers")
	public String searchUsers(String condition) {
		return JsonTool.objectToJson(us.searchUsers(condition));
	}

	@RequestMapping(value = "allUsers")
	public String getAllUsers() {
		return JsonTool.objectToJson(us.getAllUsers());
	}
	
	@RequestMapping(value = "{user_id}/task/finished")
	public String getFinishedByUserId(HttpSession session, int page, int pageSize) {
		PageHelper.startPage(page, pageSize);
		List<TaskEntity> list = ts.getFinishedByUserId((Long) session.getAttribute("custId"));
//		int total = list.size();
		long total = ((Page<TaskEntity>)list).getTotal();
		Map<String, Object> map = new HashMap<>();
		map.put("total", total);
		map.put("list", list);
		return JsonTool.objectToJson(map);
	}

	@RequestMapping(value = "{user_id}/task/unfinished")
	public String getUnfinishedByUserId(HttpSession session, int page, int pageSize) {
		PageHelper.startPage(page, pageSize);
		List<TaskEntity> list = ts.getUnfinishedByUserId((Long) session.getAttribute("custId"));
//		int total = list.size();
        long total = ((Page<TaskEntity>)list).getTotal();
		Map<String, Object> map = new HashMap<>();
		map.put("total", total);
		map.put("list", list);
		return JsonTool.objectToJson(map);
	}
	
	@RequestMapping(value = "{user_id}/schedule/unchecked", method = RequestMethod.GET)
	public String getMyUncheckedSchedules(HttpSession session, int pageSize, int page) {
		if (session.getAttribute("custId") == null) {
			throw new UserUnlogginedException();
		}
		UserEntity cust = us.getUserById((Long) session.getAttribute("custId"));
		PageHelper.startPage(page, pageSize);
		List<Task> tasklist = taskService.createTaskQuery()
				.taskAssignee(cust.getId().toString())
				.taskName("审批")
				.active()
				.orderByTaskCreateTime()
				.desc()
				.list();
		PageInfo<Task> pageinfo = new PageInfo<Task>(tasklist);
		long total = pageinfo.getTotal();
		List<Map<String, Object>> list = new ArrayList<>();
		Map<String, Object> result = new HashMap<>();
		for (Task task : tasklist) {

			ScheduleEntity schedule = ss.getByProcessInstanceId(task.getProcessInstanceId());
			Map<String, Object> map = taskService.getVariables(task.getId());
			map.put("scheduleId", schedule.getId().toString());
			map.put("scheduleName", schedule.getName());
			map.put("submitTime", TimeTool.utilDateToString(task.getCreateTime()));
			list.add(map);
		}
		result.put("list", list);
		result.put("total", total);
		return JsonTool.objectToJson(result);
	}

	@RequestMapping(value = "{user_id}/schedule/checked", method = RequestMethod.GET)
	public String getMyCheckedSchedules(HttpSession session, int pageSize, int page) {
		if (session.getAttribute("custId") == null) {
			throw new UserUnlogginedException();
		}
		UserEntity cust = us.getUserById((Long) session.getAttribute("custId"));
		PageHelper.startPage(page, pageSize);
		List<HistoricTaskInstance> hisTaskList = historyService.createHistoricTaskInstanceQuery()
				.taskAssignee(cust.getId().toString())
				.taskName("审批")
				.finished()
				.orderByTaskCreateTime()
				.desc()
				.list();
		PageInfo<HistoricTaskInstance> pageinfo = new PageInfo<HistoricTaskInstance>(hisTaskList);
		long total = pageinfo.getTotal();
		List<Map<String, Object>> list = new ArrayList<>();
		Map<String, Object> result = new HashMap<>();
		for (HistoricTaskInstance hisTask : hisTaskList) {
			ScheduleEntity schedule = ss.getByProcessInstanceId(hisTask.getProcessInstanceId());
			List<HistoricVariableInstance> hisvariables = historyService.createHistoricVariableInstanceQuery()
					.taskId(hisTask.getId())
					.list();
			Map<String, Object> map = new HashMap<>();
			map.put("submitTime", TimeTool.utilDateToString(hisTask.getStartTime()));
			map.put("approvalTime", TimeTool.utilDateToString(hisTask.getEndTime()));
			for (HistoricVariableInstance hisVariable : hisvariables) {
				map.put(hisVariable.getVariableName(), hisVariable.getValue());
			}

			map.put("scheduleId", schedule.getId().toString());
			map.put("scheduleName", schedule.getName());
			map.put("scheduleStatus", schedule.getStatus().toString());
			list.add(map);
		}
		result.put("list", list);
		result.put("total", total);
		return JsonTool.objectToJson(result);

	}

	@ExceptionHandler(UserUnlogginedException.class)
	@ResponseStatus(HttpStatus.FORBIDDEN)
	public Error UserUnloggined(UserUnlogginedException e) {
		return new Error(e.getMessage());
	}
}
