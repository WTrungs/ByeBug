package com.group5.byebug.service.impl;

import com.group5.byebug.dto.HomeSummaryResponse;
import com.group5.byebug.entity.Problem;
import com.group5.byebug.entity.User;
import com.group5.byebug.enums.Verdict;
import com.group5.byebug.repository.ProblemRepository;
import com.group5.byebug.repository.SubmissionRepository;
import com.group5.byebug.repository.UserRepository;
import com.group5.byebug.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    @Override
    public HomeSummaryResponse getHomeSummary(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. User Stats
        Long solvedCount = submissionRepository.countDistinctProblemByUserIdAndVerdict(user.getUserId(), Verdict.AC);
        Long attemptedCount = submissionRepository.countByUserUserId(user.getUserId());
        Long totalProblems = problemRepository.countByIsPublicTrue();
        
        // Simple rank calculation based on total score
        Long rank = userRepository.countByTotalScoreGreaterThan(user.getTotalScore()) + 1;

        HomeSummaryResponse.UserStats stats = HomeSummaryResponse.UserStats.builder()
                .solvedCount(solvedCount)
                .totalProblems(totalProblems)
                .attemptedCount(attemptedCount)
                .totalScore(user.getTotalScore())
                .rank(rank)
                .build();

        // 2. Leaderboard (Top 3)
        List<HomeSummaryResponse.LeaderboardItem> leaderboard = userRepository.findAllByOrderByTotalScoreDesc(PageRequest.of(0, 3))
                .stream()
                .map(u -> HomeSummaryResponse.LeaderboardItem.builder()
                        .username(u.getUsername())
                        .initials(getInitials(u.getUsername()))
                        .score(u.getTotalScore())
                        .rank(0) // Will be set in frontend or calculated here
                        .build())
                .collect(Collectors.toList());

        // 3. Popular Problems
        List<HomeSummaryResponse.ProblemItem> popular = problemRepository.findPopularProblems(PageRequest.of(0, 3))
                .stream()
                .map(this::mapToProblemItem)
                .collect(Collectors.toList());

        // 4. Latest Problems
        List<HomeSummaryResponse.ProblemItem> latest = problemRepository.findLatestProblems(PageRequest.of(0, 3))
                .stream()
                .map(this::mapToProblemItem)
                .collect(Collectors.toList());

        return HomeSummaryResponse.builder()
                .userStats(stats)
                .leaderboard(leaderboard)
                .popularProblems(popular)
                .latestProblems(latest)
                .build();
    }

    private HomeSummaryResponse.ProblemItem mapToProblemItem(Problem p) {
        Long totalSubmissions = submissionRepository.countByProblemProblemId(p.getProblemId());
        Long acSubmissions = submissionRepository.countByProblemProblemIdAndVerdict(p.getProblemId(), Verdict.AC);
        
        String acRate = "0%";
        if (totalSubmissions > 0) {
            acRate = Math.round((acSubmissions * 100.0) / totalSubmissions) + "%";
        }

        return HomeSummaryResponse.ProblemItem.builder()
                .id(p.getProblemId())
                .title(p.getTitle())
                .difficulty(p.getDifficulty().name().toLowerCase())
                .acRate(acRate)
                .submissionCount(formatCount(totalSubmissions))
                .build();
    }

    private String formatCount(Long count) {
        if (count == null || count == 0) return "0";
        if (count < 1000) return count.toString();
        if (count < 1000000) return String.format("%.1fk", count / 1000.0);
        return String.format("%.1fm", count / 1000000.0);
    }

    private String getInitials(String username) {
        if (username == null || username.isEmpty()) return "??";
        if (username.length() == 1) return username.toUpperCase();
        return (username.substring(0, 1) + username.substring(username.length() - 1)).toUpperCase();
    }
}
