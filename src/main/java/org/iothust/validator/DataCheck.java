package org.iothust.validator;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Component  
@Aspect
public class DataCheck {
	
	//对DataController的校验,包括空值、时间先后、内容格式
	@Pointcut("execution(* org.iothust.controller.DataController.addData(..))")
	public void universalTaskCheck(){}
	
	@Around("universalTaskCheck()&& args(request)")
    public String universalTaskValidator(ProceedingJoinPoint jp, HttpServletRequest request){
		if(request.getParameter("name").isEmpty()){
			return "数据名称不能为空！";
		}
		if(request.getParameter("abbr").isEmpty()){
			return "简称不能为空！";
		}
		if(request.getParameter("code").isEmpty()){
			return "代码不能为空！";
		}
		if(request.getParameter("fill").isEmpty()){
			return "选填/必填不能为空！";
		}
		if(request.getParameter("frequency").isEmpty()){
			return "重复次数不能为空！";
		}
		//计划模板增加数据没有输入输出一列
//		if(request.getParameter("input_output").isEmpty()){
//			return "输入/输出为空！";
//		}
		if(request.getParameter("type").isEmpty()){
			return "类型不能为空！";
		}
		try {
			Object result=jp.proceed();
			if (!result.toString().equals("success")){
				return result.toString();
			}
		} catch (Throwable e) {
			return "DataController error!";
		}
		return "success";
    }
	
	
}
