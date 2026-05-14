package com.group5.byebug.dto;

import com.group5.byebug.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String gender;
    private String role;
    private Integer totalScore;
    private Boolean isActive;
    private LocalDateTime deletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    private String status;

    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getGender(),
                user.getRole(),
                user.getTotalScore(),
                user.getIsActive(),
                user.getDeletedAt(),
                user.getCreatedAt(),
                user.getLastLoginAt(),
                resolveStatus(user)
        );
    }

    private static String resolveStatus(User user) {
        if (user.getDeletedAt() != null) {
            return "DELETED";
        }
        return Boolean.TRUE.equals(user.getIsActive()) ? "ACTIVE" : "INACTIVE";
    }
}
