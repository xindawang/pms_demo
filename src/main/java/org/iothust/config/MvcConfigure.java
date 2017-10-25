package org.iothust.config;

import org.iothust.converter.SqlDateConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class MvcConfigure extends WebMvcConfigurerAdapter {
	@Autowired
	SqlDateConverter sqlDateConverter;

	@Override
	public void addFormatters(FormatterRegistry registry) {
		// TODO 自动生成的方法存根
		super.addFormatters(registry);
		registry.addConverter(sqlDateConverter);
	}	
}
