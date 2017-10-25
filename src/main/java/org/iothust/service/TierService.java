package org.iothust.service;

import org.iothust.dao.entity.TierBaseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public abstract class TierService<E extends TierBaseEntity> extends SortService<E> {

	@Override
	public boolean changePlace(E e1, E e2) throws Exception {
		return super.changePlace(e1, e2);
	}

	public boolean upLv1(E e) throws Exception {
		repository.update(e);
		return false;
	}

	public boolean downLv1(E e, long parentId) {
		return false;
	}
}
