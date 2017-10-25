package org.iothust.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;
import org.iothust.dao.entity.UniversalTaskEntity;

@Mapper
public interface UniversalTaskMapper {
	@Select("select * from universal_task order by id")
	public List<UniversalTaskEntity> getAll();

	@Select("select * from universal_task where name=#{name}")
	public UniversalTaskEntity getByName(String name);

	@Insert("insert into universal_task(id,name,duration,priority,base,state,milestone,form) "
			+ "values(#{id},#{ute.name},#{ute.duration},#{ute.priority},#{ute.baseId},#{ute.state},#{ute.milestone},#{ute.form})")
	@SelectKey(statement = "select universal_task_pk_seq.nextval from dual", keyProperty = "id", before = true, resultType = Long.class)
	public int add(@Param("ute") UniversalTaskEntity ute);

	@Select("select data_id from universal_task_data where task_id=#{id}")
	public List<Long> getDataIdByTaskId(Long id);
	
	@Delete("delete from universal_task where name=#{name}")
	public Boolean delByName(String name);

	@Delete("delete from universal_task where id=#{id}")
	public Boolean delById(Long id);
	
	@Delete("delete from universal_task_data where task_id=#{id}")
	public int delTaskDataRelById(Long id);
	
	@Delete("delete from data where id=#{id}")
	public int delDataById(Long id);
	
	@Select("select id,name,duration,priority,base as baseId,state,milestone,form from universal_task where id=#{id}")
	public UniversalTaskEntity getById(Long id);
	
	@Update("update universal_task set name=#{ute.name},duration=#{ute.duration},priority=#{ute.priority},state=#{ute.state},milestone=#{ute.milestone},form=#{ute.form},base=#{ute.baseId}"
			+ " where id=#{ute.id}")
	public int updateUniversalTask(@Param("ute") UniversalTaskEntity ute);
}
