package org.iothust.asyncservice;

import java.util.Map;
import java.util.concurrent.Future;


import org.iothust.service.ScheduleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.iothust.dao.entity.ScheduleEntity;
import org.iothust.dao.repository.TaskRepository;

@Service
public class ScheduleNotifyService {
	
	private static final Logger logger = LoggerFactory.getLogger(ScheduleNotifyService.class);
	
	private final RestTemplate restTemplate;
	
	public ScheduleNotifyService(RestTemplateBuilder restTemplateBuilder){
		this.restTemplate = restTemplateBuilder.build();
	}
	
	@Autowired
	private TaskRepository tr;
	
	@Autowired
	private ScheduleService scheduleService;
	
	
	@Autowired
	private Environment env;
	
	@Async
	public Future<String> notifySchedule(ScheduleEntity schedule) throws InterruptedException{

		String category = schedule.getCategory();
		//获取计划对应类型的推送接口
		if(category != null && env.getProperty("notify-api." + category) != null){
            String url = env.getProperty("notify-api." + schedule.getCategory());
            //构造任务推送信息
            Map<String, Object> notification = scheduleService.getScheduleProgressInfo(schedule.getId());

            //构造推送body内容
            HttpEntity<Map> notificationRequest = new HttpEntity<Map>(notification);

            //url, http方法， 请求body, 响应类型设定，推送并不做多余处理（设为void或者string）
            String result = restTemplate.exchange(url, HttpMethod.PUT, notificationRequest, String.class).toString();
            return new AsyncResult<>("ok");
		}else{
			return new AsyncResult<>("nothing to do");
		}
		
	}
}
