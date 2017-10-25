package org.iothust.listner;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class ApprovalCompleteListener implements TaskListener {
	private static final long serialVersionUID = 1L;
	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	@Override
	public void notify(DelegateTask delegateTask){
		//判断该计划是否是一个分解计划
		
		//如果是，触发中间捕获信号
		
	}
}
