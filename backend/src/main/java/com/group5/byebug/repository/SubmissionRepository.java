package com.group5.byebug.repository;

import com.group5.byebug.entity.Submission;
import com.group5.byebug.entity.User;
import com.group5.byebug.enums.Verdict;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    @Query("SELECT COUNT(DISTINCT s.problem.problemId) FROM Submission s WHERE s.user.userId = :userId AND s.verdict = :verdict")
    Long countDistinctProblemByUserIdAndVerdict(@Param("userId") Long userId, @Param("verdict") Verdict verdict);

    @Query("SELECT COUNT(DISTINCT s.problem.problemId) FROM Submission s WHERE s.user.userId = :userId")
    Long countDistinctProblemByUserId(@Param("userId") Long userId);

    List<Submission> findByUserOrderBySubmittedAtDesc(User user, Pageable pageable);
    List<Submission> findByUserAndSubmittedAtAfter(User user, LocalDateTime submittedAtAfter);

    Long countByUserUserIdAndVerdict(Long userId, Verdict verdict);

    Long countByUserUserId(Long userId);

    @Modifying
    @Query("DELETE FROM Submission s WHERE s.user = :user")
    void deleteByUser(@Param("user") User user);
}
