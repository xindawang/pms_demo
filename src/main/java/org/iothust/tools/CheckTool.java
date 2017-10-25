package org.iothust.tools;

public class CheckTool {
	public static boolean stringIsNull(String string) {
		if (string == null || string.equals(""))
			return true;
		return false;
	}
}
