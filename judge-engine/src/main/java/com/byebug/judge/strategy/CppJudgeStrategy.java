package com.byebug.judge.strategy;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.byebug.judge.model.CommandResult;
import com.byebug.judge.model.JudgeRequest;
import com.byebug.judge.model.JudgeResult;
import com.byebug.judge.service.DockerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class CppJudgeStrategy implements JudgeStrategy {

    private final DockerService dockerService;
    private static final String BASE_TEMP_PATH = "/tmp/byebug/sandbox/"; //Thu muc temp de chua cac file cham bai

    @Override
    public JudgeResult execute(JudgeRequest request) { //Cham bai
        JudgeResult result = new JudgeResult();
        result.setSubmissionId(request.getSubmissionId());

        // Tao workDir
        String submissionId = UUID.randomUUID().toString();
        Path workDir = Paths.get(BASE_TEMP_PATH + submissionId);
        String containerId = null;

        try {
            Files.createDirectories(workDir);
            
            //Chep code ra file trong thu muc temp
            Path sourcePath = workDir.resolve("solution.cpp");
            Files.writeString(sourcePath, request.getCode());
            
            // Chep file input vao thu muc temp
            Path inputPath = workDir.resolve("input.txt");
            Files.writeString(inputPath, request.getInput() != null ? request.getInput() : "");

            // Tao container co bind mount thu muc workDir
            containerId = dockerService.createContainer("cpp", workDir.toString(), request.getMemoryLimit());

            //Bien dich code
            CommandResult compileRes = dockerService.execCommand(containerId, 10L, "g++", "solution.cpp", "-o", "solution");
            
            if (!compileRes.isSuccess()) {
                result.setStatus("CE");
                result.setMessage(compileRes.getStderr());
                return result;
            }

            long startTime = System.currentTimeMillis();
            // Chay code, truyen vao file input
            CommandResult runRes = dockerService.execCommand(containerId, request.getTimeLimit(), "sh", "-c", "./solution < input.txt");
            // Tinh thoi gian chay
            long timeUsed = System.currentTimeMillis() - startTime;

            // Phan tich ket qua
            if (runRes.isTimeOut()) {
                result.setStatus("TLE");
            } else if (runRes.getExitCode() == 137) { 
                // Docker tra ve 137 do tien trinh bi giet vi thieu RAM
                result.setStatus("MLE");
                result.setMessage("Memory Limit Exceeded");
            } else if (runRes.getExitCode() != 0) {
                result.setStatus("RE");
                result.setMessage("Runtime Error (Exit code: " + runRes.getExitCode() + ")");
                result.setStderr(runRes.getStderr());
            } else {
                //So sanh dap an
                String userOutput = runRes.getStdout().trim();
                String expectedOutput = request.getExpectedOutput().trim();

                if (userOutput.equals(expectedOutput)) {
                    result.setStatus("AC");
                    result.setMessage("Accepted");
                } else {
                    result.setStatus("WA");
                    result.setMessage("Wrong Answer");
                }

                result.setStdout(runRes.getStdout()); // Tra ve output goc de user doi chieu
                result.setTimeUsed(timeUsed / 1000.0);
            }
        } catch (IOException e) {
            log.error("File system error for submission {}", request.getSubmissionId(), e);
            result.setStatus("SE"); // System Error
            result.setMessage("Internal system error: " + e.getMessage());
        } finally {
            //Don dep container va workDir
            if (containerId != null) {
                dockerService.stopAndRemoveContainer(containerId);
            }
            cleanupFiles(workDir);
        }

        return result;
    }

    private void cleanupFiles(Path path) {
        try {
            //Xoa de quy thu muc temp
            Files.walk(path)
                 .sorted((p1, p2) -> p2.compareTo(p1))
                 .forEach(p -> {
                     try { Files.delete(p); } catch (IOException ignored) {}
                 });
        } catch (IOException e) {
            log.warn("Could not clean up work directory: {}", path);
        }
    }
}