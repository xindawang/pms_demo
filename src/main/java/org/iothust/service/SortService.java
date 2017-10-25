package org.iothust.service;

import org.iothust.dao.entity.SortBaseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public abstract class SortService<E extends SortBaseEntity> extends BaseService<E> {

	public boolean changePlace(E e1, E e2) throws Exception {
		repository.update(e1);
		repository.update(e2);
		return false;
	}
}
