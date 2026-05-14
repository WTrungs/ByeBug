package com.byebug.judge.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.minio.MinioClient;

@Configuration
public class StorageConfig {
    @Bean
    public MinioClient minioClient(
            @Value("${judge.storage.endpoint}") String endpoint,
            @Value("${judge.storage.access-key}") String accessKey,
            @Value("${judge.storage.secret-key}") String secretKey) {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}
