package org.iothust.service;

import org.iothust.dao.entity.BaseEntity;
import org.iothust.dao.repository.BaseRepository;
import org.iothust.exception.AddException;
import org.iothust.exception.DeleteException;
import org.iothust.exception.UpdateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public abstract class BaseService<T extends BaseEntity> {
	@Autowired
	protected BaseRepository<T> repository;

	public T getById(long id) {
		return repository.getById(id);
	}

	public T update(T t) throws UpdateException {
		return repository.update(t);
	}

	public T add(T t) throws Exception {
		return repository.add(t);
	}

	public void delById(long id) throws DeleteException {
		repository.delById(id);
	}
}
