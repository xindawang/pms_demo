package org.iothust.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.iothust.dao.entity.DataEntity;
import org.iothust.dao.entity.UniversalTaskEntity;
import org.iothust.exception.AddException;
import org.iothust.exception.DuplicateKeyException;
import org.iothust.exception.UpdateException;
import org.iothust.service.DataService;
import org.iothust.service.UniversalTaskService;
import org.iothust.tools.DataRelTool;
import org.iothust.tools.JsonTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

@RestController
@RequestMapping(value="ih/universal‐tasks")
public class UnivTaskController {
	
	@Autowired
	private UniversalTaskService universalTaskService;

	@Autowired
	private DataService dataService;

	@RequestMapping(value="{task_id}/data", method = RequestMethod.GET)
	public String getData(@PathVariable String task_id){
		DataEntity de = new DataEntity();	
		de.setRelId(Long.valueOf(task_id));		
		DataRelTool dr = new DataRelTool("universalTask");
		de.setRelTable(dr.getRelTable());
		de.setRelName(dr.getRelName());
	
		List<DataEntity> list = dataService.getData(de);
		int total = list.size();
		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		result.put("total", total);		
		return JsonTool.objectToJson(result);
	}
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public String getAllUniversalTasks(int pageSize, int page){
		PageHelper.startPage(page,pageSize);
		List<UniversalTaskEntity> tasks = universalTaskService.getAll();
		long totalItems = ((Page<UniversalTaskEntity>) tasks).getTotal();
		Map<String, Object> result = new HashMap<>();
		result.put("list", tasks);
		result.put("total", totalItems);
		return JsonTool.objectToJson(result);
	}
	
	@RequestMapping(value = "", method = RequestMethod.POST)
	public String addTask(HttpServletRequest request){
		UniversalTaskEntity ute = new UniversalTaskEntity();
		ute.setName(request.getParameter("name"));		
		ute.setDuration(Integer.valueOf(request.getParameter("duration")));		
		ute.setPriority(Integer.valueOf(request.getParameter("priority")));
		ute.setBaseId(Long.valueOf(request.getParameter("baseId")));		
		ute.setState(request.getParameter("state"));
		ute.setMilestone(Integer.valueOf(request.getParameter("milestone")));
		ute.setForm(request.getParameter("form"));
		try{
			universalTaskService.add(ute);
		}catch(AddException e) {
			return "新增失败，任务名错误";
		}
		return "success";
	}
	
	@RequestMapping(value="{task_id}", method = RequestMethod.DELETE)
	public Boolean delTaskById(@PathVariable Long task_id){
		return universalTaskService.delById(task_id);
	}
	
	@RequestMapping(value = "{task_id}", method = RequestMethod.GET)
	public String getById(@PathVariable Long task_id) {
		return JsonTool.objectToJson(universalTaskService.getById(task_id));
	}
	
	@RequestMapping(value = "{task_id}", method = RequestMethod.POST)
	public String updateTask(HttpServletRequest request) {
		UniversalTaskEntity ute = universalTaskService.getById(Long.valueOf(request.getParameter("id")));
		ute.setName(request.getParameter("name"));		
		ute.setDuration(Integer.valueOf(request.getParameter("duration")));		
		ute.setPriority(Integer.valueOf(request.getParameter("priority")));
		ute.setBaseId(Long.valueOf(request.getParameter("baseId")));		
		ute.setState(request.getParameter("state"));
		ute.setMilestone(Integer.valueOf(request.getParameter("milestone")));
		ute.setForm(request.getParameter("form"));
		try {
			universalTaskService.update(ute);
		} catch (UpdateException | DuplicateKeyException e) {
			return "修改失败，任务名错误";
		}
		return "success";
	}
}
