package com.group5.byebug.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import com.group5.byebug.entity.Problem;
import com.group5.byebug.enums.Difficulty;


@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long>, JpaSpecificationExecutor<Problem> {
    @Override
    @EntityGraph(attributePaths = {"tags", "creator"})
    Page<Problem> findAll(Specification<Problem> specification, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Problem p LEFT JOIN FETCH p.tags")
    List<Problem> findAllWithTags();

    @Query("SELECT DISTINCT p FROM Problem p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.examples WHERE p.problemId = :id AND p.isPublic = true")
    Optional<Problem> findByIdWithTags(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM Problem p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.examples WHERE p.problemId = :id")
    Optional<Problem> findAdminByIdWithTags(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM Problem p LEFT JOIN FETCH p.tags WHERE p.difficulty = :difficulty AND p.isPublic = true")
    List<Problem> findByDifficultyWithTags(@Param("difficulty") Difficulty difficulty);

    @Query("SELECT DISTINCT p FROM Problem p LEFT JOIN FETCH p.tags WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%')) AND p.isPublic = true")
    List<Problem> findByTitleWithTags(@Param("title") String title);

    @EntityGraph(attributePaths = {"tags", "creator"})
    java.util.List<Problem> findByIsPublicTrue();
    @EntityGraph(attributePaths = {"tags", "creator"})
    java.util.List<Problem> findByIsPublicTrueAndDifficulty(Difficulty difficulty);
    @EntityGraph(attributePaths = {"tags", "creator"})
    java.util.List<Problem> findByIsPublicTrueAndTitleContainingIgnoreCase(String title);
    long countByIsPublicTrue();
    long countByIsPublicFalse();

    @Query("SELECT p FROM Problem p WHERE p.isPublic = true ORDER BY p.createdAt DESC")
    List<com.group5.byebug.entity.Problem> findLatestProblems(Pageable pageable);

    @EntityGraph(attributePaths = {"tags", "creator"})
    List<Problem> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Problem p LEFT JOIN Submission s ON p = s.problem WHERE p.isPublic = true GROUP BY p ORDER BY COUNT(s) DESC")
    List<com.group5.byebug.entity.Problem> findPopularProblems(Pageable pageable);

    @Query("SELECT p FROM Problem p LEFT JOIN Submission s ON p = s.problem GROUP BY p ORDER BY COUNT(s) DESC")
    List<com.group5.byebug.entity.Problem> findPopularAdminProblems(Pageable pageable);
}
