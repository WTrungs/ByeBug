package com.group5.byebug.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminOverviewResponse {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long deletedUsers;
    private long totalProblems;
    private long publicProblems;
    private long privateProblems;
    private long totalSubmissions;
    private long acceptedSubmissions;
    private long failedSubmissions;
    private double acceptanceRate;
    private List<ActivityItem> recentActivities;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityItem {
        private Long id;
        private LocalDateTime time;
        private String user;
        private String action;
        private String target;
        private String status;
    }
}
