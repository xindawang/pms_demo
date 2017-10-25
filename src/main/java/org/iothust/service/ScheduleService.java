package org.iothust.service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.iothust.dao.entity.DataEntity;
import org.iothust.dao.entity.ScheduleEntity;
import org.iothust.dao.entity.TaskEntity;
import org.iothust.dao.mapper.DataMapper;
import org.iothust.dao.repository.ScheduleRepository;
import org.iothust.dao.repository.TaskRepository;
import org.iothust.exception.AddException;
import org.iothust.tools.StatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScheduleService extends SortService<ScheduleEntity> {
	@Autowired
	private ScheduleRepository sr;

	@Autowired
	private TaskRepository tr;

	@Autowired
	private ScheduleWorkflowService workflowService;

	@Autowired
	private DataMapper dm;

	public ScheduleEntity getByProcessInstanceId(String processInstanceId) {
		return sr.getByProcessInstanceId(processInstanceId);
	}

	public List<ScheduleEntity> getAll() {
		return sr.getAll();
	}

	@Override
	public ScheduleEntity add(ScheduleEntity t) throws Exception {
		// TODO 自动生成的方法存根
		t.setStatus(StatusEnum.MAKE);
		return super.add(t);
	}

	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	public ScheduleEntity addScheduleTransact(ScheduleEntity schedule) throws Exception{
		schedule.setStatus(StatusEnum.MAKE);
		sr.add(schedule);
		Long universalScheduleId = schedule.getUniversalSchedule();
		if(universalScheduleId != null) {
			sr.addRelTaskAndData(schedule.getId(), universalScheduleId, schedule.getResponsibleId(), schedule.getStartTime());
		}
		workflowService.startScheduleProcess(schedule);
		return schedule;
	}

	//根据搜索条件显示计划列表
	public List<ScheduleEntity> getSchedulesByCondition(String keyWord, String searchType, String scheduleStatus,
			Date searchStartTime, Date searchEndTime) {
		// TODO Auto-generated method stub
		return sr.getSchedulesByCondition(keyWord,searchType,scheduleStatus,searchStartTime,searchEndTime);
	}

	//获取计划的完整进度信息
	public Map<String, Object> getScheduleProgressInfo(Long scheduleId){

		Map<String, Object> result = new HashMap<>();
		List<Map> allTasksInfo = new ArrayList<>();
		ScheduleEntity schedule = sr.getById(scheduleId);
		List<TaskEntity> taskEntityList = tr.getTasksByScheduleId(scheduleId);
		for(TaskEntity task: taskEntityList){
			Map<String, Object> info = new HashMap<>();
			info.put("taskName", task.getName());
			info.put("isFinished", task.getStatus() == StatusEnum.COMPLETE);
			allTasksInfo.add(info);
		}
		result.put("scheduleId", schedule.getId());
		result.put("sourceId", schedule.getSourceId());
		result.put("category", schedule.getCategory());
		result.put("tasks", allTasksInfo);
		return result;
	}

	//根据条件搜索列表信息
	public List<ScheduleEntity> getSchedulesByFilters(Map<String, Object> params){
		return sr.getSchedulesByFilters(params);
	}
}
