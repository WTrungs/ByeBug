package com.group5.byebug.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateBroadcastRequest {
    private String title;
    private String content;
    private String audienceType;   // ALL | USER | ADMIN
    private String priority = "NORMAL";  // NORMAL | IMPORTANT | URGENT
    private LocalDateTime scheduledAt;
}
