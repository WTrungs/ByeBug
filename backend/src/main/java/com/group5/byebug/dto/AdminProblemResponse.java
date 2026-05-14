package com.group5.byebug.dto;

import com.group5.byebug.entity.Problem;
import com.group5.byebug.entity.Tag;
import com.group5.byebug.enums.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProblemResponse {
    private Long problemId;
    private String title;
    private Difficulty difficulty;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private String createdBy;
    private Set<TagDTO> tags;
    private Long totalSubmissions;
    private Long acceptedSubmissions;
    private Double acceptanceRate;

    public static AdminProblemResponse from(Problem problem, long totalSubmissions, long acceptedSubmissions) {
        AdminProblemResponse response = new AdminProblemResponse();
        response.setProblemId(problem.getProblemId());
        response.setTitle(problem.getTitle());
        response.setDifficulty(problem.getDifficulty());
        response.setIsPublic(Boolean.TRUE.equals(problem.getIsPublic()));
        response.setCreatedAt(problem.getCreatedAt());
        response.setCreatedBy(problem.getCreator() != null ? problem.getCreator().getFullName() : "Unknown");
        response.setTags(problem.getTags().stream().map(AdminProblemResponse::toTagDTO).collect(Collectors.toSet()));
        response.setTotalSubmissions(totalSubmissions);
        response.setAcceptedSubmissions(acceptedSubmissions);
        response.setAcceptanceRate(totalSubmissions == 0 ? 0.0 : Math.round(acceptedSubmissions * 1000.0 / totalSubmissions) / 10.0);
        return response;
    }

    private static TagDTO toTagDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        dto.setTagId(tag.getTagId());
        dto.setTagName(tag.getTagName());
        return dto;
    }
}
