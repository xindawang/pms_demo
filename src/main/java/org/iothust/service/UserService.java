package org.iothust.service;

import java.util.List;

import org.iothust.dao.entity.CorpEntity;
import org.iothust.dao.entity.UserEntity;
import org.iothust.dao.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
	@Autowired
	private UserMapper um;
	
	public List<CorpEntity> getAllCorps(){
		return um.getAllCorp();
	}
	
	public List<UserEntity> getUsersByCorpId(Long corpId){
		return um.getUsersByCorpId(corpId);
	}
	
	public List<UserEntity> getWorkMates(Long id){
		return um.getWorkmates(id);
	}
	
	public UserEntity getUserById(Long id){
		return um.getUserById(id);
	}

	public UserEntity getUserCorp(Long id) {
		return um.getUserCorp(id);
	}
	
	public List<UserEntity> searchUsers(String item){
		return um.searchUsers(item);
	}
	
	public List<UserEntity> getAllUsers(){
		return um.getAllUsers();
	}
}
