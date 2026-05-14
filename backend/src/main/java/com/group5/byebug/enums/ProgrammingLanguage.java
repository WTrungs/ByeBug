package com.group5.byebug.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ProgrammingLanguage {
    CPP("CPP"),
    PYTHON("PYTHON");

    private final String value;

    ProgrammingLanguage(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ProgrammingLanguage fromString(String value) {
        if (value == null) return null;
        String upperValue = value.toUpperCase();
        if (upperValue.equals("C++") || upperValue.equals("CPP")) {
            return CPP;
        }
        if (upperValue.equals("PYTHON")) {
            return PYTHON;
        }
        throw new IllegalArgumentException("Unknown programming language: " + value);
    }
}