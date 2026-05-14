package com.group5.byebug.controller;

import com.group5.byebug.dto.HomeSummaryResponse;
import com.group5.byebug.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/summary")
    public ResponseEntity<HomeSummaryResponse> getHomeSummary(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(homeService.getHomeSummary(username));
    }
}
