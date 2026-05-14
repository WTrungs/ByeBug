package com.group5.byebug.controller;

import com.group5.byebug.dto.*;
import com.group5.byebug.repository.AdminRepository;
import com.group5.byebug.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/notifications")
public class AdminNotificationController {

    private final NotificationService notificationService;
    private final AdminRepository adminRepository;

    public AdminNotificationController(NotificationService notificationService, AdminRepository adminRepository) {
        this.notificationService = notificationService;
        this.adminRepository = adminRepository;
    }

    @PostMapping
    public ResponseEntity<BroadcastResponse> create(
            @RequestBody CreateBroadcastRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(notificationService.createBroadcast(request, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<BroadcastPageResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(notificationService.listBroadcasts(page, size));
    }

    @GetMapping("/inbox")
    public ResponseEntity<NotificationPageResponse> inbox(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth
    ) {
        Long adminId = resolveAdminId(auth.getName());
        return ResponseEntity.ok(notificationService.getAdminInbox(adminId, page, size));
    }

    @PatchMapping("/inbox/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id, Authentication auth) {
        Long adminId = resolveAdminId(auth.getName());
        notificationService.markAdminNotificationRead(id, adminId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/inbox/unread-count")
    public ResponseEntity<Long> unreadCount(Authentication auth) {
        Long adminId = resolveAdminId(auth.getName());
        return ResponseEntity.ok(notificationService.getAdminUnreadCount(adminId));
    }

    private Long resolveAdminId(String username) {
        return adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"))
                .getAdminId();
    }
}
