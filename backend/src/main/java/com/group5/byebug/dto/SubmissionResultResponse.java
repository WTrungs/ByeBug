package com.group5.byebug.dto;

import java.util.List;

import com.group5.byebug.enums.Verdict;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionResultResponse {
    private Long submissionId;
    private Verdict verdict;
    private Integer score;
    private Integer totalTimeMs;
    private Integer maxMemoryKb;
    private List<TestcaseResultResponse> testcaseResults;
}
