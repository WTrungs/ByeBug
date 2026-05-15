package com.group5.byebug.dto;

import com.group5.byebug.enums.Difficulty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AdminProblemRequest {
    @NotBlank(message = "Tên đề bài là bắt buộc")
    @Size(max = 200, message = "Tên đề bài tối đa 200 ký tự")
    private String title;

    @NotBlank(message = "Mô tả là bắt buộc")
    private String description;

    private String constraints;

    @NotNull(message = "Độ khó là bắt buộc")
    private Difficulty difficulty;

    @NotNull(message = "Time limit là bắt buộc")
    @Min(value = 1, message = "Time limit phải lớn hơn 0")
    private Integer timeLimitMs;

    @NotNull(message = "Memory limit là bắt buộc")
    @Min(value = 1, message = "Memory limit phải lớn hơn 0")
    private Integer memoryLimitKb;

    private Boolean isPublic = false;

    private List<String> tags = new ArrayList<>();

    @Valid
    private List<ProblemExampleDTO> examples = new ArrayList<>();
}
