package com.group5.byebug.controller;

import com.group5.byebug.entity.Problem;
import com.group5.byebug.service.ProblemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/problems")

public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllPublicProblems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemById(id));
    }

    
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<Problem>> getByDifficulty(@PathVariable String difficulty) {
        return ResponseEntity.ok(problemService.getProblemsByDifficulty(difficulty));
    }

    
    @GetMapping("/search")
    public ResponseEntity<List<Problem>> searchProblems(@RequestParam String keyword) {
        return ResponseEntity.ok(problemService.searchProblems(keyword));
    }
}