package com.group5.byebug.service;

import com.group5.byebug.dto.AdminOverviewResponse;
import com.group5.byebug.enums.Verdict;
import com.group5.byebug.repository.ProblemRepository;
import com.group5.byebug.repository.SubmissionRepository;
import com.group5.byebug.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminOverviewService {
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    public AdminOverviewService(
            UserRepository userRepository,
            ProblemRepository problemRepository,
            SubmissionRepository submissionRepository
    ) {
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.submissionRepository = submissionRepository;
    }

    public AdminOverviewResponse getOverview() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActiveTrueAndDeletedAtIsNull();
        long inactiveUsers = userRepository.countByIsActiveFalseAndDeletedAtIsNull();
        long deletedUsers = userRepository.countByDeletedAtIsNotNull();
        long totalProblems = problemRepository.count();
        long publicProblems = problemRepository.countByIsPublicTrue();
        long privateProblems = problemRepository.countByIsPublicFalse();
        long totalSubmissions = submissionRepository.count();
        long acceptedSubmissions = valueOrZero(submissionRepository.countByVerdict(Verdict.AC));
        long failedSubmissions = Math.max(totalSubmissions - acceptedSubmissions, 0);
        double acceptanceRate = totalSubmissions == 0
                ? 0
                : Math.round((acceptedSubmissions * 10000.0) / totalSubmissions) / 100.0;

        return new AdminOverviewResponse(
                totalUsers,
                activeUsers,
                inactiveUsers,
                deletedUsers,
                totalProblems,
                publicProblems,
                privateProblems,
                totalSubmissions,
                acceptedSubmissions,
                failedSubmissions,
                acceptanceRate,
                recentActivities()
        );
    }

    private List<AdminOverviewResponse.ActivityItem> recentActivities() {
        return submissionRepository.findRecentSubmissionActivities(5)
                .stream()
                .map(this::toActivity)
                .toList();
    }

    private AdminOverviewResponse.ActivityItem toActivity(SubmissionRepository.RecentSubmissionActivity activity) {
        String verdict = activity.getStatus() == null ? "PENDING" : activity.getStatus();
        return new AdminOverviewResponse.ActivityItem(
                activity.getId(),
                activity.getTime(),
                activity.getUsername(),
                "submission",
                activity.getTarget(),
                verdict
        );
    }

    private long valueOrZero(Long value) {
        return value == null ? 0 : value;
    }
}
