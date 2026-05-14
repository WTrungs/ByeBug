package com.group5.byebug.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeSummaryResponse {
    private UserStats userStats;
    private List<LeaderboardItem> leaderboard;
    private List<ProblemItem> popularProblems;
    private List<ProblemItem> latestProblems;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStats {
        private Long solvedCount;
        private Long totalProblems;
        private Long attemptedCount;
        private Integer totalScore;
        private Long rank;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaderboardItem {
        private String username;
        private String initials;
        private Integer score;
        private Integer rank;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProblemItem {
        private Long id;
        private String title;
        private String difficulty;
        private String acRate;
        private String submissionCount;
    }
}
