package com.group5.byebug.repository;

import com.group5.byebug.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    java.util.List<Problem> findByIsPublicTrue();
    java.util.List<Problem> findByDifficulty(String difficulty);
    java.util.List<Problem> findByTitleContainingIgnoreCase(String title);
}