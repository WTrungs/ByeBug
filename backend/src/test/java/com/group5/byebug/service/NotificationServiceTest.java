package com.group5.byebug.service;

import com.group5.byebug.dto.CreateBroadcastRequest;
import com.group5.byebug.entity.Admin;
import com.group5.byebug.entity.Notification;
import com.group5.byebug.entity.NotificationBroadcast;
import com.group5.byebug.entity.User;
import com.group5.byebug.repository.AdminNotificationRepository;
import com.group5.byebug.repository.AdminRepository;
import com.group5.byebug.repository.NotificationBroadcastRepository;
import com.group5.byebug.repository.NotificationRepository;
import com.group5.byebug.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NotificationServiceTest {
    private final NotificationBroadcastRepository broadcastRepository = mock(NotificationBroadcastRepository.class);
    private final NotificationRepository notificationRepository = mock(NotificationRepository.class);
    private final AdminNotificationRepository adminNotificationRepository = mock(AdminNotificationRepository.class);
    private final AdminRepository adminRepository = mock(AdminRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);

    private final NotificationService notificationService = new NotificationService(
            broadcastRepository,
            notificationRepository,
            adminNotificationRepository,
            adminRepository,
            userRepository
    );

    @Test
    void createBroadcastForUsersOnlyFansOutToActiveUsers() {
        Admin admin = admin("admin123");
        User user = user("coder_01");
        when(adminRepository.findByUsername("admin123")).thenReturn(Optional.of(admin));
        when(broadcastRepository.save(any(NotificationBroadcast.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.findByIsActiveTrueAndDeletedAtIsNull()).thenReturn(List.of(user));

        notificationService.createBroadcast(request("USER", "IMPORTANT"), "admin123");

        verify(notificationRepository).saveAll(any());
        verify(adminNotificationRepository, never()).saveAll(any());
    }

    @Test
    void createBroadcastRejectsBlankContent() {
        CreateBroadcastRequest request = request("ALL", "NORMAL");
        request.setContent(" ");
        when(adminRepository.findByUsername("admin123")).thenReturn(Optional.of(admin("admin123")));

        assertThrows(RuntimeException.class, () -> notificationService.createBroadcast(request, "admin123"));
    }

    @Test
    void createBroadcastRejectsInvalidAudience() {
        when(adminRepository.findByUsername("admin123")).thenReturn(Optional.of(admin("admin123")));

        assertThrows(RuntimeException.class, () -> notificationService.createBroadcast(request("GUEST", "NORMAL"), "admin123"));
    }

    @Test
    void markUserNotificationReadThrowsWhenNotificationIsMissing() {
        when(notificationRepository.findByNotificationIdAndUserUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> notificationService.markUserNotificationRead(99L, 1L));
    }

    @Test
    void markUserNotificationReadSavesReadState() {
        Notification notification = new Notification();
        notification.setIsRead(false);
        when(notificationRepository.findByNotificationIdAndUserUserId(1L, 1L)).thenReturn(Optional.of(notification));

        notificationService.markUserNotificationRead(1L, 1L);

        assertEquals(true, notification.getIsRead());
        verify(notificationRepository).save(notification);
    }

    private CreateBroadcastRequest request(String audienceType, String priority) {
        CreateBroadcastRequest request = new CreateBroadcastRequest();
        request.setTitle("Thông báo hệ thống");
        request.setContent("Nội dung thông báo");
        request.setAudienceType(audienceType);
        request.setPriority(priority);
        return request;
    }

    private Admin admin(String username) {
        Admin admin = new Admin();
        admin.setAdminId(1L);
        admin.setUsername(username);
        admin.setFullName(username);
        admin.setEmail(username + "@example.com");
        admin.setIsActive(true);
        return admin;
    }

    private User user(String username) {
        User user = new User();
        user.setUserId(1L);
        user.setUsername(username);
        user.setFullName(username);
        user.setEmail(username + "@example.com");
        user.setIsActive(true);
        return user;
    }
}
