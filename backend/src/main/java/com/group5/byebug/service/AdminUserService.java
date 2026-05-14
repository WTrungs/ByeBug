package com.group5.byebug.service;

import com.group5.byebug.dto.AdminUserPageResponse;
import com.group5.byebug.dto.AdminUserResponse;
import com.group5.byebug.entity.User;
import com.group5.byebug.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class AdminUserService {
    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final int MAX_PAGE_SIZE = 100;

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AdminUserPageResponse listUsers(
            int page,
            int size,
            String search,
            String role,
            String status,
            String sort
    ) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                normalizeSize(size),
                resolveSort(sort)
        );
        Page<AdminUserResponse> users = userRepository
                .findAll(buildSpecification(search, role, status), pageable)
                .map(AdminUserResponse::from);

        return new AdminUserPageResponse(
                users.getContent(),
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getTopUsers(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 20));
        return userRepository
                .findAll(activeUserSpecification(), PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "totalScore")))
                .map(AdminUserResponse::from)
                .getContent();
    }

    public AdminUserResponse setActive(Long userId, boolean active, String currentAdminUsername) {
        User user = findUser(userId);
        assertCanManage(user, currentAdminUsername);
        user.setIsActive(active);
        if (active) {
            user.setDeletedAt(null);
        }
        return AdminUserResponse.from(userRepository.save(user));
    }

    public AdminUserResponse softDelete(Long userId, String currentAdminUsername) {
        User user = findUser(userId);
        assertCanManage(user, currentAdminUsername);
        user.setIsActive(false);
        user.setDeletedAt(LocalDateTime.now());
        return AdminUserResponse.from(userRepository.save(user));
    }

    public AdminUserResponse restore(Long userId, String currentAdminUsername) {
        User user = findUser(userId);
        assertCanManage(user, currentAdminUsername);
        user.setIsActive(true);
        user.setDeletedAt(null);
        return AdminUserResponse.from(userRepository.save(user));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void assertCanManage(User user, String currentAdminUsername) {
        // users and admins are in separate tables; no conflict possible
    }

    private int normalizeSize(int size) {
        if (size <= 0) {
            return DEFAULT_PAGE_SIZE;
        }
        return Math.min(size, MAX_PAGE_SIZE);
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        String[] parts = sort.split(",", 2);
        String property = switch (parts[0]) {
            case "username" -> "username";
            case "email" -> "email";
            case "fullName" -> "fullName";
            case "totalScore" -> "totalScore";
            case "lastLoginAt" -> "lastLoginAt";
            default -> "createdAt";
        };
        Sort.Direction direction = parts.length > 1 && "asc".equalsIgnoreCase(parts[1])
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        return Sort.by(direction, property);
    }

    private Specification<User> activeUserSpecification() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.equal(root.get("role"), "USER"),
                criteriaBuilder.isTrue(root.get("isActive")),
                criteriaBuilder.isNull(root.get("deletedAt"))
        );
    }

    private Specification<User> buildSpecification(String search, String role, String status) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String keyword = "%" + search.toLowerCase(Locale.ROOT).trim() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), keyword)
                ));
            }

            if (role != null && !role.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("role"), role.toUpperCase(Locale.ROOT)));
            }

            String normalizedStatus = status == null || status.isBlank()
                    ? ""
                    : status.toLowerCase(Locale.ROOT);
            switch (normalizedStatus) {
                case "active" -> {
                    predicates.add(criteriaBuilder.isTrue(root.get("isActive")));
                    predicates.add(criteriaBuilder.isNull(root.get("deletedAt")));
                }
                case "inactive" -> {
                    predicates.add(criteriaBuilder.isFalse(root.get("isActive")));
                    predicates.add(criteriaBuilder.isNull(root.get("deletedAt")));
                }
                case "deleted" -> predicates.add(criteriaBuilder.isNotNull(root.get("deletedAt")));
                case "all" -> {
                }
                default -> predicates.add(criteriaBuilder.isNull(root.get("deletedAt")));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
