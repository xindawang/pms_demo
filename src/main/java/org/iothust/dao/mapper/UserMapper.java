package org.iothust.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.iothust.dao.entity.CorpEntity;
import org.iothust.dao.entity.UserEntity;

@Mapper
public interface UserMapper {
	@Select("select id,name,parentid as parentId from iot_corp")
	public List<CorpEntity> getAllCorp();
	
	@Select("select * from iot_cust where corpid=#{id}")
	public List<UserEntity> getUsersByCorpId(Long corpId);
	
	@Select("select * from iot_cust a where a.corpid=(select corpid from iot_cust b where b.id=#{id})")
	public List<UserEntity> getWorkmates(Long id);
	
	@Select("select * from iot_cust where id=#{id}")
	public UserEntity getUserById(Long id);

	public UserEntity getUserCorp(Long id);
	
	public List<UserEntity> searchUsers(String item);
	
	public List<UserEntity> getAllUsers();
}
