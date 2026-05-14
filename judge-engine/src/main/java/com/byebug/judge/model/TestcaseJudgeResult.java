package com.byebug.judge.model;

import com.byebug.judge.entity.Testcase;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestcaseJudgeResult {
    private Testcase testcase;
    private String verdict;
    private String stdout;
    private String stderr;
    private String message;
    private Integer timeMs;
    private Integer memoryKb;
}
