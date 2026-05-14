package com.group5.byebug.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.group5.byebug.entity.Problem;


@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    @Query("SELECT DISTINCT p FROM Problem p LEFT JOIN FETCH p.tags")
    List<Problem> findAllWithTags();

    @Query("SELECT DISTINCT p FROM Problem p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.examples WHERE p.problemId = :id")
    Optional<Problem> findByIdWithTags(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM Problem p LEFT JOIN FETCH p.tags WHERE p.difficulty = :difficulty")
    List<Problem> findByDifficultyWithTags(@Param("difficulty") String difficulty);

    @Query("SELECT DISTINCT p FROM Problem p LEFT JOIN FETCH p.tags WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Problem> findByTitleWithTags(@Param("title") String title);

    java.util.List<Problem> findByIsPublicTrue();
    java.util.List<Problem> findByDifficulty(String difficulty);
    java.util.List<Problem> findByTitleContainingIgnoreCase(String title);
}
