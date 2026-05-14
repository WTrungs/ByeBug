package com.group5.byebug.service;

import com.group5.byebug.entity.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    @Test
    void generateTokenIncludesUserIdentityAndRole() {
        JwtService jwtService = new JwtService("test-secret-for-jwt-service", 86_400_000);
        User user = new User();
        user.setUserId(1L);
        user.setUsername("admin123");
        user.setRole("ADMIN");

        String token = jwtService.generateToken(user);

        assertTrue(jwtService.isTokenValid(token));
        assertEquals("admin123", jwtService.extractUsername(token));
        assertEquals("ADMIN", jwtService.extractRole(token));
    }

    @Test
    void invalidSignatureIsRejected() {
        JwtService jwtService = new JwtService("test-secret-for-jwt-service", 86_400_000);
        User user = new User();
        user.setUserId(2L);
        user.setUsername("coder_01");
        user.setRole("USER");

        String token = jwtService.generateToken(user);
        String tamperedToken = token.substring(0, token.length() - 2) + "xx";

        assertFalse(jwtService.isTokenValid(tamperedToken));
    }
}
