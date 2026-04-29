package com.group5.byebug.service;

import com.group5.byebug.entity.Problem;
import java.util.List;


public interface ProblemService {

    List<Problem> getAllPublicProblems();
    Problem getProblemById(Long id);
    List<Problem> getProblemsByDifficulty(String difficulty);
    List<Problem> searchProblems(String keyword);
}