package com.group5.byebug.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.group5.byebug.entity.Submission;
import com.group5.byebug.entity.User;
import com.group5.byebug.enums.Verdict;

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

    Long countByVerdict(Verdict verdict);

    List<Submission> findAllByOrderBySubmittedAtDesc(Pageable pageable);

    @Query(
            value = """
                    SELECT
                        s.submission_id AS id,
                        s.submitted_at AS time,
                        u.username AS username,
                        p.title AS target,
                        s.verdict AS status
                    FROM submissions s
                    JOIN users u ON u.user_id = s.user_id
                    JOIN problems p ON p.problem_id = s.problem_id
                    ORDER BY s.submitted_at DESC
                    LIMIT :limit
                    """,
            nativeQuery = true
    )
    List<RecentSubmissionActivity> findRecentSubmissionActivities(@Param("limit") int limit);

    @Modifying
    @Query("DELETE FROM Submission s WHERE s.user = :user")
    void deleteByUser(@Param("user") User user);

    Long countByProblemProblemId(Long problemId);

    Long countByProblemProblemIdAndVerdict(Long problemId, Verdict verdict);

    @Query("""
            SELECT
                s.problem.problemId AS problemId,
                COUNT(s.submissionId) AS totalSubmissions,
                SUM(CASE WHEN s.verdict = com.group5.byebug.enums.Verdict.AC THEN 1 ELSE 0 END) AS acceptedSubmissions
            FROM Submission s
            WHERE s.problem.problemId IN :problemIds
            GROUP BY s.problem.problemId
            """)
    List<ProblemSubmissionStats> findStatsByProblemIds(@Param("problemIds") List<Long> problemIds);

    interface RecentSubmissionActivity {
        Long getId();
        LocalDateTime getTime();
        String getUsername();
        String getTarget();
        String getStatus();
    }

    interface ProblemSubmissionStats {
        Long getProblemId();
        Long getTotalSubmissions();
        Long getAcceptedSubmissions();
    }

    List<Submission> findTopByProblemProblemIdOrderBySubmittedAtDesc(
    Long problemId, Pageable pageable);
}
