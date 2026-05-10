package com.byebug.judge.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class JudgeRequest implements Serializable {
    private String submissionId;
    private String problemId;
    private String code;
    private String language;
    private String input;
    private String expectedOutput;
    private Long timeLimit;    // second
    private Long memoryLimit;  // MB
}