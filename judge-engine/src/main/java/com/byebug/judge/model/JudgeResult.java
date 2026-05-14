package com.byebug.judge.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JudgeResult implements Serializable {

    @NotBlank(message = "Submission ID không được để trống")
    private String submissionId;

    @NotBlank(message = "Trạng thái (status) không được để trống")
    @Pattern(regexp = "^(AC|WA|TLE|MLE|RTE|OLE|CE|SE|JUDGING|PENDING)$",
             message = "Trạng thái không hợp lệ")
    private String status;

    @NotNull(message = "Thời gian sử dụng không được để trống")
    @Min(value = 0, message = "Thời gian sử dụng không được âm")
    private Integer timeUsedMs;

    @NotNull(message = "Bộ nhớ sử dụng không được để trống")
    @Min(value = 0, message = "Bộ nhớ sử dụng không được âm")
    private Integer memoryUsedKb;
    
    private String stdout;

    private String stderr;

    private String message;

    private Integer score;

    private List<TestcaseJudgeResult> testcaseResults = new ArrayList<>();
}
