package com.byebug.judge.strategy;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermission;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.byebug.judge.entity.Problem;
import com.byebug.judge.entity.Submission;
import com.byebug.judge.model.CommandResult;
import com.byebug.judge.model.JudgeResult;
import com.byebug.judge.model.TestcaseExecution;
import com.byebug.judge.model.TestcaseJudgeResult;
import com.byebug.judge.service.DockerService;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CppJudgeStrategy implements JudgeStrategy {
    private final DockerService dockerService;
    private final long compileMemoryLimitKb;
    private final long compileTimeoutMs;

    public CppJudgeStrategy(
            DockerService dockerService,
            @Value("${judge.compile.cpp.memory-limit-kb:1048576}") long compileMemoryLimitKb,
            @Value("${judge.compile.cpp.timeout-ms:10000}") long compileTimeoutMs) {
        this.dockerService = dockerService;
        this.compileMemoryLimitKb = compileMemoryLimitKb;
        this.compileTimeoutMs = compileTimeoutMs;
    }

    @Override
    public JudgeResult execute(Submission submission, Problem problem, List<TestcaseExecution> testcases) {
        JudgeResult result = new JudgeResult();
        result.setSubmissionId(String.valueOf(submission.getSubmissionId()));

        Path workDir = testcases.get(0).files().inputPath().getParent().getParent();
        String compileContainerId = null;
        String runContainerId = null;

        try {
            Files.createDirectories(workDir);
            makeWorkDirWritable(workDir);
            Files.writeString(workDir.resolve("solution.cpp"), submission.getSourceCode());

            compileContainerId = dockerService.createContainer("cpp", workDir.toString(), compileMemoryLimitKb);
            CommandResult compileRes = dockerService.execCommand(
                    compileContainerId,
                    compileTimeoutMs,
                    "g++",
                    "-std=c++17",
                    "-O2",
                    "solution.cpp",
                    "-o",
                    "solution");

            if (!compileRes.isSuccess()) {
                result.setStatus("CE");
                result.setMessage(buildCompileErrorMessage(compileRes));
                result.setStderr(result.getMessage());
                result.setScore(0);
                return result;
            }

            dockerService.stopAndRemoveContainer(compileContainerId);
            compileContainerId = null;

            runContainerId = dockerService.createContainer(
                    "cpp",
                    workDir.toString(),
                    problem.getMemoryLimitKb().longValue());

            int accepted = 0;
            int totalTimeMs = 0;
            String finalStatus = "AC";

            for (TestcaseExecution testcase : testcases) {
                TestcaseJudgeResult caseResult = runTestcase(runContainerId, workDir, problem, testcase);
                result.getTestcaseResults().add(caseResult);
                totalTimeMs += caseResult.getTimeMs() == null ? 0 : caseResult.getTimeMs();

                if ("AC".equals(caseResult.getVerdict())) {
                    accepted++;
                } else if ("AC".equals(finalStatus)) {
                    finalStatus = caseResult.getVerdict();
                    result.setMessage(caseResult.getMessage());
                    result.setStderr(caseResult.getStderr());
                    break;
                }
            }

            result.setStatus(finalStatus);
            result.setScore(testcases.isEmpty() ? 0 : (accepted * 100) / testcases.size());
            result.setTimeUsedMs(totalTimeMs);
            result.setMemoryUsedKb(0);
        } catch (IOException e) {
            log.error("File system error for submission {}", submission.getSubmissionId(), e);
            result.setStatus("SE");
            result.setMessage("Internal system error: " + e.getMessage());
            result.setScore(0);
        } finally {
            if (compileContainerId != null) {
                dockerService.stopAndRemoveContainer(compileContainerId);
            }
            if (runContainerId != null) {
                dockerService.stopAndRemoveContainer(runContainerId);
            }
            cleanupFiles(workDir);
        }

        return result;
    }

    private TestcaseJudgeResult runTestcase(
            String containerId,
            Path workDir,
            Problem problem,
            TestcaseExecution testcase) throws IOException {
        Path relativeInput = workDir.relativize(testcase.files().inputPath());
        long startTime = System.currentTimeMillis();
        CommandResult runRes = dockerService.execCommand(
                containerId,
                Math.max(1L, problem.getTimeLimitMs().longValue()),
                "sh",
                "-c",
                "./solution < " + shellQuote(relativeInput.toString()));
        int timeMs = Math.toIntExact(Math.max(0L, System.currentTimeMillis() - startTime));

        String verdict;
        String message = null;
        if (runRes.isTimeOut()) {
            verdict = "TLE";
            message = "Time Limit Exceeded";
        } else if (runRes.getExitCode() == 137) {
            verdict = "MLE";
            message = "Memory Limit Exceeded";
        } else if (runRes.getExitCode() != 0) {
            verdict = "RTE";
            message = "Runtime Error (Exit code: " + runRes.getExitCode() + ")";
        } else {
            String expectedOutput = Files.readString(testcase.files().outputPath());
            verdict = normalize(runRes.getStdout()).equals(normalize(expectedOutput)) ? "AC" : "WA";
            message = "AC".equals(verdict) ? "Accepted" : "Wrong Answer";
        }

        return TestcaseJudgeResult.builder()
                .testcase(testcase.testcase())
                .verdict(verdict)
                .stdout(truncate(runRes.getStdout(), 4000))
                .stderr(truncate(runRes.getStderr(), 4000))
                .message(message)
                .timeMs(timeMs)
                .memoryKb(0)
                .build();
    }

    private String buildCompileErrorMessage(CommandResult compileRes) {
        if (compileRes.isTimeOut()) {
            return "Compilation timed out after " + (compileTimeoutMs / 1000) + " seconds";
        }
        if (compileRes.getExitCode() == 137) {
            return "Compilation killed with exit code 137, likely exceeded compile memory limit of "
                    + (compileMemoryLimitKb / 1024) + " MB";
        }

        String stderr = truncate(compileRes.getStderr(), 8000);
        if (stderr == null || stderr.isBlank()) {
            return "Compilation failed (Exit code: " + compileRes.getExitCode() + ")";
        }
        return stderr;
    }

    private String normalize(String value) {
        return value == null ? "" : value.replace("\r\n", "\n").replace("\r", "\n").trim();
    }

    private String shellQuote(String value) {
        return "'" + value.replace("'", "'\\''") + "'";
    }

    private String truncate(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }

    private void makeWorkDirWritable(Path workDir) throws IOException {
        try {
            Files.setPosixFilePermissions(workDir, Set.of(
                    PosixFilePermission.OWNER_READ,
                    PosixFilePermission.OWNER_WRITE,
                    PosixFilePermission.OWNER_EXECUTE,
                    PosixFilePermission.GROUP_READ,
                    PosixFilePermission.GROUP_WRITE,
                    PosixFilePermission.GROUP_EXECUTE,
                    PosixFilePermission.OTHERS_READ,
                    PosixFilePermission.OTHERS_WRITE,
                    PosixFilePermission.OTHERS_EXECUTE));
        } catch (UnsupportedOperationException e) {
            File file = workDir.toFile();
            if (!file.setWritable(true, false) || !file.setExecutable(true, false)) {
                throw new IOException("Could not make sandbox writable: " + workDir);
            }
        }
    }

    private void cleanupFiles(Path path) {
        try {
            if (!Files.exists(path)) {
                return;
            }
            Files.walk(path)
                    .sorted((p1, p2) -> p2.compareTo(p1))
                    .forEach(p -> {
                        try {
                            Files.delete(p);
                        } catch (IOException ignored) {
                        }
                    });
        } catch (IOException e) {
            log.warn("Could not clean up work directory: {}", path);
        }
    }
}
