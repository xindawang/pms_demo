package org.iothust.validator;

import java.sql.Date;
import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.iothust.dao.entity.ScheduleEntity;
import org.iothust.dao.entity.TaskEntity;
import org.iothust.dao.mapper.TaskMapper;
import org.iothust.tools.TimeTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component  
@Aspect
public class TaskCheck {
	
	@Autowired
	private TaskMapper tm;
	//对TaskController的校验,包括空值、时间先后、内容格式
	@Pointcut("execution(* org.iothust.controller.TaskController.addTask(..))"
			+ "||execution(* org.iothust.controller.TaskController.updateTask(..))")
	public void taskCheck(){} 
	
	@Around("taskCheck()&& args(request)")
    public String taskValidator(ProceedingJoinPoint jp, HttpServletRequest request){
		if(request.getParameter("name").isEmpty()){
			return "任务名称不能为空！";
		}
		String scheduleId = request.getParameter("schedule");
		String taskName = request.getParameter("name");
		TaskEntity thisTe = new TaskEntity();
		boolean updateTask = false;
		if(request.getParameter("id")!=null){
			thisTe = tm.getById(Long.valueOf(request.getParameter("id")));
			updateTask=true;
		}
		if (updateTask){											//若是修改计划
			if (!taskName.equals(thisTe.getName())){					//若修改了计划代号，唯一性校验
				if (tm.taskHasExisted(scheduleId,taskName).size()!=0){
					return "计划代号已存在！";
				}
			}
		}else{															//若是新建计划
			if(tm.taskHasExisted(scheduleId,taskName).size()!=0){
			return "任务名称在此任务下已存在！";
		}
		}

		if(request.getParameter("securityLevel").equals("0")){
			return "请选择密级！";
		}
		if(request.getParameter("startTime").isEmpty()){
			return "开始时间不能为空！";
		}
		if(request.getParameter("endTime").isEmpty()){
			return "结束时间不能为空！";
		}
		Date startTime = null;
		try {
			startTime = TimeTool.stringToSqlDate(request.getParameter("startTime"));
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		Date endTime = null;
		try {
			endTime = TimeTool.stringToSqlDate(request.getParameter("endTime"));
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		if(startTime.after(endTime)){
			return "结束时间不能早于开始时间！";
		}
		if(request.getParameter("priority").isEmpty()){
			return "优先级不能为空！";
		}
		if(!StringUtils.isNumeric(request.getParameter("priority"))){
			return "优先级必须为数字！";
		}
		if(request.getParameter("responsible").equals("undefined")){
			return "责任人不能为空！";
		}	
		try {
			Object result=jp.proceed();
			if (!result.toString().equals("success")){
				return result.toString();
			}
		} catch (Throwable e) {
			return "TaskController error!";
		}
		return "success";
    }

}
