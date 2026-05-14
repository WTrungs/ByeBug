package com.group5.byebug.service;

import com.group5.byebug.dto.*;
import com.group5.byebug.entity.*;
import com.group5.byebug.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final NotificationBroadcastRepository broadcastRepository;
    private final NotificationRepository notificationRepository;
    private final AdminNotificationRepository adminNotificationRepository;
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationBroadcastRepository broadcastRepository,
            NotificationRepository notificationRepository,
            AdminNotificationRepository adminNotificationRepository,
            AdminRepository adminRepository,
            UserRepository userRepository
    ) {
        this.broadcastRepository = broadcastRepository;
        this.notificationRepository = notificationRepository;
        this.adminNotificationRepository = adminNotificationRepository;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    public BroadcastResponse createBroadcast(CreateBroadcastRequest req, String adminUsername) {
        Admin admin = adminRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + adminUsername));

        NotificationBroadcast broadcast = new NotificationBroadcast();
        broadcast.setTitle(req.getTitle());
        broadcast.setContent(req.getContent());
        broadcast.setAudienceType(req.getAudienceType().toUpperCase());
        broadcast.setPriority(req.getPriority() != null ? req.getPriority().toUpperCase() : "NORMAL");
        broadcast.setCreatedByAdmin(admin);
        broadcast.setScheduledAt(req.getScheduledAt());
        NotificationBroadcast saved = broadcastRepository.save(broadcast);

        fanOut(saved);

        return BroadcastResponse.from(saved);
    }

    private void fanOut(NotificationBroadcast broadcast) {
        String audience = broadcast.getAudienceType();

        if ("ALL".equals(audience) || "USER".equals(audience)) {
            List<User> users = userRepository.findAll().stream()
                    .filter(u -> u.getDeletedAt() == null)
                    .toList();
            List<Notification> notifications = users.stream()
                    .map(u -> new Notification(broadcast, u))
                    .toList();
            notificationRepository.saveAll(notifications);
        }

        if ("ALL".equals(audience) || "ADMIN".equals(audience)) {
            List<Admin> admins = adminRepository.findByIsActiveTrue();
            List<AdminNotification> adminNotifications = admins.stream()
                    .map(a -> new AdminNotification(broadcast, a))
                    .toList();
            adminNotificationRepository.saveAll(adminNotifications);
        }
    }

    @Transactional(readOnly = true)
    public BroadcastPageResponse listBroadcasts(int page, int size) {
        Page<NotificationBroadcast> result = broadcastRepository.findAllByOrderByCreatedAtDesc(
                PageRequest.of(Math.max(page, 0), normalizeSize(size)));
        List<BroadcastResponse> content = result.getContent().stream()
                .map(BroadcastResponse::from)
                .toList();
        return new BroadcastPageResponse(content, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    public NotificationPageResponse getUserNotifications(Long userId, int page, int size) {
        Page<Notification> result = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(
                userId, PageRequest.of(Math.max(page, 0), normalizeSize(size)));
        List<NotificationResponse> content = result.getContent().stream()
                .map(NotificationResponse::from)
                .toList();
        return new NotificationPageResponse(content, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    public long getUserUnreadCount(Long userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }

    public void markUserNotificationRead(Long notificationId, Long userId) {
        notificationRepository.findByNotificationIdAndUserUserId(notificationId, userId)
                .ifPresent(n -> {
                    n.setIsRead(true);
                    notificationRepository.save(n);
                });
    }

    @Transactional(readOnly = true)
    public NotificationPageResponse getAdminInbox(Long adminId, int page, int size) {
        Page<AdminNotification> result = adminNotificationRepository.findByAdminAdminIdOrderByCreatedAtDesc(
                adminId, PageRequest.of(Math.max(page, 0), normalizeSize(size)));
        List<NotificationResponse> content = result.getContent().stream()
                .map(n -> new NotificationResponse(
                        n.getAdminNotificationId(),
                        n.getBroadcast().getBroadcastId(),
                        n.getBroadcast().getTitle(),
                        n.getBroadcast().getContent(),
                        n.getBroadcast().getAudienceType(),
                        n.getBroadcast().getPriority(),
                        n.getIsRead(),
                        n.getCreatedAt()
                ))
                .toList();
        return new NotificationPageResponse(content, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    public long getAdminUnreadCount(Long adminId) {
        return adminNotificationRepository.countByAdminAdminIdAndIsReadFalse(adminId);
    }

    public void markAdminNotificationRead(Long adminNotificationId, Long adminId) {
        adminNotificationRepository.findByAdminNotificationIdAndAdminAdminId(adminNotificationId, adminId)
                .ifPresent(n -> {
                    n.setIsRead(true);
                    adminNotificationRepository.save(n);
                });
    }

    private int normalizeSize(int size) {
        return (size <= 0 || size > 100) ? DEFAULT_PAGE_SIZE : size;
    }
}
