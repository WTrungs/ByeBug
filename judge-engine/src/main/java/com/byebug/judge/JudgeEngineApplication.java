package com.byebug.judge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JudgeEngineApplication {
    
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(JudgeEngineApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE); 
        app.run(args);
    }
    
}