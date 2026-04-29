package com.group5.byebug.service.impl;

import com.group5.byebug.entity.Problem;
import com.group5.byebug.repository.ProblemRepository;
import com.group5.byebug.service.ProblemService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemServiceImpl(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public List<Problem> getAllPublicProblems() {
        return problemRepository.findByIsPublicTrue();
    }

    @Override
    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài toán với id: " + id));
    }

    @Override
    public List<Problem> getProblemsByDifficulty(String difficulty) {
        return problemRepository.findByDifficulty(difficulty);
    }

    @Override
    public List<Problem> searchProblems(String keyword) {
        return problemRepository.findByTitleContainingIgnoreCase(keyword);
    }
}