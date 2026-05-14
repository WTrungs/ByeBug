package com.group5.byebug.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.group5.byebug.dto.SubmissionRequest;
import com.group5.byebug.dto.SubmissionResultResponse;
import com.group5.byebug.dto.TestcaseResultResponse;
import com.group5.byebug.entity.Problem;
import com.group5.byebug.entity.Submission;
import com.group5.byebug.entity.User;
import com.group5.byebug.enums.Verdict;
import com.group5.byebug.repository.ProblemRepository;
import com.group5.byebug.repository.SubmissionRepository;
import com.group5.byebug.repository.TestcaseResultRepository;
import com.group5.byebug.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final TestcaseResultRepository testcaseResultRepository;
    private final JudgeQueueProducer judgeQueueProducer;

    @Transactional
    public SubmissionResultResponse submit(SubmissionRequest request) {
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Submission submission = new Submission();
        submission.setProblem(problem);
        submission.setUser(user);
        submission.setLanguage(request.getLanguage());
        submission.setSourceCode(request.getSourceCode());
        submission.setVerdict(Verdict.PENDING);
        submission.setScore(0);

        Submission saved = submissionRepository.save(submission);
        enqueueAfterCommit(saved.getSubmissionId());
        return toResponse(saved);
    }

    private void enqueueAfterCommit(Long submissionId) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            judgeQueueProducer.enqueue(submissionId);
            return;
        }

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                judgeQueueProducer.enqueue(submissionId);
            }
        });
    }

    @Transactional(readOnly = true)
    public SubmissionResultResponse getResult(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        return toResponse(submission);
    }

    private SubmissionResultResponse toResponse(Submission submission) {
        List<TestcaseResultResponse> testcaseResults = testcaseResultRepository
                .findBySubmissionSubmissionIdOrderByTestcaseDisplayOrderAsc(submission.getSubmissionId())
                .stream()
                .map(result -> TestcaseResultResponse.builder()
                        .testcaseId(result.getTestcase().getTestcaseId())
                        .verdict(result.getVerdict())
                        .timeMs(result.getTimeMs())
                        .memoryKb(result.getMemoryKb())
                        .build())
                .toList();

        return SubmissionResultResponse.builder()
                .submissionId(submission.getSubmissionId())
                .verdict(submission.getVerdict())
                .score(submission.getScore())
                .totalTimeMs(submission.getTotalTimeMs())
                .maxMemoryKb(submission.getMaxMemoryKb())
                .testcaseResults(testcaseResults)
                .build();
    }
}
