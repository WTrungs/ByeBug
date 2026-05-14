package com.byebug.judge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.byebug.judge.entity.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
}
