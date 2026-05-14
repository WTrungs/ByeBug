package com.group5.byebug.config;

import com.group5.byebug.enums.ProgrammingLanguage;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProgrammingLanguageConverter implements AttributeConverter<ProgrammingLanguage, String> {
    @Override
    public String convertToDatabaseColumn(ProgrammingLanguage attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public ProgrammingLanguage convertToEntityAttribute(String dbData) {
        return ProgrammingLanguage.fromString(dbData);
    }
}
