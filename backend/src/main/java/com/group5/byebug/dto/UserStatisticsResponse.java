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
public class UserStatisticsResponse {
    private Integer solvedCount;
    private Integer rank;
    private Long attemptedCount;
    private Integer streak;
    private List<DailyStats> chartData;
    private List<SubmissionDTO> recentSubmissions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyStats {
        private String day; // E.g., "T2", "T3" or date string
        private Long ac;
        private Long wa;
    }
}
