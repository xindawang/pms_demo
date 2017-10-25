package org.iothust.dao.entity;

public abstract class TierBaseEntity extends SortBaseEntity {
	private Long parent;

	public Long getParent() {
		return parent;
	}

	public void setParent(Long parent) {
		this.parent = parent;
	}
}
