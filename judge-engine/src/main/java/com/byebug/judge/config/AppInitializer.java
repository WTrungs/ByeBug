package com.byebug.judge.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.byebug.judge.service.DockerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(1)
public class AppInitializer implements CommandLineRunner {

    private final DockerService dockerService;

    @Override
    public void run(String... args) throws Exception { //Build image cham bai cho tung ngon ngu
        log.info("Project is starting. Initializing Docker images...");

        try {
            dockerService.buildImage("cpp");
        } catch (Exception e) {
            log.error("Error during initial image build", e);
        }
    }
    
}