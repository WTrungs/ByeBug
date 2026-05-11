package com.byebug.judge.strategy;

import com.byebug.judge.model.JudgeRequest;
import com.byebug.judge.model.JudgeResult;

public interface JudgeStrategy {
    JudgeResult execute(JudgeRequest request);
}