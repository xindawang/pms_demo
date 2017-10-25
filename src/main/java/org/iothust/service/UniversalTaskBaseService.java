package org.iothust.service;

import java.util.List;

import org.iothust.dao.entity.UniversalTaskBaseEntity;
import org.iothust.dao.entity.UniversalTaskEntity;
import org.iothust.dao.mapper.UniversalTaskBaseMapper;
import org.iothust.exception.DeleteException;
import org.iothust.tools.CheckTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public class UniversalTaskBaseService {
	@Autowired
	private UniversalTaskBaseMapper utbm;

	public List<UniversalTaskBaseEntity> getAll() {
		return utbm.getAll();
	}
	
	public List<UniversalTaskEntity> getTaskByBaseId(Long id) {
		return utbm.getTaskByBaseId(id);
	}

	@Transactional
	public int add(UniversalTaskBaseEntity utbe) {
		if (CheckTool.stringIsNull(utbe.getName()) || utbm.getByName(utbe.getName()) != null)
			return 0;
		return utbm.add(utbe);
	}
	
	@Transactional
	public Boolean transferById(Long uniTaskBaseId,Long toUniTaskBaseId) throws DeleteException {
		utbm.transferTaskBase(uniTaskBaseId,toUniTaskBaseId);
		utbm.delTaskBaseById(uniTaskBaseId);
		return true;
	}
	
	@Transactional
	public Boolean delById(Long id) throws DeleteException {
		
		List<Long> allTaskIdToBeDel = utbm.getTaskIdByTaskBaseId(id);
		for (Long taskId : allTaskIdToBeDel){
			List<Long> eachTaskDataIdToBeDel = utbm.getDataIdByTaskId(taskId);
			for (Long dataId : eachTaskDataIdToBeDel){
				//删除该任务库的所有任务的所有数据
				utbm.delDataById(dataId);
			}
			//删除该任务库的所有任务与数据关联
			utbm.delTaskDataRelById(taskId);
		}
		//删除该任务库的所有任务
		utbm.delTaskByTaskBaseId(id);
		//删除该任务库	
		utbm.delTaskBaseById(id);
		return true;
	}
}
