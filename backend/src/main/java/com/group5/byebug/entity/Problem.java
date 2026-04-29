package com.group5.byebug.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "problem_id")
    private Long problemId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 10)
    private String difficulty;

    @Column(columnDefinition = "TEXT")
    private String[] tags;

    @Column(name = "time_limit_ms")
    private Integer timeLimitMs = 2000;

    @Column(name = "memory_limit_mb")
    private Integer memoryLimitMb = 256;

    @Column(name = "allow_file_submit")
    private Boolean allowFileSubmit = false;

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}