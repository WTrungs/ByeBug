package com.group5.byebug.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String username;
    private String fullName;
    private String email;
    private String avatarUrl;
    private Integer totalPoints;
    private Integer rank;
    private Long solvedCount;
    private Long attemptedCount;
    private VerdictStats verdictStats;
    private List<SubmissionDTO> recentSubmissions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerdictStats {
        private Long ac;
        private Long wa;
        private Long tle;
        private Long mle;
        private Long re;
        private Long ce;
    }
}
