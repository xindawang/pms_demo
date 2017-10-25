package org.iothust.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;
import org.iothust.dao.entity.DataEntity;

@Mapper
public interface DataMapper {
	@Select("select * from data order by id")
	public List<DataEntity> getAll();

	@Select("select * from data where name=#{name}")
	public DataEntity getByName(String name);
	
	@Select("select * from data where id=#{id}")
	public DataEntity getDataById(Long id);

	@Delete("delete from data where id=#{id}")
	public int delDataById(Long id);
	
	@Delete("delete from ${de.relTable} where data_id=#{de.id}")
	public int delDataRelById(@Param("de") DataEntity de);
	
	public List<DataEntity> getData(@Param("de") DataEntity de);
	

	@Insert("insert into data(id,name,abbr,code,fill,frequency,input_output,type,parent,sort,security_level,value)"
			+ "values(#{de.id},#{de.name},#{de.abbr},#{de.code},#{de.fill},#{de.frequency},#{de.input_output,jdbcType=VARCHAR},"
			+ "#{de.type},#{de.parent,jdbcType=VARCHAR},#{de.id},#{de.securityLevel,jdbcType=INTEGER},#{de.value,jdbcType=VARCHAR})")
	@SelectKey(statement = "select data_pk_seq.nextval from dual", keyProperty = "de.id", before = true, resultType = Long.class)
	public int addData(@Param("de") DataEntity de);
	
	@Select("select id from DATA where name=#{de.name}")
	public Long getDataIdByName(String name);
	
	@Insert("insert into ${de.relTable}(${de.relName},data_id) values(#{de.relId},#{de.id})")
	public int addRel(@Param("de") DataEntity de);
	
	@Update("update data set value=#{pathAndName} where id=#{dataId}")
	public int updateValueById(@Param("dataId") Long dataId, @Param("pathAndName")String pathAndName);

	@Update("update data set security_level=#{securityLevel},value=#{inputValue} where id=#{dataId}")
	public int updateValueAndSecurityLevelById(@Param("dataId") Long dataId, @Param("inputValue")String inputValue,@Param("securityLevel")Integer securityLevel);
	
	@Update("update data set value=null where id=#{0}")
	public int delValueById(String dataId);

	@Select("select value from data where id =#{0}")
	public String getValueById(String taskId);
	
	@Select("select data_id from universal_task_data where task_id =#{UTId}")
	public List<Long> getDataIdByUTId(Long UTId);
	
	@Insert("insert into task_data(task_id,data_id) values(#{taskId},#{dataId})")
	public int addTaskData(@Param("taskId") Long taskId, @Param("dataId") Long dataId);
	
	@Select("select data_id from universal_schedule_data where schedule_id =#{0}")
	public List<Long> getUniversalScheduleData(Long id);

	@Insert("insert into schedule_data(schedule_id,data_id) values(#{scheduleId},#{dataId})")
	public void addScheduleData(@Param("scheduleId") Long scheduleId, @Param("dataId") Long dataId);
	
	//�޸�sort,parent
	@Update("update data set sort=#{de.sort},parent=#{de.parent,jdbcType=VARCHAR} where id=#{de.id}")
	public int updateData(@Param("de") DataEntity de);

//	@Select("select data_id from universal_task_data where task_id=(select universal_task from task where id =#{0})")
//	public List<Long> getUniversalScheduleTaskData(Long tl);
	
	@Select("select data_id from task_data where task_id=#{0}")
	public List<Long> getTaskData(Long tl);

	@Select("select parent from data where id =#{0}")
	public Long getParentId(Long newDataId);

	@Update("update data set parent=#{newParentId,jdbcType=BIGINT} where id=#{newDataId,jdbcType=BIGINT}")
	public void updateParentId(@Param("newDataId")Long newDataId,@Param("newParentId")Long newParentId);
}
