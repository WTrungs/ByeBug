package com.group5.byebug.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group5.byebug.dto.ProblemResponseDTO;
import com.group5.byebug.entity.Problem;
import com.group5.byebug.service.ProblemService;
@RestController
@RequestMapping("/api/problems")

public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    public ResponseEntity<List<ProblemResponseDTO>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllPublicProblems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemResponseDTO> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemById(id));
    }

    
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<ProblemResponseDTO>> getByDifficulty(@PathVariable String difficulty) {
        return ResponseEntity.ok(problemService.getProblemsByDifficulty(difficulty));
    }

    
    @GetMapping("/search")
    public ResponseEntity<List<ProblemResponseDTO>> searchProblems(@RequestParam String keyword) {
        return ResponseEntity.ok(problemService.searchProblems(keyword));
    }
}