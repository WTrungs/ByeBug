package com.group5.byebug.dto;

import com.group5.byebug.enums.ProgrammingLanguage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmissionRequest {
    @NotNull
    private Long problemId;

    @NotNull
    private Long userId;

    @NotNull
    private ProgrammingLanguage language;

    @NotBlank
    private String sourceCode;
}
