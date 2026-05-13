package com.group5.byebug.dto;

import java.util.Set;

import com.group5.byebug.enums.Difficulty;

import lombok.Data;

@Data
public class ProblemResponseDTO {
    private Long problemId;
    private String title;
    private String description;
    private Difficulty difficulty;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private String createdBy;
    private Set<TagDTO> tags;
}