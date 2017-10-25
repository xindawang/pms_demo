package org.iothust.dao.entity;

public class UniversalTaskEntity {
	private Long id;
	private String name;
	private String state;
	private Integer duration;
	private Integer priority;
	private Integer milestone;
	private Long baseId;
	private String form;
	private UniversalTaskBaseEntity base;

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

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public Integer getPriority() {
		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	public Integer getMilestone() {
		return milestone;
	}

	public void setMilestone(Integer milestone) {
		this.milestone = milestone;
	}

	public Long getBaseId() {
		return baseId;
	}

	public void setBaseId(Long baseId) {
		this.baseId = baseId;
	}
	
	public UniversalTaskBaseEntity getBase() {
		return base;
	}

	public void setBase(UniversalTaskBaseEntity base) {
		this.base = base;
	}

	public String getForm() {
		return form;
	}

	public void setForm(String form) {
		this.form = form;
	}

	
	@Override
	public String toString() {
		return "UniversalTaskEntity [id=" + id + ", name=" + name + ", state=" + state + ", duration=" + duration
				+ ", priority=" + priority + ", milestone=" + milestone + ", base=" + base + "]";
	}	
}
