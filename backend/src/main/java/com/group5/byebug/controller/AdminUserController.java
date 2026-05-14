package com.group5.byebug.controller;

import com.group5.byebug.dto.AdminUserActiveRequest;
import com.group5.byebug.dto.AdminUserPageResponse;
import com.group5.byebug.dto.AdminUserResponse;
import com.group5.byebug.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ResponseEntity<AdminUserPageResponse> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sort
    ) {
        return ResponseEntity.ok(adminUserService.listUsers(page, size, search, role, status, sort));
    }

    @GetMapping("/top")
    public ResponseEntity<List<AdminUserResponse>> getTopUsers(@RequestParam(defaultValue = "3") int limit) {
        return ResponseEntity.ok(adminUserService.getTopUsers(limit));
    }

    @PatchMapping("/{userId}/active")
    public ResponseEntity<?> setActive(
            @PathVariable Long userId,
            @RequestBody AdminUserActiveRequest request,
            Authentication authentication
    ) {
        if (request.getActive() == null) {
            return ResponseEntity.badRequest().body("active is required");
        }
        try {
            return ResponseEntity.ok(adminUserService.setActive(userId, request.getActive(), authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> softDelete(@PathVariable Long userId, Authentication authentication) {
        try {
            return ResponseEntity.ok(adminUserService.softDelete(userId, authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/restore")
    public ResponseEntity<?> restore(@PathVariable Long userId, Authentication authentication) {
        try {
            return ResponseEntity.ok(adminUserService.restore(userId, authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
