package com.group5.byebug.service;

import com.group5.byebug.dto.AdminProblemPageResponse;
import com.group5.byebug.dto.AdminProblemResponse;
import com.group5.byebug.entity.Problem;
import com.group5.byebug.enums.Difficulty;
import com.group5.byebug.repository.ProblemRepository;
import com.group5.byebug.repository.SubmissionRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminProblemService {
    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final int MAX_PAGE_SIZE = 100;
    private static final int DEFAULT_LIMIT = 3;
    private static final int MAX_LIMIT = 20;

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    public AdminProblemService(ProblemRepository problemRepository, SubmissionRepository submissionRepository) {
        this.problemRepository = problemRepository;
        this.submissionRepository = submissionRepository;
    }

    @Transactional(readOnly = true)
    public AdminProblemPageResponse listProblems(
            int page,
            int size,
            String search,
            String difficulty,
            String visibility,
            String sort
    ) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), normalizeSize(size), resolveSort(sort));
        Page<Problem> problems = problemRepository.findAll(
                buildSpecification(search, difficulty, visibility),
                pageable
        );
        List<AdminProblemResponse> content = toResponses(problems.getContent());

        return new AdminProblemPageResponse(
                content,
                problems.getNumber(),
                problems.getSize(),
                problems.getTotalElements(),
                problems.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public List<AdminProblemResponse> getLatestProblems(int limit) {
        return toResponses(problemRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, normalizeLimit(limit))));
    }

    @Transactional(readOnly = true)
    public List<AdminProblemResponse> getPopularProblems(int limit) {
        return toResponses(problemRepository.findPopularAdminProblems(PageRequest.of(0, normalizeLimit(limit))));
    }

    public AdminProblemResponse setVisibility(Long problemId, boolean isPublic) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));
        problem.setIsPublic(isPublic);
        return toResponse(problemRepository.save(problem), Collections.emptyMap());
    }

    private List<AdminProblemResponse> toResponses(List<Problem> problems) {
        Map<Long, SubmissionRepository.ProblemSubmissionStats> statsByProblemId = loadStats(problems);
        return problems.stream()
                .map(problem -> toResponse(problem, statsByProblemId))
                .toList();
    }

    private AdminProblemResponse toResponse(
            Problem problem,
            Map<Long, SubmissionRepository.ProblemSubmissionStats> statsByProblemId
    ) {
        SubmissionRepository.ProblemSubmissionStats stats = statsByProblemId.get(problem.getProblemId());
        long total = stats == null || stats.getTotalSubmissions() == null ? 0L : stats.getTotalSubmissions();
        long accepted = stats == null || stats.getAcceptedSubmissions() == null ? 0L : stats.getAcceptedSubmissions();
        return AdminProblemResponse.from(problem, total, accepted);
    }

    private Map<Long, SubmissionRepository.ProblemSubmissionStats> loadStats(List<Problem> problems) {
        List<Long> problemIds = problems.stream()
                .map(Problem::getProblemId)
                .toList();
        if (problemIds.isEmpty()) {
            return Collections.emptyMap();
        }
        return submissionRepository.findStatsByProblemIds(problemIds).stream()
                .collect(Collectors.toMap(SubmissionRepository.ProblemSubmissionStats::getProblemId, stats -> stats));
    }

    private Specification<Problem> buildSpecification(String search, String difficulty, String visibility) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String keyword = "%" + search.toLowerCase(Locale.ROOT).trim() + "%";
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), keyword));
            }

            if (difficulty != null && !difficulty.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("difficulty"), parseDifficulty(difficulty)));
            }

            String normalizedVisibility = visibility == null || visibility.isBlank()
                    ? "all"
                    : visibility.toLowerCase(Locale.ROOT);
            switch (normalizedVisibility) {
                case "public" -> predicates.add(criteriaBuilder.isTrue(root.get("isPublic")));
                case "hidden" -> predicates.add(criteriaBuilder.isFalse(root.get("isPublic")));
                case "all" -> {
                }
                default -> throw new RuntimeException("Trạng thái hiển thị không hợp lệ");
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Difficulty parseDifficulty(String difficulty) {
        try {
            return Difficulty.valueOf(difficulty.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Độ khó không hợp lệ");
        }
    }

    private int normalizeSize(int size) {
        if (size <= 0) {
            return DEFAULT_PAGE_SIZE;
        }
        return Math.min(size, MAX_PAGE_SIZE);
    }

    private int normalizeLimit(int limit) {
        if (limit <= 0) {
            return DEFAULT_LIMIT;
        }
        return Math.min(limit, MAX_LIMIT);
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        String[] parts = sort.split(",", 2);
        Sort.Direction direction = parts.length > 1 && "asc".equalsIgnoreCase(parts[1])
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return switch (parts[0]) {
            case "title" -> Sort.by(direction, "title");
            case "difficulty" -> Sort.by(direction, "difficulty");
            case "createdAt" -> Sort.by(direction, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
