package com.group5.byebug.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Locale;

@Service
public class TestcaseUploadService {
    public static final String TESTS_OBJECT_PATTERN = "problems/%d/tests.zip";
    public static final long MAX_TESTS_ZIP_SIZE_BYTES = 100L * 1024L * 1024L;

    private final MinioClient minioClient;

    @Value("${storage.bucket:${STORAGE_BUCKET:}}")
    private String bucket;

    public TestcaseUploadService(@Autowired(required = false) MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public String uploadTestsZip(Long problemId, MultipartFile file) {
        validate(file);
        if (minioClient == null || bucket == null || bucket.isBlank()) {
            throw new RuntimeException("Storage chưa được cấu hình");
        }

        String objectKey = objectKeyFor(problemId);

        try (InputStream input = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .contentType("application/zip")
                    .stream(input, file.getSize(), -1L)
                    .build());
            return objectKey;
        } catch (Exception ex) {
            throw new RuntimeException("Upload tests.zip thất bại", ex);
        }
    }

    public static String objectKeyFor(Long problemId) {
        return String.format(TESTS_OBJECT_PATTERN, problemId);
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("tests.zip không được để trống");
        }
        if (file.getSize() > MAX_TESTS_ZIP_SIZE_BYTES) {
            throw new RuntimeException("tests.zip tối đa 100MB");
        }

        String filename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ROOT);
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        boolean hasZipName = "tests.zip".equals(filename);
        boolean hasZipContentType = contentType.equals("application/zip")
                || contentType.equals("application/x-zip-compressed")
                || contentType.equals("multipart/x-zip");

        if (!hasZipName && !hasZipContentType) {
            throw new RuntimeException("Chỉ chấp nhận file tests.zip");
        }
    }
}
