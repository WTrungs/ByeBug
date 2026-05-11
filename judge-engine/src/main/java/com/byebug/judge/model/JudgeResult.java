package com.byebug.judge.model;

import java.io.Serializable;

import jakarta.validation.constraints.DecimalMin;
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
    @Pattern(regexp = "^(AC|WA|TLE|MLE|RE|CE|SE)$", 
             message = "Trạng thái phải thuộc các giá trị: AC, WA, TLE, MLE, RE, CE, SE")
    private String status;       // AC, WA, TLE, MLE, RE, CE, SE

    @NotNull(message = "Thời gian sử dụng không được để trống")
    @DecimalMin(value = "0.0", message = "Thời gian sử dụng không được âm")
    private Double timeUsed;     // seconds

    @NotNull(message = "Bộ nhớ sử dụng không được để trống")
    @Min(value = 0, message = "Bộ nhớ sử dụng không được âm")
    private Integer memoryUsed;  // MB
    
    private String stdout;

    private String stderr;

    private String message;
}