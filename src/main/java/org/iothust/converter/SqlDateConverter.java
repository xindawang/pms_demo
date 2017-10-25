package org.iothust.converter;

import java.sql.Date;
import java.text.ParseException;

import org.iothust.tools.TimeTool;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class SqlDateConverter implements Converter<String, Date> {

	@Override
	public Date convert(String source) {
		// TODO 自动生成的方法存根
		try {
			return TimeTool.stringToSqlDate(source);
		} catch (ParseException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
			return null;
		}
	}
}
