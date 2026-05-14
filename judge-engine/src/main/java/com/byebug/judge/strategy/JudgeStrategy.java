package com.byebug.judge.strategy;

import java.util.List;

import com.byebug.judge.entity.Problem;
import com.byebug.judge.entity.Submission;
import com.byebug.judge.model.JudgeResult;
import com.byebug.judge.model.TestcaseExecution;

public interface JudgeStrategy {
    JudgeResult execute(Submission submission, Problem problem, List<TestcaseExecution> testcases);
}
