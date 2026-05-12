package com.group5.byebug.entity;

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
@Table(name = "testcases")
@Data
public class Testcase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "testcase_id")
    private Long testcaseId;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(name = "input_path", nullable = false, columnDefinition = "TEXT")
    private String inputPath;

    @Column(name = "output_path", nullable = false, columnDefinition = "TEXT")
    private String outputPath;

    @Column(name = "is_visible")
    private Boolean isVisible = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "score_weight")
    private Integer scoreWeight = 1;
}