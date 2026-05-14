package com.group5.byebug.service;

import com.group5.byebug.dto.LoginRequest;
import com.group5.byebug.dto.UserResponse;
import com.group5.byebug.entity.User;
import com.group5.byebug.repository.SubmissionRepository;
import com.group5.byebug.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserServiceTest {
    private final UserRepository userRepository = mock(UserRepository.class);
    private final SubmissionRepository submissionRepository = mock(SubmissionRepository.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtService jwtService = new JwtService("test-secret-for-user-service", 86_400_000);
    private final UserService userService = new UserService(
            userRepository,
            submissionRepository,
            passwordEncoder,
            jwtService
    );

    @Test
    void loginReturnsTokenForActiveUser() {
        User user = activeUser("admin123", "ADMIN", "password");
        when(userRepository.findByUsername("admin123")).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        LoginRequest request = new LoginRequest();
        request.setUsername("admin123");
        request.setPassword("password");

        UserResponse response = userService.login(request);

        assertEquals("ADMIN", response.getRole());
        assertNotNull(response.getToken());
    }

    @Test
    void loginRejectsWrongPassword() {
        User user = activeUser("coder_01", "USER", "password");
        when(userRepository.findByUsername("coder_01")).thenReturn(Optional.of(user));

        LoginRequest request = new LoginRequest();
        request.setUsername("coder_01");
        request.setPassword("wrong-password");

        assertThrows(RuntimeException.class, () -> userService.login(request));
    }

    @Test
    void loginRejectsInactiveUser() {
        User user = activeUser("coder_01", "USER", "password");
        user.setIsActive(false);
        when(userRepository.findByUsername("coder_01")).thenReturn(Optional.of(user));

        LoginRequest request = new LoginRequest();
        request.setUsername("coder_01");
        request.setPassword("password");

        assertThrows(RuntimeException.class, () -> userService.login(request));
    }

    private User activeUser(String username, String role, String password) {
        User user = new User();
        user.setUserId(1L);
        user.setUsername(username);
        user.setFullName(username);
        user.setEmail(username + "@example.com");
        user.setRole(role);
        user.setIsActive(true);
        user.setPasswordHash(passwordEncoder.encode(password));
        return user;
    }
}
