package com.group5.byebug.dto;

import java.util.List;
import java.util.Set;

import com.group5.byebug.enums.Difficulty;

import lombok.Data;

@Data
public class ProblemResponseDTO {
    private Long problemId;
    private String title;
    private String description;
    private String constraints;
    private Difficulty difficulty;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private Boolean isPublic;
    private String createdBy;
    private Set<TagDTO> tags;
    private List<ProblemExampleDTO> examples;
}
