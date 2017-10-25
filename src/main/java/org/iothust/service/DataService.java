package org.iothust.service;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.iothust.dao.entity.DataEntity;
import org.iothust.dao.mapper.DataMapper;
import org.iothust.exception.AddException;
import org.iothust.exception.DeleteException;
import org.iothust.exception.DuplicateKeyException;
import org.iothust.exception.UpdateException;
import org.iothust.tools.CryptoException;
import org.iothust.tools.CryptoTool;
import org.iothust.tools.DataRelTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional(rollbackFor = Exception.class)
public class DataService {
	@Autowired
	private DataMapper dataMapper;

	public List<DataEntity> getAll() {
		return dataMapper.getAll();
	}

	public List<DataEntity> getData(DataEntity de) {
		return dataMapper.getData(de);
	}

	public List<Long> getUniversalScheduleData(Long id) {
		return dataMapper.getUniversalScheduleData(id);
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public boolean add(DataEntity de) throws AddException, DuplicateKeyException {
		de.setId(null);
		if (dataMapper.addData(de) == 0)
			throw new AddException();
		if (dataMapper.addRel(de) == 0)
			throw new AddException();
		return true;
	}

	@Transactional
	public boolean delDataById(DataEntity de) throws DeleteException {
		if (dataMapper.delDataById(de.getId()) == 0)
			throw new DeleteException();
		if (dataMapper.delDataRelById(de) == 0)
			throw new DeleteException();
		return true;
	}

	// public boolean delValueById(String dataId) {
	// if (dataMapper.delValueById(dataId)!=1){
	// return false;
	// }
	// return true;
	// }

	public String getValueById(String taskId) {
		return dataMapper.getValueById(taskId);
	}

	public DataEntity getDataById(Long id) {
		return dataMapper.getDataById(id);
	}

	// 上移下移数据
	public void moveData(Long id, Long moveDataId) throws UpdateException {
		DataEntity de = dataMapper.getDataById(id);
		Long deSort = de.getSort();
		DataEntity moveData = dataMapper.getDataById(moveDataId);
		Long moveDataSort = moveData.getSort();
		Long exchangeSort = deSort;

		de.setSort(moveDataSort);
		moveData.setSort(exchangeSort);

		dataMapper.updateData(de);
		dataMapper.updateData(moveData);

	}

	public void updateData(DataEntity de) throws UpdateException {
		// TODO Auto-generated method stub
		dataMapper.updateData(de);

	}

	@Transactional
	public void delLevelData(DataEntity de, List<Long> childrenList) throws DeleteException {
		// TODO Auto-generated method stub
		Long delParent = de.getParent();
		List<DataEntity> childrenEntityList = new ArrayList<>();
		for (Long l : childrenList) {
			childrenEntityList.add(dataMapper.getDataById(l));
		}
		if (dataMapper.delDataById(de.getId()) == 0)
			throw new DeleteException();
		if (dataMapper.delDataRelById(de) == 0)
			throw new DeleteException();
		for (DataEntity d : childrenEntityList) {
			d.setParent(delParent);
			dataMapper.updateData(d);
		}

	}

	// 文件上传
	@Transactional
	public boolean upload(MultipartFile file, String filePathPrefix, String type ,String scheduleOrTaskId, String dataId)
			throws IllegalStateException, IOException, CryptoException {

		// 获取文件名
		String fileName = file.getOriginalFilename();
		// 文件上传后的路径
		String taskDataValue = type + scheduleOrTaskId +File.separatorChar+ "dataId_" + dataId + File.separatorChar;
		String pathAndName = filePathPrefix +taskDataValue + fileName;
		String databaseUrl = taskDataValue + fileName;
		File dest = new File(pathAndName);
		System.out.println(dest.getAbsolutePath());
		// 检测是否存在目录
		if (!dest.getParentFile().exists()) {
			dest.getParentFile().mkdirs();
		}
		file.transferTo(dest);
		//原地加密存储
		CryptoTool.encrypt(dest, dest);
		if (dataMapper.updateValueById(Long.valueOf(dataId), databaseUrl) != 1) {
			return false;
		}
		return true;

	}

	// 文件删除
	@Transactional
	public boolean delValueById(String dataId, String filePathPrefix) throws DeleteException {
		String urlfile = getValueById(dataId);
		String filePath = filePathPrefix +urlfile;
//		String filePath = urlfile;
		if (filePath != null) {
			File file = new File(filePath);
			File dataDir;
			File taskDir;
			if (file.exists()) {
				dataDir = new File(file.getParent());
				taskDir = new File(dataDir.getParent());
				// 遍历数据文件夹下的文件，全部删除。（数据只能包含一个文件）
				File[] dataDirFiles = dataDir.listFiles();
				for (int i = 0; i < dataDirFiles.length; i++) {
					dataDirFiles[i].delete();
				}
				dataDir.delete();

				// 如果任务文件夹下没有文件，则删除任务文件夹
				File[] taskDirFiles = taskDir.listFiles();
				if (taskDirFiles.length == 0) {
					taskDir.delete();
				}
			}
		}
		if (dataMapper.delValueById(dataId) != 1) {
			return false;
		}
		return true;
	}

	// 文件下载
	public String downloadFile(String filePathPrefix, HttpServletResponse response, String fullName, String fileName)
			throws UnsupportedEncodingException, CryptoException {

		String filePath = filePathPrefix+fullName;
//		String filePath = fullName;
		// File file = new File(filePath);
		// File parentDir = new File(file.getParent());

		if (filePath != null) {

			// 当前是从filepath下获取文件(该目录可以在下面一行代码配置)然后下载到C:\\users\\downloads即本机的默认下载的目录
			File file = new File(filePath);
			System.out.println(file.getAbsolutePath());
			// 解决火狐，chrome,ie中文文件名乱码问题
			String name = new String(fileName.getBytes("GBK"), "ISO-8859-1");

			if (file.exists()) {
			    //解密文件
                File decrptedFile = new File("tmp" + fileName);
                CryptoTool.decrypt(file, decrptedFile);

				response.setContentType("application/force-download");// 设置强制下载不打开
				response.addHeader("Content-Disposition", "attachment;fileName=\"" + name + "\"");// 设置文件名

				byte[] buffer = new byte[1024];
				FileInputStream fis = null;
				BufferedInputStream bis = null;
				try {
					fis = new FileInputStream(decrptedFile);
					bis = new BufferedInputStream(fis);
					OutputStream os = response.getOutputStream();
					int i = bis.read(buffer);
					while (i != -1) {
						os.write(buffer, 0, i);
						i = bis.read(buffer);
					}
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					if (bis != null) {
						try {
							bis.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
					if (fis != null) {
						try {
							fis.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
					//删除解密文件
					decrptedFile.delete();
				}
			}
		}

		return null;
	}
	@Transactional
	public boolean updateTaskDataValue(List<Map<String,String>> list) throws UpdateException{
		for (Map<String,String> map:list){
			if(dataMapper.updateValueById(Long.valueOf(map.get("dataId")), map.get("dataVal"))==0)
				throw new UpdateException();
		}	
		return true;		
	}
	
	@Transactional
	public boolean addDataList(List<Long> dataIdList,Long relId,String relatedType) throws AddException{
		DataRelTool dr = new DataRelTool(relatedType);	
		HashMap<Long,Long> dataIdOldToNew = new HashMap<Long,Long>();			
		for(Long l:dataIdList){
			DataEntity de=dataMapper.getDataById(l);
			de.setRelId(relId);
			de.setRelName(dr.getRelName());
		    de.setRelTable(dr.getRelTable());
			if (dataMapper.addData(de) == 0)
				throw new AddException();
			if (dataMapper.addRel(de) == 0)
				throw new AddException();	
			dataIdOldToNew.put(l, de.getId());		
		}
		
		for(Long newDataId:dataIdOldToNew.values()){
			Long oldDataParentId = dataMapper.getParentId(newDataId);		//获取之前插入时未改变的父级id
			if (oldDataParentId!=null){
				Long newParentId = dataIdOldToNew.get(oldDataParentId);
				dataMapper.updateParentId(newDataId,newParentId);//修改为新的父级id
			}
		}		
		return true;
	}

	public boolean updateValueById(Long dataId, String inputValue ,Integer securityLevel) throws UpdateException {
		if (dataMapper.updateValueAndSecurityLevelById(dataId,inputValue,securityLevel)==0){	//修改数据值
			throw new UpdateException();	
		}
		return true;
	}
}
