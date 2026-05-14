package com.group5.byebug.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "notification_broadcasts")
public class NotificationBroadcast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "broadcast_id")
    private Long broadcastId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "audience_type", nullable = false, length = 10)
    private String audienceType;

    @Column(nullable = false, length = 10)
    private String priority = "NORMAL";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_admin_id", nullable = false)
    private Admin createdByAdmin;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
