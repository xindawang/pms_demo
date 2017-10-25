package org.iothust;

import javax.servlet.MultipartConfigElement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.io.File;
import java.util.concurrent.Executor;
@Configuration
@EnableAsync(proxyTargetClass = true)
@EnableTransactionManagement
@SpringBootApplication
public class DemoApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(DemoApplication.class);
    }

    public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
	
	/**  
     * 文件上传配置  
     * @return  
     */  
//    @Bean
//    public MultipartConfigElement multipartConfigElement() {
//        MultipartConfigFactory factory = new MultipartConfigFactory();
//        //文件最大
//        factory.setMaxFileSize("10240KB"); //KB,MB
//        /// 设置总上传数据总大小
//        factory.setMaxRequestSize("102400KB");
//
//        factory.setLocation(File.separatorChar+"root"+File.separatorChar+"Documents");
//        return factory.createMultipartConfig();
//    }
    
    @Bean
    public Executor asyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(2);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("ScheduleNotify-");
        executor.initialize();
        return executor;
    }

}
