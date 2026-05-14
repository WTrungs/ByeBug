package com.group5.byebug.dto;

import com.group5.byebug.enums.Verdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private Verdict result;
    private LocalDateTime time;
}
