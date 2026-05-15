package com.group5.byebug.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageConfig {
    @Bean
    @ConditionalOnExpression("'${storage.endpoint:}' != ''")
    public MinioClient minioClient(
            @Value("${storage.endpoint:${STORAGE_ENDPOINT:}}") String endpoint,
            @Value("${storage.access-key:${STORAGE_ACCESS_KEY:}}") String accessKey,
            @Value("${storage.secret-key:${STORAGE_SECRET_KEY:}}") String secretKey
    ) {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}
