package org.iothust.controller;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.iothust.dao.entity.DataEntity;
import org.iothust.exception.AddException;
import org.iothust.exception.DeleteException;
import org.iothust.exception.DuplicateKeyException;
import org.iothust.exception.UpdateException;
import org.iothust.service.DataService;
import org.iothust.tools.CryptoException;
import org.iothust.tools.DataRelTool;
import org.iothust.tools.JsonTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value="ih/data")
public class DataController {
	@Autowired
	private DataService dataService;
	@Value("${filePathPrefix}")
	private String filePathPrefix;

	@RequestMapping(value="", method = RequestMethod.GET)
	public String getAlldata(){
		List<DataEntity> data = dataService.getAll();
		long totalItems = data.size();
		Map<String, Object> result = new HashMap<>();
		result.put("list", data);
		result.put("total", totalItems);
		return JsonTool.objectToJson(result);
	}

	@RequestMapping(value="", method = RequestMethod.POST)
	public String addData(HttpServletRequest request){
		DataEntity de = new DataEntity();
		de.setName(request.getParameter("name"));
		de.setAbbr(request.getParameter("abbr"));
		de.setCode(request.getParameter("code"));
		de.setFill(Integer.valueOf(request.getParameter("fill")));
		de.setFrequency(Integer.valueOf(request.getParameter("frequency")));
		de.setInput_output(request.getParameter("input_output"));
		de.setType(request.getParameter("type"));
		de.setParent(null);
		if (request.getParameter("securityLevel")!=null){
			de.setSecurityLevel(Integer.valueOf(request.getParameter("securityLevel")));
		}else{
			de.setSecurityLevel(null);
		}
		if (request.getParameter("value")!=null){
			de.setValue(request.getParameter("value"));
		}
		else{
			de.setValue(null);
		}
		de.setRelId(Long.valueOf(request.getParameter("id")));
		//判断数据所属关系，确定数据库所需参数
		DataRelTool dr = new DataRelTool(request.getParameter("relatedType"));
		de.setRelTable(dr.getRelTable());
		de.setRelName(dr.getRelName());
		try {
			if (!dataService.add(de)){
				return "dataService error!";
			}
			
		} catch (AddException | DuplicateKeyException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "success";
	}
	
	//删除数据
	@RequestMapping(value="{data_id}", method = RequestMethod.DELETE)
	public boolean delLevelData(HttpServletRequest request,@PathVariable Long data_id) {
		DataEntity de = dataService.getDataById(data_id);
		DataRelTool dr = new DataRelTool(request.getParameter("relatedType"));
		de.setRelTable(dr.getRelTable());	
		String dataChildren=request.getParameter("children[]");
		List <Long> childrenList=new ArrayList<>();
		if(dataChildren==null||dataChildren.isEmpty()){
            try {
				dataService.delDataById(de);
				return true;
			} catch (DeleteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}			
		}else{
			String [] dataChild=dataChildren.split(",");
			for(int i=0;i<dataChild.length;i++)
				childrenList.add(Long.valueOf(dataChild[i]));
			
			try {
				dataService.delLevelData(de,childrenList);
				return true;
			} catch (DeleteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}			
		}	
	}

	// 文件上传相关代码
	@RequestMapping(value = "actions/upload", method = RequestMethod.PUT)
	@Transactional
	public String upload(@RequestParam("file") MultipartFile file,HttpServletRequest request) {
		if (file.isEmpty()) {
			return "文件为空";
		}
		String scheduleOrTaskId = null;
		String type = null;
		if (request.getParameter("scheduleId")!=null){
			scheduleOrTaskId=request.getParameter("scheduleId");
			type = "schedule";
		}else if (request.getParameter("taskId")!=null){
			scheduleOrTaskId=request.getParameter("taskId");
			type = "task";
		}
		String dataId = request.getParameter("dataId");
//		String filePathPrefix = request.getSession().getServletContext().getRealPath("/");
//		String filePathPrefix = "d:\\lib\\";
        try {
			if(dataService.upload(file, filePathPrefix,type, scheduleOrTaskId, dataId)){
			return "上传成功";
			}
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (CryptoException e){
        	e.printStackTrace();
		}

        return "上传失败";
	}
	
	@RequestMapping(value="{data_id}/action/truncate", method = RequestMethod.DELETE)
	@Transactional
	public boolean delValueById(@PathVariable String data_id){
//		String filePathPrefix = request.getSession().getServletContext().getRealPath("/"); 
		try {
			if (!dataService.delValueById(data_id,filePathPrefix)){
				return false;
			}
		} catch (DeleteException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		return true;
	}
	
	// 文件下载相关代码
	@RequestMapping(value = "actions/download", method = RequestMethod.GET)
	public String downloadFile(HttpServletRequest request,
			HttpServletResponse response,String fullName,String fileName){

		// 设置获取文件的路径
//		String filePathPrefix = request.getSession().getServletContext().getRealPath("/");
        try {
			dataService.downloadFile(filePathPrefix, response, fullName, fileName);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (CryptoException e){
        	//解密失败
        	e.printStackTrace();
		}

		return null;
	}
	
	//为计划数据添加值
	@RequestMapping(value="{dataId}/action/updateValue", method = RequestMethod.POST)
	public boolean updateDataValue(@PathVariable Long dataId,HttpServletRequest request){
		try {
			String inputValue = request.getParameter("inputValue");
			Integer securityLevel = Integer.valueOf(request.getParameter("securityLevel"));
			dataService.updateValueById(dataId, inputValue,securityLevel);
			return true;
		} catch (UpdateException e) {
			return false;
		}	
	}
	
	//上移下移数据
	@RequestMapping(value="actions/move", method = RequestMethod.POST)
	public int moveData(Long id,Long moveDataId){
		try {
			dataService.moveData(id, moveDataId);
			return 1;
		} catch (UpdateException e) {
			// TODO: handle exception
			return 0;
		}		
	}
	
	//升级数据
	@RequestMapping(value="actions/upgrade",  method = RequestMethod.POST)
	public int upgradeData(Long id){
		DataEntity de=dataService.getDataById(id);
		Long parent=de.getParent();
		DataEntity parentData=dataService.getDataById(parent);
		Long parentsId=parentData.getParent();
		de.setParent(parentsId);

		try {
			dataService.updateData(de);
			return 1;
		} catch (UpdateException e) {
			// TODO: handle exception
			return 0;
		}
		
	}
	
	//降级数据
	@RequestMapping(value="actions/downgrade", method = RequestMethod.POST)
	public int downgradeData(Long id,Long prevDataId){
		DataEntity de=dataService.getDataById(id);
		de.setParent(prevDataId);
		
		try {
			dataService.updateData(de);
			return 1;
		} catch (UpdateException e) {
			// TODO: handle exception
			return 0;
		}
		
	}
	
	@RequestMapping(value="addDataList", method = RequestMethod.POST)
	public String addDataList(HttpServletRequest request){
		Long relId=Long.valueOf(request.getParameter("id"));
		String relatedType=request.getParameter("relatedType");
		String[] dataId=request.getParameterValues("dataIdList[]");	
		List<Long> dataIdList=new ArrayList<>();
		for(int i=0;i<dataId.length;i++){
			dataIdList.add(Long.valueOf(dataId[i]));
		}
		 
		try {
			if(!dataService.addDataList(dataIdList, relId, relatedType))
				 return "dataService error";
		} catch (AddException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return "success";
	}
}
