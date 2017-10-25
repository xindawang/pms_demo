package org.iothust.controller;

import org.iothust.dao.mapper.SecurityLevelMapper;
import org.iothust.tools.JsonTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "ih/security-level")
public class SecurityLevelController {

	@Autowired
	private SecurityLevelMapper slm;
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public String getSecurityLevel() {
		return JsonTool.objectToJson(slm.getSecurityLevel());
	}
}
