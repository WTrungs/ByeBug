package com.byebug.judge.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import com.byebug.judge.entity.Problem;
import com.byebug.judge.entity.Submission;
import com.byebug.judge.entity.Testcase;
import com.byebug.judge.entity.TestcaseResult;
import com.byebug.judge.model.JudgeResult;
import com.byebug.judge.model.TestFileSet;
import com.byebug.judge.model.TestcaseExecution;
import com.byebug.judge.model.TestcaseJudgeResult;
import com.byebug.judge.repository.SubmissionRepository;
import com.byebug.judge.repository.TestcaseRepository;
import com.byebug.judge.repository.TestcaseResultRepository;
import com.byebug.judge.strategy.JudgeStrategy;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JudgeService {
    private static final String BASE_TEMP_PATH = "/tmp/byebug/sandbox/";

    private final Map<String, JudgeStrategy> strategies;
    private final SubmissionRepository submissionRepository;
    private final TestcaseRepository testcaseRepository;
    private final TestcaseResultRepository testcaseResultRepository;
    private final TestcaseStorageService testcaseStorageService;
    private final TransactionTemplate transactionTemplate;

    public JudgeResult judge(Long submissionId) {
        Submission submission = markJudging(submissionId);
        Problem problem = submission.getProblem();

        JudgeStrategy strategy = strategies.get(strategyBeanName(submission.getLanguage()));
        if (strategy == null) {
            JudgeResult result = systemError(submissionId, "Unsupported language: " + submission.getLanguage());
            applyResult(submission, result);
            return result;
        }

        Path workDir = Paths.get(BASE_TEMP_PATH, UUID.randomUUID().toString());
        try {
            List<TestFileSet> files = testcaseStorageService.downloadAndExtractTests(problem.getProblemId(), workDir);
            List<TestcaseExecution> executions = files.stream()
                    .map(fileSet -> new TestcaseExecution(ensureTestcase(problem, fileSet), fileSet))
                    .toList();
            JudgeResult result = strategy.execute(submission, problem, executions);
            applyResult(submission, result);
            return result;
        } catch (Exception e) {
            JudgeResult result = systemError(submissionId, e.getMessage());
            applyResult(submission, result);
            return result;
        }
    }

    private Submission markJudging(Long submissionId) {
        return transactionTemplate.execute(status -> {
            Submission submission = submissionRepository.findById(submissionId)
                    .orElseThrow(() -> new IllegalArgumentException("Submission not found: " + submissionId));
            submission.setVerdict("JUDGING");
            submission.setJudgeMessage(null);
            submission.setCompileError(null);
            testcaseResultRepository.deleteBySubmissionSubmissionId(submissionId);
            return submissionRepository.saveAndFlush(submission);
        });
    }

    private Testcase ensureTestcase(Problem problem, TestFileSet fileSet) {
        return testcaseRepository.findByProblemProblemIdAndDisplayOrder(problem.getProblemId(), fileSet.order())
                .orElseGet(() -> {
                    Testcase testcase = new Testcase();
                    testcase.setProblem(problem);
                    testcase.setDisplayOrder(fileSet.order());
                    testcase.setInputPath("problems/" + problem.getProblemId() + "/tests.zip#" + fileSet.order() + ".in");
                    testcase.setOutputPath("problems/" + problem.getProblemId() + "/tests.zip#" + fileSet.order() + ".out");
                    testcase.setIsVisible(false);
                    testcase.setScoreWeight(1);
                    return testcaseRepository.save(testcase);
                });
    }

    private void applyResult(Submission submission, JudgeResult result) {
        transactionTemplate.executeWithoutResult(status -> {
            submission.setVerdict(result.getStatus());
            submission.setScore(result.getScore() == null ? 0 : result.getScore());
            submission.setJudgeMessage(result.getMessage());
            submission.setCompileError("CE".equals(result.getStatus()) ? result.getMessage() : null);
            submission.setTotalTimeMs(result.getTimeUsedMs());
            submission.setMaxMemoryKb(result.getMemoryUsedKb() == null ? 0 : result.getMemoryUsedKb());
            Submission saved = submissionRepository.save(submission);

            for (TestcaseJudgeResult testcaseResult : result.getTestcaseResults()) {
                TestcaseResult entity = new TestcaseResult();
                entity.setSubmission(saved);
                entity.setTestcase(testcaseResult.getTestcase());
                entity.setVerdict(testcaseResult.getVerdict());
                entity.setUserOutput(testcaseResult.getStdout());
                entity.setTimeMs(testcaseResult.getTimeMs());
                entity.setMemoryKb(testcaseResult.getMemoryKb());
                testcaseResultRepository.save(entity);
            }
        });
    }

    private JudgeResult systemError(Long submissionId, String message) {
        JudgeResult result = new JudgeResult();
        result.setSubmissionId(String.valueOf(submissionId));
        result.setStatus("SE");
        result.setMessage(message);
        result.setScore(0);
        result.setMemoryUsedKb(0);
        result.setTimeUsedMs(0);
        return result;
    }

    private String strategyBeanName(String language) {
        String normalized = language == null ? "" : language.toLowerCase();
        if ("cpp".equals(normalized) || "c++".equals(normalized)) {
            return "cppJudgeStrategy";
        }
        return normalized + "JudgeStrategy";
    }
}
