package com.group5.byebug.dto;

import com.group5.byebug.entity.NotificationBroadcast;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BroadcastResponse {
    private Long broadcastId;
    private String title;
    private String content;
    private String audienceType;
    private String priority;
    private String createdByAdminUsername;
    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt;

    public static BroadcastResponse from(NotificationBroadcast b) {
        return new BroadcastResponse(
                b.getBroadcastId(),
                b.getTitle(),
                b.getContent(),
                b.getAudienceType(),
                b.getPriority(),
                b.getCreatedByAdmin() != null ? b.getCreatedByAdmin().getUsername() : null,
                b.getScheduledAt(),
                b.getCreatedAt()
        );
    }
}
