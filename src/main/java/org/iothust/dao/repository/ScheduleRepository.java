package org.iothust.dao.repository;

import java.sql.Date;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.iothust.dao.entity.DataEntity;
import org.iothust.dao.entity.ScheduleEntity;
import org.iothust.dao.entity.TaskEntity;
import org.iothust.dao.mapper.DataMapper;
import org.iothust.dao.mapper.ScheduleMapper;
import org.iothust.dao.mapper.TaskMapper;
import org.iothust.exception.AddException;
import org.iothust.exception.DeleteException;
import org.iothust.exception.UpdateException;
import org.iothust.tools.TimeTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional(rollbackFor = Exception.class, propagation=Propagation.REQUIRED)
public class ScheduleRepository implements BaseRepository<ScheduleEntity> {
	@Autowired
	private ScheduleMapper sm;
	@Autowired
	private TaskRepository tr;
	@Autowired
	private DataMapper dm;
	@Autowired
	private TaskMapper tm;

	@Override
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public ScheduleEntity getById(long id) {
		// TODO 自动生成的方法存根
		return sm.getById(id);
	}
	
	@Override
	public ScheduleEntity update(ScheduleEntity se) throws UpdateException {
		if (sm.update(se) == 0)
			throw new UpdateException();
		return se;
	}

	@Override
	public ScheduleEntity add(ScheduleEntity se) throws AddException {
		// TODO 自动生成的方法存根
		se.setId(null);
		if (sm.add(se) == 0)
			throw new AddException();
		return se;
	}

	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	public boolean addRelTaskAndData(Long scheduleId,Long univScheduleId,Long responsibleId,Date startTime) throws Exception {
		List<Long> sdataIdList = dm.getUniversalScheduleData(univScheduleId);	//获取计划模板数据表
		for (Long sdl : sdataIdList){										
			DataEntity de = dm.getDataById(sdl);					//获取计划模板数据
			de.setId(null);
			de.setSort(null);
			if (de.getInput_output()==null){
				de.setInput_output("");
			}
			if (dm.addData(de) == 0)										//插入新数据
				throw new AddException();
			dm.addScheduleData(scheduleId,de.getId());						//在数据关系表中建立联系
		}
		
		HashMap<Long,Long> taskIdOldToNew = new HashMap<Long,Long>();			//用于处理层级关系
		List<Long> taskIdList = tm.getUniversalScheduleTask(univScheduleId);	//获取计划模板任务
		for (Long tl : taskIdList){											//复制计划模板任务
			TaskEntity te = tm.getUniScheduleTaskById(tl);		
			te.setId(null);
			te.setSort(null);
			te.setScheduleId(scheduleId);
			te.setResponsibleId(responsibleId);
			int duration=(int) ((te.getEndTime().getTime()-te.getStartTime().getTime())/(1000*3600*24));
			String startTimeStable = startTime.toString();
			te.setStartTime(TimeTool.stringToSqlDate(startTimeStable));			
			te.setEndTime(getEndTimeTool(startTime,duration));
			
			if (tm.addTask(te) == 0)
				throw new AddException();	
			if (tm.addScheduleTask(te) == 0)								//在计划关系表中建立联系
				throw new AddException();
			taskIdOldToNew.put(tl, te.getId());								//建立任务新旧id映射
			
//			计划模板的任务数据的获取与复制
			List<Long> tdataIdList = dm.getTaskData(tl);
			HashMap<Long,Long> dataIdOldToNew = new HashMap<Long,Long>();			//用于处理层级关系
			for (Long tdl : tdataIdList){										
				DataEntity de = dm.getDataById(tdl);		
				de.setId(null);
				if (dm.addData(de) == 0)
					throw new AddException();		
				if (dm.addTaskData(te.getId(),de.getId())==0)
					throw new AddException();
				dataIdOldToNew.put(tdl, de.getId());
			}
			//对任务数据的父节点id进行修改
			for(Long newDataId:dataIdOldToNew.values()){
				Long oldDataParentId = dm.getParentId(newDataId);		//获取之前插入时未改变的父级id
				if (oldDataParentId!=null){
					Long newParentId = dataIdOldToNew.get(oldDataParentId);
					dm.updateParentId(newDataId,newParentId);//修改为新的父级id
				}
			}
		}
		//对任务的父节点进行修改
		for(Long newTaskId:taskIdOldToNew.values()){
			Long oldTaskParentId = tm.getParentId(newTaskId);		//获取之前插入时未改变的父级id
			if (oldTaskParentId!=null){
				tm.updateParentId(newTaskId,taskIdOldToNew.get(oldTaskParentId));//修改为新的父级id
			}
		}
		return true;
	}

	//根据工期计算结束时间
	@SuppressWarnings("deprecation")
	private Date getEndTimeTool(Date startTime, int duration){
		int rest = duration;
		Date nextDay = startTime;
		nextDay.setDate(nextDay.getDate()+ 1);
		while (rest>1){
			if (isWorkday(nextDay)){
				rest--;
			}
			nextDay.setDate(nextDay.getDate()+ 1);
		}		
		return nextDay;
	}
	
	public boolean isWorkday(Date nextDay) {
		@SuppressWarnings("deprecation")
		int day = nextDay.getDay();
		if (day == 0 || day == 6) {
			return false;
		} else {
			return true;
		}
	}

	@Override
	public void delById(long id) throws DeleteException {
		// TODO 自动生成的方法存根
		List<TaskEntity> taskList = tr.getTasksByScheduleId(id);
		for (TaskEntity te : taskList) {
			tr.delById(te.getId());
		}
		if (sm.delScheduleById(id) == 0)
			throw new DeleteException();
	}

	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public ScheduleEntity getByProcessInstanceId(String processInstanceId) {
		return sm.getByProcessInstanceId(processInstanceId);
	}

	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public List<ScheduleEntity> getAll() {
		return sm.getAll();
	}

	//根据搜索条件显示查询结果
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public List<ScheduleEntity> getSchedulesByCondition(String keyword, String type, String status, Date start, Date end) {
		// TODO Auto-generated method stub
		return sm.getByConditions(keyword,type,status,start,end);
	}

	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public List<ScheduleEntity> getSchedulesByFilters(Map<String, Object> params){
		return sm.getByFilters(params);
	}

}
