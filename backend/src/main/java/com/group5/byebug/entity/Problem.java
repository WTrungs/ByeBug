package com.group5.byebug.entity;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name = "problems")
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long problemId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 10)
    private String difficulty;

    @Column(name = "time_limit_ms")
    private Integer timeLimitMs = 2000;
    private Integer memoryLimitMb = 256;
    private Boolean allowFileSubmit = false;

    @Column(name = "is_public")
    private Boolean isPublic = false;   // ✅ Chỉ giữ 1 cái

    @Column(name = "required_solved")
    private Integer requiredSolved = 0;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User creator;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToMany                          // ✅ Chỉ giữ 1 cái
    @JoinTable(
        name = "problem_tags",
        joinColumns = @JoinColumn(name = "problem_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL)
    private List<Testcase> testcases;
}