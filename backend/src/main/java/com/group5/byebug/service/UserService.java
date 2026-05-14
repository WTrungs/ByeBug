package com.group5.byebug.service;

import com.group5.byebug.dto.*;
import com.group5.byebug.entity.Admin;
import com.group5.byebug.entity.User;
import com.group5.byebug.repository.AdminRepository;
import com.group5.byebug.repository.UserRepository;
import com.group5.byebug.repository.SubmissionRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final SubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            AdminRepository adminRepository,
            SubmissionRepository submissionRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.submissionRepository = submissionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        

        user.setRole("USER"); 
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser.getUserId(), savedUser.getUsername(), savedUser.getFullName(), savedUser.getEmail(), "Đăng ký thành công", savedUser.getRole());
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Sai tên đăng nhập hoặc mật khẩu"));

        if (!Boolean.TRUE.equals(user.getIsActive()) || user.getDeletedAt() != null) {
            throw new RuntimeException("Tài khoản đã bị vô hiệu hóa");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
        }

        user.setLastLoginAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new UserResponse(
                savedUser.getUserId(),
                savedUser.getUsername(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                "Đăng nhập thành công",
                savedUser.getRole(),
                token
        );
    }

    public UserResponse adminLogin(LoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Sai tên đăng nhập hoặc mật khẩu"));

        if (!Boolean.TRUE.equals(admin.getIsActive())) {
            throw new RuntimeException("Tài khoản đã bị vô hiệu hóa");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
        }

        String token = jwtService.generateToken(admin);
        return new UserResponse(
                admin.getAdminId(),
                admin.getUsername(),
                admin.getFullName(),
                admin.getEmail(),
                "Đăng nhập thành công",
                "ADMIN",
                token
        );
    }

    public UserResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return new UserResponse(user.getUserId(), user.getUsername(), user.getFullName(), user.getEmail(), "Khôi phục mật khẩu thành công", user.getRole());
        }
        throw new RuntimeException("Không tìm thấy email");
    }

    public UserProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int rank = (int) userRepository.countByTotalScoreGreaterThan(user.getTotalScore()) + 1;
        long solvedCount = submissionRepository.countDistinctProblemByUserIdAndVerdict(user.getUserId(), com.group5.byebug.enums.Verdict.AC);
        long attemptedCount = submissionRepository.countDistinctProblemByUserId(user.getUserId());

        UserProfileResponse.VerdictStats verdictStats = UserProfileResponse.VerdictStats.builder()
                .ac(submissionRepository.countByUserUserIdAndVerdict(user.getUserId(), com.group5.byebug.enums.Verdict.AC))
                .wa(submissionRepository.countByUserUserIdAndVerdict(user.getUserId(), com.group5.byebug.enums.Verdict.WA))
                .tle(submissionRepository.countByUserUserIdAndVerdict(user.getUserId(), com.group5.byebug.enums.Verdict.TLE))
                .mle(submissionRepository.countByUserUserIdAndVerdict(user.getUserId(), com.group5.byebug.enums.Verdict.MLE))
                .re(submissionRepository.countByUserUserIdAndVerdict(user.getUserId(), com.group5.byebug.enums.Verdict.RTE))
                .ce(submissionRepository.countByUserUserIdAndVerdict(user.getUserId(), com.group5.byebug.enums.Verdict.CE))
                .build();

        List<com.group5.byebug.entity.Submission> recentSubmissions = submissionRepository.findByUserOrderBySubmittedAtDesc(user, org.springframework.data.domain.PageRequest.of(0, 5));
        List<SubmissionDTO> submissionDTOs = recentSubmissions.stream()
                .map(s -> SubmissionDTO.builder()
                        .id(s.getSubmissionId())
                        .problemId(s.getProblem().getProblemId())
                        .problemTitle(s.getProblem().getTitle())
                        .result(s.getVerdict())
                        .time(s.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());

        return UserProfileResponse.builder()
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(getAvatarUrl(user))
                .totalPoints(user.getTotalScore())
                .rank(rank)
                .solvedCount(getSolvedCount(user.getUserId()))
                .attemptedCount(attemptedCount)
                .verdictStats(verdictStats)
                .recentSubmissions(submissionDTOs)
                .build();
    }

    public List<LeaderboardResponse> getLeaderboard() {
        List<User> topUsers = userRepository.findAllByOrderByTotalScoreDesc(org.springframework.data.domain.PageRequest.of(0, 20));
        return topUsers.stream().map(u -> {
            return LeaderboardResponse.builder()
                    .username(u.getUsername())
                    .fullName(u.getFullName())
                    .avatarUrl(getAvatarUrl(u))
                    .totalPoints(u.getTotalScore())
                    .solvedCount(getSolvedCount(u.getUserId()))
                    .createdAt(u.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    public UserStatisticsResponse getStatistics(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer totalScore = user.getTotalScore() != null ? user.getTotalScore() : 0;
        int rank = (int) userRepository.countByTotalScoreGreaterThan(totalScore) + 1;
        Long solvedCountLong = submissionRepository.countDistinctProblemByUserIdAndVerdict(user.getUserId(), com.group5.byebug.enums.Verdict.AC);
        long solvedCount = solvedCountLong != null ? solvedCountLong : 0L;

        Long attemptedCountLong = submissionRepository.countDistinctProblemByUserId(user.getUserId());
        long attemptedCount = attemptedCountLong != null ? attemptedCountLong : 0L;

        // Daily stats for last 7 days
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(6).withHour(0).withMinute(0).withSecond(0).withNano(0);
        List<com.group5.byebug.entity.Submission> recentSubmissionsForChart = submissionRepository.findByUserAndSubmittedAtAfter(user, sevenDaysAgo);

        String[] dayLabels = {"CN", "T2", "T3", "T4", "T5", "T6", "T7"};
        java.util.Map<String, UserStatisticsResponse.DailyStats> dailyMap = new java.util.LinkedHashMap<>();
        
        for (int i = 0; i < 7; i++) {
            LocalDateTime day = sevenDaysAgo.plusDays(i);
            int dayOfWeek = day.getDayOfWeek().getValue() % 7; // 0=Sunday, 1=Monday...
            String label = dayLabels[dayOfWeek];
            dailyMap.put(label, new UserStatisticsResponse.DailyStats(label, 0L, 0L));
        }

        recentSubmissionsForChart.forEach(s -> {
            int dayOfWeek = s.getSubmittedAt().getDayOfWeek().getValue() % 7;
            String label = dayLabels[dayOfWeek];
            UserStatisticsResponse.DailyStats stats = dailyMap.get(label);
            if (stats != null) {
                if (s.getVerdict() == com.group5.byebug.enums.Verdict.AC) {
                    stats.setAc(stats.getAc() + 1);
                } else if (s.getVerdict() == com.group5.byebug.enums.Verdict.WA) {
                    stats.setWa(stats.getWa() + 1);
                }
            }
        });

        // Recent submissions for history table (top 15)
        List<com.group5.byebug.entity.Submission> history = submissionRepository.findByUserOrderBySubmittedAtDesc(user, org.springframework.data.domain.PageRequest.of(0, 15));
        List<SubmissionDTO> historyDTOs = history.stream()
                .map(s -> SubmissionDTO.builder()
                        .id(s.getSubmissionId())
                        .problemId(s.getProblem().getProblemId())
                        .problemTitle(s.getProblem().getTitle())
                        .result(s.getVerdict())
                        .time(s.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());

        return UserStatisticsResponse.builder()
                .solvedCount((int) solvedCount)
                .rank(rank)
                .attemptedCount(attemptedCount)
                .streak(0) // Placeholder for now
                .chartData(new java.util.ArrayList<>(dailyMap.values()))
                .recentSubmissions(historyDTOs)
                .build();
    }

    private long getSolvedCount(Long userId) {
        Long count = submissionRepository.countDistinctProblemByUserIdAndVerdict(userId, com.group5.byebug.enums.Verdict.AC);
        return count != null ? count : 0L;
    }

    private String getAvatarUrl(User user) {
        return user.getAvatarUrl() != null ? user.getAvatarUrl() : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getUsername();
    }

    public UserResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) {
            if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email đã tồn tại");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getGender() != null) user.setGender(request.getGender());

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser.getUserId(), savedUser.getUsername(), savedUser.getFullName(), savedUser.getEmail(), "Cập nhật thành công", savedUser.getRole());
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        String newHash = passwordEncoder.encode(request.getNewPassword());
        user.setPasswordHash(newHash);
        userRepository.save(user);
    }

    public void deleteAccount(String username, DeleteAccountRequest request) {
        System.out.println("--- Delete Account Debug ---");
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        System.out.println("Verifying password for account deletion: " + username);
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            System.err.println("Password mismatch for account deletion: " + username);
            throw new RuntimeException("Mật khẩu không chính xác. Không thể xóa tài khoản.");
        }

        // Delete related submissions first to avoid integrity constraints
        submissionRepository.deleteByUser(user);
        System.out.println("Submissions deleted for user: " + username);

        userRepository.delete(user);
        System.out.println("Account deleted successfully: " + username);
    }
}
