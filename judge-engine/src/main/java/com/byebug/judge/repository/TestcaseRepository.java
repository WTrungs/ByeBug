package com.byebug.judge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.byebug.judge.entity.Testcase;

@Repository
public interface TestcaseRepository extends JpaRepository<Testcase, Long> {
    Optional<Testcase> findByProblemProblemIdAndDisplayOrder(Long problemId, Integer displayOrder);
}
