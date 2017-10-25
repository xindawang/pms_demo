package org.iothust.dao.entity;

import java.sql.Date;

import org.iothust.tools.StatusEnum;

public class ScheduleEntity extends SortBaseEntity {
	private Long id;
	private String name;
	private String state;
	private String code;
	private Date startTime;
	private Date endTime;
	private Date createTime;
	private Integer securityLevel;
	private Integer priority;
	private UserEntity responsible;
	private String type;
	private TaskEntity task; // 分解计划所属的任务
	private Long taskId;
	private String partner;
	private Long responsibleId;// 设置责任人id方便插入修改
	private String resolved;
	private StatusEnum status;
	private String processInstanceId;
	private Float progress;// 完成进度
	private Date approveTime;// 实际开始时间；
	private Date finishTime;// 实际结束时间
	private Long universalSchedule;
	private String category;
	private Long sourceId;

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

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
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


	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	public Integer getPriority() {
		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	public UserEntity getResponsible() {
		return responsible;
	}

	public void setResponsible(UserEntity responsible) {
		this.responsible = responsible;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public TaskEntity getTask() {
		return task;
	}

	public void setTask(TaskEntity task) {
		this.task = task;
	}

	public String getPartner() {
		return partner;
	}

	public void setPartner(String partner) {
		this.partner = partner;
	}

	public Long getResponsibleId() {
		return responsibleId;
	}

	public void setResponsibleId(Long responsibleId) {
		this.responsibleId = responsibleId;
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public String getResolved() {
		return resolved;
	}

	public void setResolved(String resolved) {
		this.resolved = resolved;
	}

	public StatusEnum getStatus() {
		return status;
	}

	public void setStatus(StatusEnum status) {
		this.status = status;
	}

	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	public Float getProgress() {
		return progress;
	}

	public void setProgress(Float progress) {
		this.progress = progress;
	}

	public Date getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Date approveTime) {
		this.approveTime = approveTime;
	}

	public Date getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Date finishTime) {
		this.finishTime = finishTime;
	}
	
	public Long getUniversalSchedule() {
		return universalSchedule;
	}

	public void setUniversalSchedule(Long universalSchedule) {
		this.universalSchedule = universalSchedule;
	}

	@Override
	public String toString() {
		return "ScheduleEntity [id=" + id + ", name=" + name + ", state=" + state + ", code=" + code + ", startTime="
				+ startTime + ", endTime=" + endTime + ", securityLevel=" + securityLevel+ ", priority=" + priority + ", responsible=" + responsible
				+ ", type=" + type + ", task=" + task + ", taskId=" + taskId + ", partner=" + partner
				+ ", responsibleId=" + responsibleId + ", resolved=" + resolved + ", status=" + status
				+ ", processInstanceId=" + processInstanceId + ", progress=" + progress + ", approveTime=" + approveTime
				+ ", finishTime=" + finishTime + ", getSort()=" + getSort() + "]";
	}

	public Long getSourceId() {
		return sourceId;
	}

	public void setSourceId(Long sourceId) {
		this.sourceId = sourceId;
	}

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

	public Integer getSecurityLevel() {
		return securityLevel;
	}

	public void setSecurityLevel(Integer securityLevel) {
		this.securityLevel = securityLevel;
	}
}
