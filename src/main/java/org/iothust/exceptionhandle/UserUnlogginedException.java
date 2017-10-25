
package org.iothust.exceptionhandle;


public class UserUnlogginedException extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;
	public UserUnlogginedException(){
		this.message = "User doesn't loggin";
	}
	public String getMessage(){
		return this.message;
	}
}
