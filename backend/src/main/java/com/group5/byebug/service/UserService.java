package com.group5.byebug.service;

import com.group5.byebug.dto.*;
import com.group5.byebug.entity.User;
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
    private final SubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, SubmissionRepository submissionRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
        this.passwordEncoder = passwordEncoder;
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
    System.out.println("--- Login Debug ---");
    Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
    
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        System.out.println("Found user: " + user.getUsername());
        System.out.println("Comparing: " + request.getPassword() + " vs " + user.getPasswordHash());

       if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            System.out.println("Login Success!");
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
            return new UserResponse(user.getUserId(), user.getUsername(), user.getFullName(), user.getEmail(), "Đăng nhập thành công", user.getRole());
        } else {
            System.out.println("Password mismatch!");
        }
    } else {
        System.out.println("Username not found!");
    }
    throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
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
                .avatarUrl(user.getAvatarUrl() != null ? user.getAvatarUrl() : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getUsername())
                .totalPoints(user.getTotalScore())
                .rank(rank)
                .solvedCount(solvedCount)
                .attemptedCount(attemptedCount)
                .verdictStats(verdictStats)
                .recentSubmissions(submissionDTOs)
                .build();
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
        System.out.println("--- Change Password Debug ---");
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        System.out.println("Verifying old password for user: " + username);
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            System.err.println("Old password mismatch for user: " + username);
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        String newHash = passwordEncoder.encode(request.getNewPassword());
        user.setPasswordHash(newHash);
        userRepository.save(user);
        System.out.println("Password updated successfully for user: " + username);
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