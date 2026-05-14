package com.group5.byebug.dto;

import lombok.Data;

@Data
public class ProblemExampleDTO {
    private Long exampleId;
    private String input;
    private String output;
    private String explanation;
    private Integer displayOrder;
}
