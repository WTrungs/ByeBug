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
    private static final int FAN_OUT_BATCH_SIZE = 100;
    private static final List<String> ALLOWED_AUDIENCES = List.of("ALL", "USER", "ADMIN");
    private static final List<String> ALLOWED_PRIORITIES = List.of("NORMAL", "IMPORTANT", "URGENT");

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

        String title = requireText(req.getTitle(), "Tiêu đề không được để trống");
        String content = requireText(req.getContent(), "Nội dung không được để trống");
        String audienceType = normalizeEnum(req.getAudienceType(), ALLOWED_AUDIENCES, "Người nhận không hợp lệ");
        String priority = req.getPriority() == null || req.getPriority().isBlank()
                ? "NORMAL"
                : normalizeEnum(req.getPriority(), ALLOWED_PRIORITIES, "Mức độ thông báo không hợp lệ");

        NotificationBroadcast broadcast = new NotificationBroadcast();
        broadcast.setTitle(title);
        broadcast.setContent(content);
        broadcast.setAudienceType(audienceType);
        broadcast.setPriority(priority);
        broadcast.setCreatedByAdmin(admin);
        NotificationBroadcast saved = broadcastRepository.save(broadcast);

        fanOut(saved);

        return BroadcastResponse.from(saved);
    }

    private void fanOut(NotificationBroadcast broadcast) {
        String audience = broadcast.getAudienceType();

        if ("ALL".equals(audience) || "USER".equals(audience)) {
            List<User> users = userRepository.findByIsActiveTrueAndDeletedAtIsNull();
            for (int start = 0; start < users.size(); start += FAN_OUT_BATCH_SIZE) {
                List<Notification> notifications = users.subList(start, Math.min(start + FAN_OUT_BATCH_SIZE, users.size()))
                        .stream()
                        .map(u -> new Notification(broadcast, u))
                        .toList();
                notificationRepository.saveAll(notifications);
            }
        }

        if ("ALL".equals(audience) || "ADMIN".equals(audience)) {
            List<Admin> admins = adminRepository.findByIsActiveTrue();
            for (int start = 0; start < admins.size(); start += FAN_OUT_BATCH_SIZE) {
                List<AdminNotification> adminNotifications = admins.subList(start, Math.min(start + FAN_OUT_BATCH_SIZE, admins.size()))
                        .stream()
                        .map(a -> new AdminNotification(broadcast, a))
                        .toList();
                adminNotificationRepository.saveAll(adminNotifications);
            }
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
        Notification notification = notificationRepository.findByNotificationIdAndUserUserId(notificationId, userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
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
        AdminNotification notification = adminNotificationRepository.findByAdminNotificationIdAndAdminAdminId(adminNotificationId, adminId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));
        notification.setIsRead(true);
        adminNotificationRepository.save(notification);
    }

    private int normalizeSize(int size) {
        return (size <= 0 || size > 100) ? DEFAULT_PAGE_SIZE : size;
    }

    private String requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new RuntimeException(message);
        }
        return value.trim();
    }

    private String normalizeEnum(String value, List<String> allowedValues, String message) {
        if (value == null) {
            throw new RuntimeException(message);
        }

        String normalized = value.trim().toUpperCase();
        if (!allowedValues.contains(normalized)) {
            throw new RuntimeException(message);
        }
        return normalized;
    }
}
