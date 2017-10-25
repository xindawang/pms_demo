package org.iothust.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.iothust.dao.entity.UniversalScheduleEntity;

@Mapper
public interface UniversalScheduleMapper {
	@Select("select * from universal_schedule order by id")
	public List<UniversalScheduleEntity> getAll();
	
	@Select("select name,state  from universal_schedule where id=#{id}")
	public UniversalScheduleEntity getScheduleById(Long id);

	@Select("select * from universal_schedule where name=#{name}")
	public UniversalScheduleEntity getByName(String name);

	@Insert("insert into universal_schedule(id,name,state) values(#{id},#{use.name},#{use.state})")
	@SelectKey(statement = "select universal_schedule_pk_seq.nextval from dual", keyProperty = "id", before = true, resultType = Long.class)
	public int add(@Param("use") UniversalScheduleEntity use);

	@Delete("delete from universal_schedule where id=#{id}")
	public int delById(Long id);
	
	@Select("select id from universal_schedule where name=#{name}")
	public List<Long> scheduleHasExisted(String name);			//检查名称是否已存在

	@Select("select task_id from universal_schedule_task where schedule_id=#{scheduleId} and task_name=#{taskName}")
	public List<Long> scheduleTaskHasExisted(@Param("scheduleId")Long scheduleId,@Param("taskName")String taskName);
}
