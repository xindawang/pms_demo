package org.iothust.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;
import org.iothust.dao.entity.UniversalTaskBaseEntity;
import org.iothust.dao.entity.UniversalTaskEntity;

@Mapper
public interface UniversalTaskBaseMapper {

	@Select("select * from universal_task_base order by id")
	public List<UniversalTaskBaseEntity> getAll();

	@Select("select * from universal_task_base where name=#{name}")
	public UniversalTaskBaseEntity getByName(String name);
	
	@Select("select id from universal_task where base=#{id} order by id")
	public List<Long> getTaskIdByTaskBaseId(Long id);
	
	@Select("select data_id from universal_task_data where task_id=#{id}")
	public List<Long> getDataIdByTaskId(Long id);
	
	@Select("select * from universal_task where base=#{id}")
	public List<UniversalTaskEntity> getTaskByBaseId(Long id);

	@Insert("insert into universal_task_base(id,name,state) values(#{id},#{utbe.name},#{utbe.state})")
	@SelectKey(statement = "select universal_task_base_pk_seq.nextval from dual", keyProperty = "id", before = true, resultType = Long.class)
	public int add(@Param("utbe") UniversalTaskBaseEntity utbe);

	@Update("update universal_task set base=#{toUniTaskBaseId} where base=#{uniTaskBaseId}")
	public int transferTaskBase(@Param("uniTaskBaseId")Long uniTaskBaseId,@Param("toUniTaskBaseId")Long toUniTaskBaseId);
	
	@Delete("delete from universal_task_base where id=#{id}")
	public int delTaskBaseById(Long id);
	
	@Delete("delete from universal_task where base=#{id}")
	public int delTaskByTaskBaseId(Long id);
	
	@Delete("delete from data where id=#{id}")
	public int delDataById(Long id);
	
	@Delete("delete from universal_task_data where task_id=#{id}")
	public int delTaskDataRelById(Long id);

	@Select("select id from universal_task_base where name=#{name}")
	public List<Long> hasExisted(String name);			//检查名称是否已存在
}
