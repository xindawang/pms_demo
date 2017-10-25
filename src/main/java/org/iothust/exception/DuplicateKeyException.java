package org.iothust.exception;

public class DuplicateKeyException extends Exception {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7970735570170428328L;

	public DuplicateKeyException() {
	}

	public DuplicateKeyException(String msg) {
		super(msg);
	}
}
