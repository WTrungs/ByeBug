package com.group5.byebug.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String fullName;
    private String email;
    private String password;
}