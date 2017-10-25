package org.iothust.dao.entity;

public abstract class SortBaseEntity extends BaseEntity {
	private Long sort;

	public Long getSort() {
		return sort;
	}

	public void setSort(Long sort) {
		this.sort = sort;
	}
}
