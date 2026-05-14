package com.group5.byebug.dto;

import com.group5.byebug.entity.AdminNotification;
import com.group5.byebug.entity.NotificationBroadcast;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminNotificationResponse {
    private Long adminNotificationId;
    private Long broadcastId;
    private String title;
    private String content;
    private String audienceType;
    private String priority;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static AdminNotificationResponse from(AdminNotification n) {
        NotificationBroadcast b = n.getBroadcast();
        return new AdminNotificationResponse(
                n.getAdminNotificationId(),
                b.getBroadcastId(),
                b.getTitle(),
                b.getContent(),
                b.getAudienceType(),
                b.getPriority(),
                n.getIsRead(),
                n.getCreatedAt()
        );
    }
}
