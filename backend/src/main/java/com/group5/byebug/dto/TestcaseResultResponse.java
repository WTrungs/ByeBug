package com.group5.byebug.dto;

import com.group5.byebug.enums.Verdict;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestcaseResultResponse {
    private Long testcaseId;
    private Verdict verdict;
    private Integer timeMs;
    private Integer memoryKb;
}
