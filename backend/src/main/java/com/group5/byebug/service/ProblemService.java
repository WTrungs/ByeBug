package com.group5.byebug.service;

import java.util.List;

import com.group5.byebug.dto.ProblemResponseDTO;
import com.group5.byebug.entity.Problem;

public interface ProblemService {

    List<ProblemResponseDTO> getAllPublicProblems();
    ProblemResponseDTO getProblemById(Long id);
    List<ProblemResponseDTO> getProblemsByDifficulty(String difficulty);
    List<ProblemResponseDTO> searchProblems(String keyword);
    ProblemResponseDTO convertToDTO(Problem problem);

}