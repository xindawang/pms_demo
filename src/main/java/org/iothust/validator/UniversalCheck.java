package org.iothust.validator;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.iothust.dao.mapper.UniversalScheduleMapper;
import org.iothust.dao.mapper.UniversalTaskBaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component  
@Aspect
public class UniversalCheck {
	
	@Autowired
	private UniversalScheduleMapper usm;
	
	@Autowired
	private UniversalTaskBaseMapper utbm;
	
	//对TaskController的校验,包括空值、时间先后、内容格式
	@Pointcut("execution(* org.iothust.controller.UnivTaskController.addTask(..))"
			+ "||execution(* org.iothust.controller.UnivTaskController.updateTask(..))")
	public void universalTaskCheck(){}
	
	
	
	@Around("universalTaskCheck()&& args(request)")
    public String universalTaskValidator(ProceedingJoinPoint jp, HttpServletRequest request){
		if(request.getParameter("name").isEmpty()){
			return "任务名称不能为空！";
		}
		if(request.getParameter("duration").isEmpty()){
			return "工期不能为空！";
		}
		if(request.getParameter("priority").isEmpty()){
			return "优先级不能为空！";
		}
		if(request.getParameter("baseId").isEmpty()){
			return "任务库不能为空！";
		}		
		try {
			Object result=jp.proceed();
			if (!result.toString().equals("success")){
				return result.toString();
			}
		} catch (Throwable e) {
			return "UniversalTaskController error!";
		}
		return "success";
    }
	
	@Pointcut("execution(* org.iothust.controller.UnivScheduleController.addSchedule(..))")
	public void universalScheduleCheck(){}
	
	@Around("universalScheduleCheck()&& args(request)")
    public String universalScheduleValidator(ProceedingJoinPoint jp, HttpServletRequest request){
		if(request.getParameter("name").isEmpty()){
			return "计划模板名称不能为空！";
		}
		if (usm.scheduleHasExisted(request.getParameter("name")).size()!=0){
			return "计划模板名称已存在！";
		}
		try {
			Object result=jp.proceed();
			if (!result.toString().equals("success")){
				return result.toString();
			}
		} catch (Throwable e) {
			e.printStackTrace();
			return "UniversalScheduleController error!";
		}
		return "success";
    }		
	
	@Pointcut("execution(* org.iothust.controller.UnivTaskBaseController.addTaskBase(..))")
	public void taskBaseCheck(){}
	
	@Around("taskBaseCheck()&& args(request)")
	public String taskBaseValidator(ProceedingJoinPoint jp, HttpServletRequest request){
		if(request.getParameter("name").isEmpty()){
			return "任务库名称不能为空！";
		}
		if (utbm.hasExisted(request.getParameter("name")).size()!=0){
			return "任务库名称已存在！";
		}
		try {
			Object result=jp.proceed();
			if (!result.toString().equals("success")){
				return result.toString();
			}
		} catch (Throwable e) {
			return "UniversalTaskBaseController error!";
		}
		return "success";
	}
	
	@Pointcut("execution(* org.iothust.controller.UnivScheduleController.addUniScheduleTask(..))")
	public void scheduleTaskCheck(){}
	
	@Around("scheduleTaskCheck()&& args(request)")
	public String addUniScheduleTaskValidator(ProceedingJoinPoint jp, HttpServletRequest request){		
		if (request.getParameter("univTaskId").equals("undefined") || request.getParameter("univTaskBaseId").equals("undefined")) {
			return "请选择通用任务模板！";
		}
		if(request.getParameter("name").isEmpty()){
			return "任务名称不能为空！";
		}
		if(usm.scheduleTaskHasExisted(Long.valueOf(request.getParameter("uniSchedule")),request.getParameter("name")).size()!=0){
			return "此通用计划下已存在此任务名称！";
		}
		if(request.getParameter("securityLevel").isEmpty()){
			return "密级不能为空！";
		}
		try {
			Object result=jp.proceed();
			if (!result.toString().equals("success")){
				return result.toString();
			}
		} catch (Throwable e) {
			return "UniversalScheduleController error!";
		}
		return "success";
	}
	
}
