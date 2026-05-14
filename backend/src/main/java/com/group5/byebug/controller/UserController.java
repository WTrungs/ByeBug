package com.group5.byebug.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group5.byebug.dto.ChangePasswordRequest;
import com.group5.byebug.dto.DeleteAccountRequest;
import com.group5.byebug.dto.ForgotPasswordRequest;
import com.group5.byebug.dto.LoginRequest;
import com.group5.byebug.dto.RegisterRequest;
import com.group5.byebug.dto.UpdateProfileRequest;
import com.group5.byebug.dto.UserProfileResponse;
import com.group5.byebug.dto.UserResponse;
import com.group5.byebug.service.UserService;
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
            return ResponseEntity.badRequest().body(new UserResponse(null, null, null, null, e.getMessage(), "USER" ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(userService.login(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new UserResponse(null, null, null, null, e.getMessage(), "USER"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<UserResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.forgotPassword(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new UserResponse(null, null, null, null, e.getMessage(), "USER"));
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        try {
            // Mapping "me" to a specific user if needed, but better to handle in FE or SecurityContext
            // For now, let FE handle it as it already does (me -> admin)
            return ResponseEntity.ok(userService.getProfile(username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        try {
            return ResponseEntity.ok(userService.getLeaderboard());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/statistics/{username}")
    public ResponseEntity<?> getStatistics(@PathVariable String username) {
        try {
            return ResponseEntity.ok(userService.getStatistics(username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{username}")
    public ResponseEntity<?> updateProfile(@PathVariable String username, @RequestBody UpdateProfileRequest request) {
        try {
            System.out.println("Updating profile for: " + username);
            return ResponseEntity.ok(userService.updateProfile(username, request));
        } catch (RuntimeException e) {
            System.err.println("Update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/change-password/{username}")
    public ResponseEntity<?> changePassword(@PathVariable String username, @RequestBody ChangePasswordRequest request) {
        try {
            System.out.println("Changing password for: " + username);
            userService.changePassword(username, request);
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteAccount(@PathVariable String username, @RequestBody DeleteAccountRequest request) {
        try {
            System.out.println("Deleting account for: " + username);
            userService.deleteAccount(username, request);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (RuntimeException e) {
            System.err.println("Account deletion failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}