package com.byebug.judge.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommandResult {
    private Long exitCode;
    private String stdout;
    private String stderr;
    private boolean timeOut;

    public boolean isSuccess() {
        return exitCode == 0 && !timeOut;
    }
}