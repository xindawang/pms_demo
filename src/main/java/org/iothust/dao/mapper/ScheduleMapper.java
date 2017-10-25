package org.iothust.dao.mapper;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.iothust.dao.entity.ScheduleEntity;

@Mapper
public interface ScheduleMapper {

    public ScheduleEntity getById(Long id);

    public List<ScheduleEntity> getByConditions(@Param(value = "keyword") String keyword, @Param(value = "type") String type,
                                                @Param(value = "status") String status, @Param(value = "start") Date start,
                                                @Param(value = "end") Date end);

    public ScheduleEntity getByProcessInstanceId(String processInstanceId);

    public List<ScheduleEntity> getAll();

    public int add(@Param("se") ScheduleEntity se);

    public ScheduleEntity getByCode(String code);

    public ScheduleEntity getByName(String name);

    public int update(@Param("se") ScheduleEntity se);

    public ScheduleEntity getReUnique(@Param("se") ScheduleEntity se);

    public int delScheduleTaskBySId(Long scheduleId);

    public int delScheduleById(Long id);

    @Select("select id from schedule where ${columnName}='${columnValue}'")
    public List<Long> hasExisted(@Param("columnName") String colomnName, @Param("columnValue") String colomnValue);            //检查值是否已存在

    public List<ScheduleEntity> getByFilters(@Param("filters") Map<String, Object> filters);
}
