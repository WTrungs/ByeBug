package com.group5.byebug.dto;

import com.group5.byebug.entity.Notification;
import com.group5.byebug.entity.NotificationBroadcast;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long notificationId;
    private Long broadcastId;
    private String title;
    private String content;
    private String audienceType;
    private String priority;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification n) {
        NotificationBroadcast b = n.getBroadcast();
        return new NotificationResponse(
                n.getNotificationId(),
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
