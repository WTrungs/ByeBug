package com.group5.byebug.controller;

import com.group5.byebug.dto.AdminProblemPageResponse;
import com.group5.byebug.dto.AdminProblemResponse;
import com.group5.byebug.dto.AdminProblemVisibilityRequest;
import com.group5.byebug.service.AdminProblemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/problems")
public class AdminProblemController {
    private final AdminProblemService adminProblemService;

    public AdminProblemController(AdminProblemService adminProblemService) {
        this.adminProblemService = adminProblemService;
    }

    @GetMapping
    public ResponseEntity<AdminProblemPageResponse> listProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String visibility,
            @RequestParam(required = false) String sort
    ) {
        return ResponseEntity.ok(adminProblemService.listProblems(page, size, search, difficulty, visibility, sort));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<AdminProblemResponse>> getLatestProblems(@RequestParam(defaultValue = "3") int limit) {
        return ResponseEntity.ok(adminProblemService.getLatestProblems(limit));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<AdminProblemResponse>> getPopularProblems(@RequestParam(defaultValue = "3") int limit) {
        return ResponseEntity.ok(adminProblemService.getPopularProblems(limit));
    }

    @PatchMapping("/{problemId}/visibility")
    public ResponseEntity<?> setVisibility(
            @PathVariable Long problemId,
            @RequestBody AdminProblemVisibilityRequest request
    ) {
        if (request.getIsPublic() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "isPublic is required"));
        }
        return ResponseEntity.ok(adminProblemService.setVisibility(problemId, request.getIsPublic()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }
}
