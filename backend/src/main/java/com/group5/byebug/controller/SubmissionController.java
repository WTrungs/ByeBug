package com.group5.byebug.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group5.byebug.dto.SubmissionRequest;
import com.group5.byebug.dto.SubmissionResultResponse;
import com.group5.byebug.service.SubmissionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<SubmissionResultResponse> submit(@Valid @RequestBody SubmissionRequest request) {
        return ResponseEntity.ok(submissionService.submit(request));
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionResultResponse> getResult(@PathVariable Long submissionId) {
        return ResponseEntity.ok(submissionService.getResult(submissionId));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<SubmissionResultResponse>> getRecentSubmissions(
        @RequestParam Long problemId,
        @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(submissionService.getRecentSubmissions(problemId, limit));
    }

    @PatchMapping("/admin/{submissionId}/rejudge")
    public ResponseEntity<SubmissionResultResponse> rejudge(
        @PathVariable Long submissionId) {
    return ResponseEntity.ok(submissionService.rejudge(submissionId));
    }

    @PatchMapping("/admin/{submissionId}/accept")
    public ResponseEntity<SubmissionResultResponse> manualAccept(
        @PathVariable Long submissionId) {
    return ResponseEntity.ok(submissionService.manualAccept(submissionId));
    }
}
