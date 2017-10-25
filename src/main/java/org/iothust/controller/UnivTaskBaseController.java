package org.iothust.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.iothust.dao.entity.UniversalTaskBaseEntity;
import org.iothust.exception.DeleteException;
import org.iothust.service.UniversalTaskBaseService;
import org.iothust.tools.JsonTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

@RestController
@RequestMapping(value="ih/universaltask‐bases")
public class UnivTaskBaseController {

	@Autowired
	private UniversalTaskBaseService universalTaskBaseService;

	@RequestMapping(value="", method = RequestMethod.GET)
	public String getAllUniversalTaskBase(int pageSize, int page){
		PageHelper.startPage(page,pageSize);
		List<UniversalTaskBaseEntity> tasks = universalTaskBaseService.getAll();
		long totalItems = ((Page<UniversalTaskBaseEntity>) tasks).getTotal();
		Map<String, Object> result = new HashMap<>();
		result.put("list", tasks);
		result.put("total", totalItems);
		return JsonTool.objectToJson(result);
	}
	
	@RequestMapping(value="{base_id}/universaltasks", method = RequestMethod.GET)
	public String getTaskByBaseId(@PathVariable String base_id){
		return JsonTool.objectToJson(universalTaskBaseService.getTaskByBaseId(Long.valueOf(base_id)));
	}
	
	@RequestMapping(value="", method = RequestMethod.POST)
	public String addTaskBase(HttpServletRequest request){
		UniversalTaskBaseEntity utbe = new UniversalTaskBaseEntity();
		utbe.setName(request.getParameter("name"));
		utbe.setState(request.getParameter("state"));
		if (universalTaskBaseService.add(utbe)==0){
			return "universalTaskBaseService error";
		}
		return "success";
	}

	@RequestMapping(value="{base_id}", method = RequestMethod.DELETE)
	public Boolean delTaskBaseById(@PathVariable String base_id) throws NumberFormatException, DeleteException{
		return universalTaskBaseService.delById(Long.valueOf(base_id));
	}
	
	@RequestMapping(value="transferToTaskBase")
	public Boolean transferToTaskBase(String uniTaskBaseId,String toUniTaskBaseId) throws NumberFormatException, DeleteException{
		return universalTaskBaseService.transferById(Long.valueOf(uniTaskBaseId),Long.valueOf(toUniTaskBaseId));
	}
}
