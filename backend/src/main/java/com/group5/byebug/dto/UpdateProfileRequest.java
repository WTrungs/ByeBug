package com.group5.byebug.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String email;
    private String avatarUrl;
    private String gender;
}
