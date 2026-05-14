package com.group5.byebug.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProblemPageResponse {
    private List<AdminProblemResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
