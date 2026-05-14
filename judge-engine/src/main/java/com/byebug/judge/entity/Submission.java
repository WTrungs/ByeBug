package com.byebug.judge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

    @Column(nullable = false, length = 20)
    private String language;

    @Column(name = "source_code", columnDefinition = "TEXT")
    private String sourceCode;

    @Column(nullable = false, length = 20)
    private String verdict;

    @Column(name = "compile_error", columnDefinition = "TEXT")
    private String compileError;

    @Column(name = "judge_message", columnDefinition = "TEXT")
    private String judgeMessage;

    private Integer score = 0;

    @Column(name = "total_time_ms")
    private Integer totalTimeMs;

    @Column(name = "max_memory_kb")
    private Integer maxMemoryKb;
}
