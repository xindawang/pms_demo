package org.iothust.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.iothust.dao.entity.SecurityLevelEntity;

@Mapper
public interface SecurityLevelMapper {
	@Select("select * from secret_level")
	public List<SecurityLevelEntity> getSecurityLevel();
}
