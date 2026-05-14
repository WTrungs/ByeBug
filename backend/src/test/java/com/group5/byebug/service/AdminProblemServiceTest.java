package com.group5.byebug.service;

import com.group5.byebug.dto.AdminProblemPageResponse;
import com.group5.byebug.dto.AdminProblemResponse;
import com.group5.byebug.entity.Problem;
import com.group5.byebug.enums.Difficulty;
import com.group5.byebug.repository.ProblemRepository;
import com.group5.byebug.repository.SubmissionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

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
    private final AdminProblemService adminProblemService = new AdminProblemService(problemRepository, submissionRepository);

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

    private Problem problem(Long id, String title, boolean isPublic) {
        Problem problem = new Problem();
        problem.setProblemId(id);
        problem.setTitle(title);
        problem.setDescription("Description");
        problem.setDifficulty(Difficulty.EASY);
        problem.setIsPublic(isPublic);
        problem.setTags(new java.util.HashSet<>());
        return problem;
    }
}
