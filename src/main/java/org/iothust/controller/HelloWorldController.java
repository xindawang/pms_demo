package org.iothust.controller;

import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloWorldController {

	
	@RequestMapping(value="helloWorld")
	public String helloWord(HttpSession session){
	
		UUID uid = (UUID) session.getAttribute("uid");
		if (uid == null){
			uid = UUID.randomUUID();
		}else{
			System.out.println(uid);
		}
		session.setAttribute("uid", uid);
		return uid.toString();
	}
}
