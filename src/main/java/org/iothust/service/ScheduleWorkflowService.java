package org.iothust.service;

import org.iothust.dao.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.iothust.dao.mapper.ScheduleMapper;
import org.iothust.tools.StatusEnum;
import org.iothust.service.ScheduleService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.iothust.dao.entity.ScheduleEntity;
import org.iothust.dao.entity.TaskEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class ScheduleWorkflowService {
	private static Logger logger = LoggerFactory.getLogger(ScheduleWorkflowService.class);

	@Autowired
	private ScheduleRepository scheduleRepository;

	@Autowired
	private org.iothust.service.TaskService myTaskService;

	@Autowired
	private ScheduleService scheduleService;

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;

	@Autowired
	protected HistoryService historyService;

	@Autowired
	protected RepositoryService repositoryService;

	/**
	 * 启动流程
	 * 
	 * @param schedule
	 *            entity
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	public ProcessInstance startScheduleProcess(ScheduleEntity schedule) throws Exception{
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("initiatorId", schedule.getResponsibleId().toString());
		try{
			ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("approvingSchedule", variables);
			schedule.setProcessInstanceId(processInstance.getProcessInstanceId());
			float progress = 0;
			schedule.setProgress(progress);
			scheduleRepository.update(schedule);
			return processInstance;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			throw e;
		}
	}

	/**
	 * 查询流程中用户的代办任务对应的计划实体
	 * 
	 * @param userId
	 *            用户Id
	 * @return list
	 */
	@Transactional(readOnly = true)
	public List<ScheduleEntity> findTodoSchedules(String userId) {
		List<ScheduleEntity> schedules = new ArrayList<ScheduleEntity>();
		// 根据当前人的ID查询
		TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee(userId);
		List<Task> tasks = taskQuery.list();
		for (Task task : tasks) {
			String processInstanceId = task.getProcessInstanceId();
			ScheduleEntity schedule = scheduleRepository.getByProcessInstanceId(processInstanceId);
			schedules.add(schedule);
		}
		return schedules;
	}

	@Transactional
	public ScheduleEntity completeTask(ScheduleEntity schedule, Task task, Map<String, Object> variables,
			StatusEnum scheduleStatus, StatusEnum currentTaskStatus, StatusEnum subTaskStatus) {
		//审批意见必须设为任务的局部变量，将来才能被历史记录查询
		taskService.setVariablesLocal(task.getId(), variables);
		taskService.complete(task.getId(), variables);
		try {
			List<TaskEntity> myTasks = myTaskService.getTasksByScheduleId(schedule.getId());
			for (TaskEntity myTask : myTasks) {

				myTask.setStatus(subTaskStatus);
				myTaskService.update(myTask);
			}
			if(currentTaskStatus != null && schedule.getTaskId() != null){
				TaskEntity currentTask = myTaskService.getById(schedule.getTaskId());
				currentTask.setStatus(currentTaskStatus);
				myTaskService.update(currentTask);
			}
			schedule.setStatus(scheduleStatus);
			scheduleService.update(schedule);
			return schedule;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return null;
		}
	}
}
