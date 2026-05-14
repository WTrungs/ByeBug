package com.group5.byebug.controller;

import com.group5.byebug.dto.AdminOverviewResponse;
import com.group5.byebug.service.AdminOverviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/overview")
public class AdminOverviewController {
    private final AdminOverviewService adminOverviewService;

    public AdminOverviewController(AdminOverviewService adminOverviewService) {
        this.adminOverviewService = adminOverviewService;
    }

    @GetMapping
    public ResponseEntity<AdminOverviewResponse> getOverview() {
        return ResponseEntity.ok(adminOverviewService.getOverview());
    }
}
