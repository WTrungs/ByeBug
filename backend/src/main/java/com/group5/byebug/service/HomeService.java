package com.group5.byebug.service;

import com.group5.byebug.dto.HomeSummaryResponse;

public interface HomeService {
    HomeSummaryResponse getHomeSummary(String username);
}
