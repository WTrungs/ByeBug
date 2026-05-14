package com.byebug.judge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.byebug.judge.entity.TestcaseResult;

@Repository
public interface TestcaseResultRepository extends JpaRepository<TestcaseResult, Long> {
    void deleteBySubmissionSubmissionId(Long submissionId);
}
