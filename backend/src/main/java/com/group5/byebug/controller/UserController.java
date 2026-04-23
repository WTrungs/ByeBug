package com.group5.byebug.controller;

import com.group5.byebug.dto.ForgotPasswordRequest;
import com.group5.byebug.dto.LoginRequest;
import com.group5.byebug.dto.RegisterRequest;
import com.group5.byebug.dto.UserResponse;
import com.group5.byebug.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(userService.register(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new UserResponse(null, null, null, null, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(userService.login(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new UserResponse(null, null, null, null, e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<UserResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.forgotPassword(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new UserResponse(null, null, null, null, e.getMessage()));
        }
    }
}