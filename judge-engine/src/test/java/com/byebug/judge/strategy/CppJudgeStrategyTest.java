package com.byebug.judge.strategy;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.byebug.judge.entity.Problem;
import com.byebug.judge.entity.Submission;
import com.byebug.judge.entity.Testcase;
import com.byebug.judge.model.CommandResult;
import com.byebug.judge.model.JudgeResult;
import com.byebug.judge.model.TestFileSet;
import com.byebug.judge.model.TestcaseExecution;
import com.byebug.judge.service.DockerService;

@ExtendWith(MockitoExtension.class)
class CppJudgeStrategyTest {
    private static final long COMPILE_MEMORY_LIMIT_KB = 1_048_576L;
    private static final long COMPILE_TIMEOUT_MS = 10_000L;
    private static final long RUN_MEMORY_LIMIT_KB = 262_144L;

    @Mock
    private DockerService dockerService;

    private CppJudgeStrategy strategy;

    @BeforeEach
    void setUp() {
        strategy = new CppJudgeStrategy(dockerService, COMPILE_MEMORY_LIMIT_KB, COMPILE_TIMEOUT_MS);
    }

    @Test
    void executeWhenCompileSucceedsRunsTestcases(@TempDir Path tempDir) throws IOException {
        TestcaseExecution testcase = testcase(tempDir, "42\n");
        when(dockerService.createContainer(eq("cpp"), anyString(), eq(COMPILE_MEMORY_LIMIT_KB)))
                .thenReturn("compile-container");
        when(dockerService.execCommand(
                eq("compile-container"),
                eq(COMPILE_TIMEOUT_MS),
                eq("g++"),
                eq("-std=c++17"),
                eq("-O2"),
                eq("solution.cpp"),
                eq("-o"),
                eq("solution")))
                .thenReturn(new CommandResult(0L, "", "", false));
        when(dockerService.createContainer(eq("cpp"), anyString(), eq(RUN_MEMORY_LIMIT_KB)))
                .thenReturn("run-container");
        when(dockerService.execCommand(
                eq("run-container"),
                eq(2_000L),
                eq("sh"),
                eq("-c"),
                anyString()))
                .thenReturn(new CommandResult(0L, "42\n", "", false));

        JudgeResult result = strategy.execute(submission(), problem(), List.of(testcase));

        assertThat(result.getStatus()).isEqualTo("AC");
        assertThat(result.getScore()).isEqualTo(100);
        assertThat(result.getTestcaseResults()).hasSize(1);
        assertThat(result.getTestcaseResults().get(0).getVerdict()).isEqualTo("AC");
        verify(dockerService).stopAndRemoveContainer("compile-container");
        verify(dockerService).stopAndRemoveContainer("run-container");
    }

    @Test
    void executeWhenCompileIsKilledReturnsCeWithClearResourceMessage(@TempDir Path tempDir) {
        TestcaseExecution testcase = testcase(tempDir, "42\n");
        when(dockerService.createContainer(eq("cpp"), anyString(), eq(COMPILE_MEMORY_LIMIT_KB)))
                .thenReturn("compile-container");
        when(dockerService.execCommand(
                eq("compile-container"),
                eq(COMPILE_TIMEOUT_MS),
                eq("g++"),
                eq("-std=c++17"),
                eq("-O2"),
                eq("solution.cpp"),
                eq("-o"),
                eq("solution")))
                .thenReturn(new CommandResult(137L, "", "", false));

        JudgeResult result = strategy.execute(submission(), problem(), List.of(testcase));

        assertThat(result.getStatus()).isEqualTo("CE");
        assertThat(result.getScore()).isZero();
        assertThat(result.getMessage())
                .isEqualTo("Compilation killed with exit code 137, likely exceeded compile memory limit of 1024 MB");
        assertThat(result.getTestcaseResults()).isEmpty();
        verify(dockerService, never()).createContainer(eq("cpp"), anyString(), eq(RUN_MEMORY_LIMIT_KB));
        verify(dockerService).stopAndRemoveContainer("compile-container");
    }

    @Test
    void executeWhenCompileFailsReturnsCeWithCompilerStderr(@TempDir Path tempDir) {
        TestcaseExecution testcase = testcase(tempDir, "42\n");
        when(dockerService.createContainer(eq("cpp"), anyString(), eq(COMPILE_MEMORY_LIMIT_KB)))
                .thenReturn("compile-container");
        when(dockerService.execCommand(
                eq("compile-container"),
                eq(COMPILE_TIMEOUT_MS),
                eq("g++"),
                eq("-std=c++17"),
                eq("-O2"),
                eq("solution.cpp"),
                eq("-o"),
                eq("solution")))
                .thenReturn(new CommandResult(1L, "", "solution.cpp:1: error: expected ';'\n", false));

        JudgeResult result = strategy.execute(submission(), problem(), List.of(testcase));

        assertThat(result.getStatus()).isEqualTo("CE");
        assertThat(result.getMessage()).contains("expected ';'");
        assertThat(result.getTestcaseResults()).isEmpty();
        verify(dockerService, never()).createContainer(eq("cpp"), anyString(), eq(RUN_MEMORY_LIMIT_KB));
        verify(dockerService).stopAndRemoveContainer("compile-container");
    }

    private Submission submission() {
        Submission submission = new Submission();
        submission.setSubmissionId(123L);
        submission.setSourceCode("#include <iostream>\nint main(){ std::cout << 42 << '\\n'; }\n");
        return submission;
    }

    private Problem problem() {
        Problem problem = new Problem();
        problem.setTimeLimitMs(2_000);
        problem.setMemoryLimitKb((int) RUN_MEMORY_LIMIT_KB);
        return problem;
    }

    private TestcaseExecution testcase(Path tempDir, String expectedOutput) {
        try {
            Path caseDir = tempDir.resolve("work/cases");
            Files.createDirectories(caseDir);
            Path inputPath = caseDir.resolve("1.in");
            Path outputPath = caseDir.resolve("1.out");
            Files.writeString(inputPath, "");
            Files.writeString(outputPath, expectedOutput);

            Testcase testcase = new Testcase();
            testcase.setDisplayOrder(1);
            return new TestcaseExecution(testcase, new TestFileSet(1, inputPath, outputPath));
        } catch (IOException e) {
            throw new IllegalStateException("Could not create testcase files", e);
        }
    }
}
