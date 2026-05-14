package com.group5.byebug.service;

import com.group5.byebug.dto.AdminUserResponse;
import com.group5.byebug.entity.User;
import com.group5.byebug.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AdminUserServiceTest {
    private final UserRepository userRepository = mock(UserRepository.class);
    private final AdminUserService adminUserService = new AdminUserService(userRepository);

    @Test
    void setActiveCanDeactivateNormalUser() {
        User user = user("coder_01", "USER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        AdminUserResponse response = adminUserService.setActive(1L, false, "admin123");

        assertFalse(response.getIsActive());
        assertEquals("INACTIVE", response.getStatus());
        verify(userRepository).save(user);
    }

    @Test
    void softDeleteKeepsUserRowAndMarksDeleted() {
        User user = user("coder_01", "USER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        AdminUserResponse response = adminUserService.softDelete(1L, "admin123");

        assertFalse(response.getIsActive());
        assertNotNull(response.getDeletedAt());
        assertEquals("DELETED", response.getStatus());
        verify(userRepository).save(user);
    }

    @Test
    void restoreDeletedUserClearsDeletedAtAndActivatesUser() {
        User user = user("coder_01", "USER");
        user.setIsActive(false);
        user.setDeletedAt(java.time.LocalDateTime.now());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        AdminUserResponse response = adminUserService.restore(1L, "admin123");

        assertTrue(response.getIsActive());
        assertNull(response.getDeletedAt());
        assertEquals("ACTIVE", response.getStatus());
        verify(userRepository).save(user);
    }

    @Test
    void rejectsManagingCurrentAdminAccount() {
        User user = user("admin123", "ADMIN");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> adminUserService.softDelete(1L, "admin123"));
    }

    @Test
    void rejectsManagingAnyAdminAccount() {
        User user = user("other_admin", "ADMIN");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> adminUserService.setActive(1L, false, "admin123"));
    }

    private User user(String username, String role) {
        User user = new User();
        user.setUserId(1L);
        user.setUsername(username);
        user.setFullName(username);
        user.setEmail(username + "@example.com");
        user.setRole(role);
        user.setIsActive(true);
        user.setTotalScore(100);
        return user;
    }
}
