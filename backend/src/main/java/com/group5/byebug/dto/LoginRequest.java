package com.group5.byebug.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}