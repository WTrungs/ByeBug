package com.byebug.judge.model;

import java.nio.file.Path;

public record TestFileSet(int order, Path inputPath, Path outputPath) {
}
