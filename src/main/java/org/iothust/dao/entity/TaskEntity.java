package org.iothust.dao.entity;

import java.sql.Date;

import org.iothust.tools.StatusEnum;

public class TaskEntity extends TierBaseEntity {
	private Long id;
	private String name;
	private String state;
	private Integer securityLevel;
	private Integer priority;
	private Integer milestone;
	private ScheduleEntity schedule;// 任务所属的计划
	private Long scheduleId;
	private Long univScheduleId;	// 任务所属的计划模板
	private Date startTime;
	private Date endTime;
	private UserEntity responsible;
	private Long responsibleId;
	private String resources;
	private String universalTask;//任务所属任务模板
	private String universalTaskBase;//任务模板所属库
	private String form;
	private StatusEnum status;
	private Date acceptTime;
	private Date finishTime;
	private int duration;

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

	public ScheduleEntity getSchedule() {
		return schedule;
	}

	public void setSchedule(ScheduleEntity schedule) {
		this.schedule = schedule;
	}

	public Long getScheduleId() {
		return scheduleId;
	}

	public void setScheduleId(Long scheduleId) {
		this.scheduleId = scheduleId;
	}
	
	public Long getUnivScheduleId() {
		return univScheduleId;
	}

	public void setUnivScheduleId(Long univScheduleId) {
		this.univScheduleId = univScheduleId;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public UserEntity getResponsible() {
		return responsible;
	}

	public void setResponsible(UserEntity responsible) {
		this.responsible = responsible;
	}

	public Long getResponsibleId() {
		return responsibleId;
	}

	public void setResponsibleId(Long responsibleId) {
		this.responsibleId = responsibleId;
	}

	public String getResources() {
		return resources;
	}

	public void setResources(String resources) {
		this.resources = resources;
	}

	public String getForm() {
		return form;
	}

	public void setForm(String form) {
		this.form = form;
	}

	public StatusEnum getStatus() {
		return status;
	}

	public void setStatus(StatusEnum status) {
		this.status = status;
	}

	public String getUniversalTask() {
		return universalTask;
	}

	public void setUniversalTask(String universalTask) {
		this.universalTask = universalTask;
	}

	public String getUniversalTaskBase() {
		return universalTaskBase;
	}

	public void setUniversalTaskBase(String universalTaskBase) {
		this.universalTaskBase = universalTaskBase;
	}

	public Date getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Date finishTime) {
		this.finishTime = finishTime;
	}

	public Date getAcceptTime() {
		return acceptTime;
	}

	public void setAcceptTime(Date acceptTime) {
		this.acceptTime = acceptTime;
	}

	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}

	@Override
	public String toString() {
		return "TaskEntity [id=" + id + ", name=" + name + ", state=" + state + ", priority=" + priority+ ", securityLevel=" + securityLevel
				+ ", milestone=" + milestone + ", schedule=" + schedule + ", scheduleId=" + scheduleId + ", startTime="
				+ startTime + ", endTime=" + endTime + ", responsible=" + responsible + ", responsibleId="
				+ responsibleId + ", resources=" + resources + ", universalTask=" + universalTask
				+ ", universalTaskBase=" + universalTaskBase + ", form=" + form + ", status=" + status + ", acceptTime="
				+ acceptTime + ", finishTime=" + finishTime + "]";
	}

	public Integer getSecurityLevel() {
		return securityLevel;
	}

	public void setSecurityLevel(Integer securityLevel) {
		this.securityLevel = securityLevel;
	}
}
