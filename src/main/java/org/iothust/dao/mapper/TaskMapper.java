package org.iothust.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.iothust.dao.entity.TaskEntity;

@Mapper
public interface TaskMapper {
	public List<TaskEntity> getByScheduleId(Long scheduleId);
	
	public List<TaskEntity> getByUnivScheduleId(Long univScheduleId);	

	public TaskEntity getById(Long id);
	
	public TaskEntity getUniScheduleTaskById(Long id);
	
	public TaskEntity getReUnique(@Param("te") TaskEntity te);

	public int addTask(@Param("te") TaskEntity te);

	public int addScheduleTask(@Param("te") TaskEntity te);

	public int addUniversalScheudleTask(@Param("te") TaskEntity te);
	
	public int updateTask(@Param("te") TaskEntity te);
	
	public int updateScheduleTask(@Param("te") TaskEntity te);
	
	public int updateUniversalScheduleTask(@Param("te") TaskEntity te);
	
	public int delTaskById(Long id);
	
	public int delScheduleTaskByTaskId(Long taskId);
	
	public int delUniScheduleTaskByTaskId(Long taskId);	
	
	public int delTaskDataByTaskId(Long taskId);
	
	public int delUSTTaskByTaskId(Long taskId);
	
	public List<TaskEntity> getUnfinishedByUserId(Long userId);

	public List<TaskEntity> getFinishedByUserId(Long userId);

	@Select("select task_id from universal_schedule_task where schedule_id =#{0}")
	public List<Long> getUniversalScheduleTask(Long id);

	@Update("update IOT_TASK set parent=#{te.parent,jdbcType=VARCHAR},sort=#{te.sort} where id=#{te.id}")
	public void updateLevelTask(@Param("te") TaskEntity te);
	
	@Select("select * from IOT_TASK where id=#{id}")
	public TaskEntity getTaskById(Long id);
	
	@Select("select task_id from schedule_task where schedule_id =#{scheduleId} and task_name=#{taskName}")
	public List<Long> taskHasExisted(@Param("scheduleId")String scheduleId,@Param("taskName")String taskName);

	@Select("select parent from IOT_TASK where id=#{newTaskId}")
	public Long getParentId(@Param("newTaskId")Long newTaskId);

	@Update("update IOT_TASK set parent=#{newParentId} where id=#{newTaskId}")
	public void updateParentId(@Param("newTaskId") Long newTaskId,@Param("newParentId") Long newParentId);
}
