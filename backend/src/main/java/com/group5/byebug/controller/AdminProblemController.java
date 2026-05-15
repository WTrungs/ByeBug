package com.group5.byebug.controller;

import com.group5.byebug.dto.AdminProblemPageResponse;
import com.group5.byebug.dto.AdminProblemRequest;
import com.group5.byebug.dto.AdminProblemResponse;
import com.group5.byebug.dto.AdminProblemVisibilityRequest;
import com.group5.byebug.service.AdminProblemService;
import com.group5.byebug.service.TestcaseUploadService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/problems")
public class AdminProblemController {
    private final AdminProblemService adminProblemService;
    private final TestcaseUploadService testcaseUploadService;

    public AdminProblemController(
            AdminProblemService adminProblemService,
            TestcaseUploadService testcaseUploadService
    ) {
        this.adminProblemService = adminProblemService;
        this.testcaseUploadService = testcaseUploadService;
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

    @GetMapping("/{problemId}")
    public ResponseEntity<?> getProblem(@PathVariable Long problemId) {
        return ResponseEntity.ok(adminProblemService.getProblem(problemId));
    }

    @PostMapping
    public ResponseEntity<?> createProblem(@Valid @RequestBody AdminProblemRequest request) {
        return ResponseEntity.ok(adminProblemService.createProblem(request));
    }

    @PutMapping("/{problemId}")
    public ResponseEntity<?> updateProblem(
            @PathVariable Long problemId,
            @Valid @RequestBody AdminProblemRequest request
    ) {
        return ResponseEntity.ok(adminProblemService.updateProblem(problemId, request));
    }

    @PostMapping("/{problemId}/tests")
    public ResponseEntity<?> uploadTests(
            @PathVariable Long problemId,
            @RequestParam("file") MultipartFile file
    ) {
        adminProblemService.getProblem(problemId);
        String objectKey = testcaseUploadService.uploadTestsZip(problemId, file);
        return ResponseEntity.ok(Map.of(
                "message", "Upload tests.zip thành công",
                "objectKey", objectKey
        ));
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
