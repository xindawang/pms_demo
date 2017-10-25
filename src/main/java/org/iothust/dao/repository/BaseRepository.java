package org.iothust.dao.repository;

import org.iothust.dao.entity.BaseEntity;
import org.iothust.exception.AddException;
import org.iothust.exception.DeleteException;
import org.iothust.exception.UpdateException;

public interface BaseRepository<T extends BaseEntity> {
	T getById(long id);

	T update(T t) throws UpdateException;

	T add(T t) throws AddException;

	void delById(long id) throws DeleteException;
}
