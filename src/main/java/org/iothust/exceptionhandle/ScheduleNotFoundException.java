package org.iothust.exceptionhandle;

public class ScheduleNotFoundException extends RuntimeException {

	
	private static final long serialVersionUID = 1L;
	private Long scheduleId;
	public ScheduleNotFoundException(Long scheduleId){
		this.scheduleId = scheduleId;
	}
	public long getScheduleId(){
		return scheduleId;
	}
}

