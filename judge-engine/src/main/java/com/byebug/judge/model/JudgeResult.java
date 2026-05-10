package com.byebug.judge.model;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JudgeResult implements Serializable {
    private String submissionId;
    private String status;       // AC, WA, TLE, MLE, RE, CE, SE
    private Double timeUsed;     // seconds
    private Integer memoryUsed;  // MB
    private String message;
    private String output;
}