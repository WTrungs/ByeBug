package com.group5.byebug.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.group5.byebug.entity.TestcaseResult;

@Repository
public interface TestcaseResultRepository extends JpaRepository<TestcaseResult, Long> {
    List<TestcaseResult> findBySubmissionSubmissionIdOrderByTestcaseDisplayOrderAsc(Long submissionId);
    void deleteBySubmissionSubmissionId(Long submissionId);
}
