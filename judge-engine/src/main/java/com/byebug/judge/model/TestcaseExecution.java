package com.byebug.judge.model;

import com.byebug.judge.entity.Testcase;

public record TestcaseExecution(Testcase testcase, TestFileSet files) {
}
