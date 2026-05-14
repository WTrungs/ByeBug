package com.group5.byebug.service.impl;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.group5.byebug.dto.ProblemExampleDTO;
import com.group5.byebug.dto.ProblemResponseDTO;
import com.group5.byebug.dto.TagDTO;
import com.group5.byebug.entity.Problem;
import com.group5.byebug.entity.ProblemExample;
import com.group5.byebug.enums.Difficulty;
import com.group5.byebug.repository.ProblemRepository;
import com.group5.byebug.service.ProblemService;
@Service
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemServiceImpl(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public ProblemResponseDTO getProblemById(Long id) {
        Problem problem = problemRepository.findByIdWithTags(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bài toán với id: " + id));
        return convertToDTO(problem, true);
    }

    @Override
    public List<ProblemResponseDTO> getProblemsByDifficulty(String difficulty) {
        Difficulty parsedDifficulty = Difficulty.valueOf(difficulty.toUpperCase());
        return problemRepository.findByIsPublicTrueAndDifficulty(parsedDifficulty).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<ProblemResponseDTO> searchProblems(String keyword) {
        return problemRepository.findByIsPublicTrueAndTitleContainingIgnoreCase(keyword).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<ProblemResponseDTO> getAllPublicProblems() {
        List<Problem> problems = problemRepository.findByIsPublicTrue(); 
        return problems.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public ProblemResponseDTO convertToDTO(Problem problem) {
        return convertToDTO(problem, false);
    }

    private ProblemResponseDTO convertToDTO(Problem problem, boolean includeExamples) {
        ProblemResponseDTO dto = new ProblemResponseDTO();
        dto.setProblemId(problem.getProblemId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setConstraints(problem.getConstraints());
        dto.setDifficulty(problem.getDifficulty());
        dto.setTimeLimitMs(problem.getTimeLimitMs());
        dto.setMemoryLimitMb(problem.getMemoryLimitMb());
        dto.setCreatedBy(problem.getCreator() != null ? problem.getCreator().getFullName() : "Unknown");
        dto.setIsPublic(Boolean.TRUE.equals(problem.getIsPublic()));

        Set<TagDTO> tagDTOs = problem.getTags().stream().map(tag -> {
            TagDTO tDto = new TagDTO();
            tDto.setTagId(tag.getTagId());
            tDto.setTagName(tag.getTagName());
            return tDto;
        }).collect(Collectors.toSet());

        dto.setTags(tagDTOs);

        if (includeExamples && problem.getExamples() != null) {
            List<ProblemExampleDTO> exampleDTOs = problem.getExamples().stream()
                    .sorted(Comparator.comparing(
                            ProblemExample::getDisplayOrder,
                            Comparator.nullsLast(Integer::compareTo)
                    ))
                    .map(example -> {
                        ProblemExampleDTO exampleDto = new ProblemExampleDTO();
                        exampleDto.setExampleId(example.getExampleId());
                        exampleDto.setInput(example.getInput());
                        exampleDto.setOutput(example.getOutput());
                        exampleDto.setExplanation(example.getExplanation());
                        exampleDto.setDisplayOrder(example.getDisplayOrder());
                        return exampleDto;
                    })
                    .collect(Collectors.toList());
            dto.setExamples(exampleDTOs);
        }

        return dto;
    }
}
