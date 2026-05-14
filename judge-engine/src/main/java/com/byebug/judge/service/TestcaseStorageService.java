package com.byebug.judge.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.byebug.judge.model.TestFileSet;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestcaseStorageService {
    private static final Pattern TEST_FILE_PATTERN = Pattern.compile("^(\\d+)\\.(in|out)$");

    private final MinioClient minioClient;

    @Value("${judge.storage.bucket}")
    private String bucket;

    @Value("${judge.storage.tests-object-pattern}")
    private String testsObjectPattern;

    public List<TestFileSet> downloadAndExtractTests(Long problemId, Path targetDir) {
        String objectKey = String.format(testsObjectPattern, problemId);
        Path zipPath = targetDir.resolve("tests.zip");
        Path extractedDir = targetDir.resolve("tests");

        try {
            log.info("Downloading testcases from storage: problemId={}, bucket={}, objectKey={}, targetDir={}",
                    problemId, bucket, objectKey, targetDir);
            Files.createDirectories(targetDir);
            Files.createDirectories(extractedDir);
            downloadObject(objectKey, zipPath);
            log.info("Downloaded testcases zip: problemId={}, path={}, sizeBytes={}",
                    problemId, zipPath, Files.size(zipPath));
            unzip(zipPath, extractedDir);
            List<TestFileSet> tests = collectTestFiles(extractedDir);
            log.info("Loaded testcases from storage: problemId={}, testCount={}", problemId, tests.size());
            return tests;
        } catch (Exception e) {
            log.error("Failed to load testcases from storage: problemId={}, objectKey={}", problemId, objectKey, e);
            throw new IllegalStateException("Could not load tests from object storage: " + objectKey, e);
        }
    }

    private void downloadObject(String objectKey, Path target) throws Exception {
        try (InputStream input = minioClient.getObject(GetObjectArgs.builder()
                .bucket(bucket)
                .object(objectKey)
                .build())) {
            Files.copy(input, target, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        }
    }

    private void unzip(Path zipPath, Path targetDir) throws IOException {
        try (ZipInputStream zip = new ZipInputStream(Files.newInputStream(zipPath))) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                Path target = targetDir.resolve(entry.getName()).normalize();
                if (!target.startsWith(targetDir)) {
                    throw new IOException("Unsafe zip entry: " + entry.getName());
                }
                if (entry.isDirectory()) {
                    Files.createDirectories(target);
                } else {
                    Files.createDirectories(target.getParent());
                    Files.copy(zip, target, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                }
                zip.closeEntry();
            }
        }
    }

    private List<TestFileSet> collectTestFiles(Path extractedDir) throws IOException {
        Map<Integer, Path> inputs = new HashMap<>();
        Map<Integer, Path> outputs = new HashMap<>();

        try (var stream = Files.walk(extractedDir)) {
            stream.filter(Files::isRegularFile).forEach(path -> {
                String filename = path.getFileName().toString();
                Matcher matcher = TEST_FILE_PATTERN.matcher(filename);
                if (!matcher.matches()) {
                    return;
                }

                int order = Integer.parseInt(matcher.group(1));
                if ("in".equals(matcher.group(2))) {
                    inputs.put(order, path);
                } else {
                    outputs.put(order, path);
                }
            });
        }

        List<TestFileSet> tests = new ArrayList<>();
        for (Integer order : inputs.keySet()) {
            Path output = outputs.get(order);
            if (output != null) {
                tests.add(new TestFileSet(order, inputs.get(order), output));
            }
        }
        tests.sort(Comparator.comparingInt(TestFileSet::order));

        if (tests.isEmpty()) {
            throw new IOException("tests.zip does not contain any N.in/N.out pairs");
        }
        return tests;
    }
}
