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
import org.iothust.dao.mapper.ScheduleMapper;
import org.iothust.tools.TimeTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component  
@Aspect
public class ScheduleCheck {
	
	@Autowired
	private ScheduleMapper sm;
	
	//对ScheduleController的校验,包括空值、值是否已存在、时间先后、内容格式
	@Pointcut("execution(* org.iothust.controller.ScheduleController.add(..))"
			+ "||execution(* org.iothust.controller.ScheduleController.update(..))"
			+ "||execution(* org.iothust.controller.TaskController.resolveTask(..))")
	public void scheduleCheck(){} 
	
	@Around("scheduleCheck()&& args(request)")
    public String scheduleValidator(ProceedingJoinPoint jp, HttpServletRequest request){
		String columnName;				//检查是否为空的字段名
		String columnValue;				//检查是否为空的字段值
		ScheduleEntity thisSe = new ScheduleEntity();			//若是修改计划，此为该计划的实体
		boolean updateSchedule=false;	//检查是否为修改计划
		
		if(request.getParameter("id")!=null){
			thisSe = sm.getById(Long.valueOf(request.getParameter("id")));
			updateSchedule=true;
		}
		
		if(request.getParameter("code").isEmpty()){
			return "计划代号不能为空！";
		}
		
		if (updateSchedule){											//若是修改计划
			columnValue = request.getParameter("code");
			if (!columnValue.equals(thisSe.getCode())){					//若修改了计划代号，唯一性校验
				columnName = "code";
				if (sm.hasExisted(columnName,columnValue).size()!=0){
					return "计划代号已存在！";
				}
			}
		}else{															//若是新建计划
			columnName = "code";
			columnValue = request.getParameter("code");
			if (sm.hasExisted(columnName,columnValue).size()!=0){
				return "计划代号已存在！";
			}
		}		
		
		if(request.getParameter("name").isEmpty()){
			return "计划名称不能为空！";
		}

		if (updateSchedule){											//若是修改计划
			columnValue = request.getParameter("name");
			if (!columnValue.equals(thisSe.getName())){					//若修改了计划名称，唯一性校验
				columnName = "name";
				if (sm.hasExisted(columnName,columnValue).size()!=0){
					return "计划名称已存在！";
				}
			}
		}else{															//若是新建计划，计划名称唯一性校验
			columnName = "name";
			columnValue = request.getParameter("name");
			if (sm.hasExisted(columnName,columnValue).size()!=0){
				return "计划名称已存在！";
			}
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
		if(request.getParameter("securityLevel").equals("0")){
			return "请选择密级！";
		}
		if(request.getParameter("partner").isEmpty()){
			return "参与机构不能为空！";
		}
		if(request.getParameter("priority").isEmpty()){
			return "优先级不能为空！";
		}
		if(!StringUtils.isNumeric(request.getParameter("priority"))){
			return "优先级必须为数字！";
		}
		if(request.getParameter("responsible").isEmpty()){
			return "责任人为空！请重新登录！";
		}	
		try {
			Object result=jp.proceed();
			if (!result.toString().equals("success")){
				return result.toString();
			}
		} catch (Throwable e) {
			return "ScheduleController error!";
		}
		return "success";
    }

}
