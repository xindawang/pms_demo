package org.iothust.service;

import java.util.List;

import org.iothust.dao.entity.UniversalTaskEntity;
import org.iothust.dao.mapper.UniversalTaskMapper;
import org.iothust.exception.AddException;
import org.iothust.exception.DuplicateKeyException;
import org.iothust.exception.UpdateException;
import org.iothust.tools.CheckTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public class UniversalTaskService {
	@Autowired
	private UniversalTaskMapper universalTaskMapper;

	public List<UniversalTaskEntity> getAll() {
		return universalTaskMapper.getAll();
	}

	@Transactional
	public boolean add(UniversalTaskEntity use) throws AddException {
//		if (CheckTool.stringIsNull(use.getName()) || universalTaskMapper.getByName(use.getName()) != null)
//			return 0;
		if (universalTaskMapper.add(use)==0){
				throw new AddException();
		}
		return true;
	}

	@Transactional
	public Boolean delById(Long id) {
		List<Long> eachTaskDataIdToBeDel = universalTaskMapper.getDataIdByTaskId(id);
		for (Long dataId : eachTaskDataIdToBeDel){
			//删除任务的所有数据
			universalTaskMapper.delDataById(dataId);
			//删除该任务模板与数据的关联
			universalTaskMapper.delTaskDataRelById(id);
		}
		//删除该任务模板
		 universalTaskMapper.delById(id);
		 return true;
	}
	
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public UniversalTaskEntity getById(long id) {
		return universalTaskMapper.getById(id);
	}

	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public UniversalTaskEntity getByName(String name) {
		return universalTaskMapper.getByName(name);
	}

	@Transactional
	public boolean update(UniversalTaskEntity ute) throws DuplicateKeyException, UpdateException {
		if (CheckTool.stringIsNull(ute.getName()) || ute.getId() == null)
			throw new UpdateException();
		if (universalTaskMapper.updateUniversalTask(ute) == 0)
			throw new UpdateException();
		return true;
	}
}
