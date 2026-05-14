package com.byebug.judge.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JudgeJob {
    @NotNull
    private Long submissionId;
}
