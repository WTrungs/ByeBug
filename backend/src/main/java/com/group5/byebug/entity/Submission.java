package com.group5.byebug.entity;

import java.time.LocalDateTime;

import com.group5.byebug.enums.ProgrammingLanguage;
import com.group5.byebug.enums.Verdict;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "submissions")
@Data
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Long submissionId;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProgrammingLanguage language;

    @Column(name = "source_code", columnDefinition = "TEXT")
    private String sourceCode;

    @Column(name = "file_url", columnDefinition = "TEXT")
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Verdict verdict = Verdict.PENDING;

    @Column(name = "compile_error", columnDefinition = "TEXT")
    private String compileError;

    @Column(name = "judge_message", columnDefinition = "TEXT")
    private String judgeMessage;

    private Integer score = 0;

    @Column(name = "total_time_ms")
    private Integer totalTimeMs;

    @Column(name = "max_memory_kb")
    private Integer maxMemoryKb;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();
}