package com.group5.byebug.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.group5.byebug.dto.ProblemResponseDTO;
import com.group5.byebug.dto.TagDTO;
import com.group5.byebug.entity.Problem;
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
        return convertToDTO(problem);
    }

    @Override
    public List<ProblemResponseDTO> getProblemsByDifficulty(String difficulty) {
        return problemRepository.findByDifficulty(difficulty).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<ProblemResponseDTO> searchProblems(String keyword) {
        return problemRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<ProblemResponseDTO> getAllPublicProblems() {
        List<Problem> problems = problemRepository.findByIsPublicTrue(); 
        return problems.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public ProblemResponseDTO convertToDTO(Problem problem) {
        ProblemResponseDTO dto = new ProblemResponseDTO();
        dto.setProblemId(problem.getProblemId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setDifficulty(problem.getDifficulty());
        dto.setTimeLimitMs(problem.getTimeLimitMs());
        dto.setMemoryLimitMb(problem.getMemoryLimitMb());
        dto.setCreatedBy(problem.getCreator() != null ? problem.getCreator().getFullName() : "Unknown");

        Set<TagDTO> tagDTOs = problem.getTags().stream().map(tag -> {
            TagDTO tDto = new TagDTO();
            tDto.setTagId(tag.getTagId());
            tDto.setTagName(tag.getTagName());
            return tDto;
        }).collect(Collectors.toSet());

        dto.setTags(tagDTOs);
        return dto;
    }
}