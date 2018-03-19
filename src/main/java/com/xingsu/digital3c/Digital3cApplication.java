package com.xingsu.digital3c;

import com.github.pagehelper.PageHelper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import java.util.Properties;

@SpringBootApplication
@ComponentScan
public class Digital3cApplication extends SpringBootServletInitializer{

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(Digital3cApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(Digital3cApplication.class, args);
	}

	//配置mybatis的分页插件pageHelper
     @Bean
	 public PageHelper pageHelper(){
		PageHelper pageHelper = new PageHelper();
	 	Properties properties = new Properties();
	 	properties.setProperty("offsetAsPageNum","true");
	 	properties.setProperty("rowBoundsWithCount","true");
		properties.setProperty("reasonable","true");
	   	properties.setProperty("dialect","mysql");    //配置mysql数据库的方言
		pageHelper.setProperties(properties);
		return pageHelper;
	 }
}
