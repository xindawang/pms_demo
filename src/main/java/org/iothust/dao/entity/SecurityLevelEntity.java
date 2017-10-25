package org.iothust.dao.entity;

public class SecurityLevelEntity {
	private Long id;
	private String name;
	private Integer code;

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "SecurityLevelEntity [id=" + id + ", name=" + name + "]";
	}
	
}
