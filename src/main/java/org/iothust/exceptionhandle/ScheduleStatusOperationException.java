package org.iothust.exceptionhandle;


public class ScheduleStatusOperationException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Long scheduleId;
	private String status;
	public ScheduleStatusOperationException(Long scheduleId, String status){
		this.scheduleId = scheduleId;
		this.status = status;
	}
	public long getScheduleId(){
		return scheduleId;
	}
	public String getStatus(){
		return status;
	}
}
