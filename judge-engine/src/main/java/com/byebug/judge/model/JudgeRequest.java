package com.byebug.judge.model;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class JudgeRequest implements Serializable {

    @NotBlank(message = "Submission ID không được để trống")
    private String submissionId;

    @NotBlank(message = "Problem ID không được để trống")
    private String problemId;

    @NotBlank(message = "Mã nguồn (code) không được để trống")
    private String code;

    @NotBlank(message = "Ngôn ngữ lập trình phải được xác định")
    private String language;

    private String input;

    private String expectedOutput;

    @NotNull(message = "Giới hạn thời gian không được để trống")
    @Positive(message = "Giới hạn thời gian phải là số dương")
    private Long timeLimit;    // second

    @NotNull(message = "Giới hạn bộ nhớ không được để trống")
    @Positive(message = "Giới hạn bộ nhớ phải là số dương")
    private Long memoryLimit;  // MB
}