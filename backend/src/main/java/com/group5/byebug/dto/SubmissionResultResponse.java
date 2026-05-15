package com.group5.byebug.dto;

import java.util.List;

import com.group5.byebug.enums.Verdict;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResultResponse {
    private Long submissionId;
    private Verdict verdict;
    private Integer score;
    private Integer totalTimeMs;
    private Integer maxMemoryKb;
    private List<TestcaseResultResponse> testcaseResults;

    private String sourceCode;
    private String language;
    private String compileError;
    private String judgeMessage;
    private String submittedAt;
    private String username;
}
