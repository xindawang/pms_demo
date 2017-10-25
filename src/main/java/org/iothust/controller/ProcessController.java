package org.iothust.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.activiti.engine.HistoryService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.iothust.dao.entity.ScheduleEntity;
import org.iothust.exceptionhandle.ScheduleNotFoundException;
import org.iothust.exceptionhandle.UserUnlogginedException;
import org.iothust.service.ScheduleService;
import org.iothust.tools.JsonTool;
import org.iothust.tools.TimeTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@RestController
@RequestMapping(value = "ih/process")
public class ProcessController {
	
	@Autowired
	private HistoryService historyService;
	
	@Autowired
	private ScheduleService ss;
	
	@RequestMapping(value = "schedule/{scheduleId}")
	public String getScheduleProcess(HttpSession session, @PathVariable Long scheduleId, int pageSize, int page) {
		if (session.getAttribute("custId") == null) {
			throw new UserUnlogginedException();
		}
		// UserEntity cust = userService.getUserById((Long)
		// session.getAttribute("custId"));
		ScheduleEntity schedule = ss.getById(scheduleId);
		if (schedule == null) {
			throw new ScheduleNotFoundException(scheduleId);
		}
		// 查询流程历史纪录
		PageHelper.startPage(page, pageSize);
		List<HistoricTaskInstance> hisTaskList = historyService.createHistoricTaskInstanceQuery()
				.processInstanceId(schedule.getProcessInstanceId())
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
			List<HistoricVariableInstance> hisvariables = historyService.createHistoricVariableInstanceQuery()
					.taskId(hisTask.getId())
					.list();
			Map<String, Object> map = new HashMap<>();
			for (HistoricVariableInstance hisVariable : hisvariables) {
				map.put(hisVariable.getVariableName(), hisVariable.getValue());
			}
			map.put("submitTime", TimeTool.utilDateToString(hisTask.getStartTime()));
			map.put("approvalTime", TimeTool.utilDateToString(hisTask.getEndTime()));
			list.add(map);
		}
		result.put("list", list);
		result.put("total", total);
		return JsonTool.objectToJson(result);

	}
}
