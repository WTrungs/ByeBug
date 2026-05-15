package com.group5.byebug.service;

import com.group5.byebug.dto.AdminProblemPageResponse;
import com.group5.byebug.dto.AdminProblemRequest;
import com.group5.byebug.dto.AdminProblemResponse;
import com.group5.byebug.dto.ProblemResponseDTO;
import com.group5.byebug.entity.Problem;
import com.group5.byebug.enums.Difficulty;
import com.group5.byebug.repository.ProblemRepository;
import com.group5.byebug.repository.SubmissionRepository;
import com.group5.byebug.repository.TagRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AdminProblemServiceTest {
    private final ProblemRepository problemRepository = mock(ProblemRepository.class);
    private final SubmissionRepository submissionRepository = mock(SubmissionRepository.class);
    private final TagRepository tagRepository = mock(TagRepository.class);
    private final AdminProblemService adminProblemService = new AdminProblemService(problemRepository, submissionRepository, tagRepository);

    @Test
    @SuppressWarnings("unchecked")
    void listProblemsReturnsPagedRealData() {
        Problem problem = problem(1L, "Two Sum", true);
        when(problemRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(problem)));
        when(submissionRepository.findStatsByProblemIds(List.of(1L))).thenReturn(List.of());

        AdminProblemPageResponse response = adminProblemService.listProblems(0, 10, "two", "EASY", "public", null);

        assertEquals(1, response.getTotalElements());
        assertEquals("Two Sum", response.getContent().getFirst().getTitle());
        assertEquals(0L, response.getContent().getFirst().getTotalSubmissions());
    }

    @Test
    void setVisibilityHidesProblemInsteadOfDeletingIt() {
        Problem problem = problem(1L, "Two Sum", true);
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));
        when(problemRepository.save(problem)).thenReturn(problem);

        AdminProblemResponse response = adminProblemService.setVisibility(1L, false);

        assertFalse(response.getIsPublic());
        verify(problemRepository).save(problem);
    }

    @Test
    void rejectsInvalidDifficultyFilter() {
        assertThrows(RuntimeException.class, () ->
                adminProblemService.listProblems(0, 10, null, "IMPOSSIBLE", "all", null)
        );
    }

    @Test
    void createProblemWorksWithoutTestsUpload() {
        AdminProblemRequest request = request();
        when(problemRepository.save(any(Problem.class))).thenAnswer(invocation -> {
            Problem saved = invocation.getArgument(0);
            saved.setProblemId(7L);
            return saved;
        });

        ProblemResponseDTO response = adminProblemService.createProblem(request);

        assertEquals(7L, response.getProblemId());
        assertEquals("Two Sum", response.getTitle());
        verify(problemRepository).save(any(Problem.class));
    }

    private Problem problem(Long id, String title, boolean isPublic) {
        Problem problem = new Problem();
        problem.setProblemId(id);
        problem.setTitle(title);
        problem.setDescription("Description");
        problem.setDifficulty(Difficulty.EASY);
        problem.setIsPublic(isPublic);
        problem.setTags(new java.util.HashSet<>());
        problem.setExamples(new ArrayList<>());
        return problem;
    }

    private AdminProblemRequest request() {
        AdminProblemRequest request = new AdminProblemRequest();
        request.setTitle("Two Sum");
        request.setDescription("Description");
        request.setDifficulty(Difficulty.EASY);
        request.setTimeLimitMs(1000);
        request.setMemoryLimitKb(262144);
        request.setIsPublic(false);
        request.setTags(List.of());
        request.setExamples(List.of());
        return request;
    }
}
