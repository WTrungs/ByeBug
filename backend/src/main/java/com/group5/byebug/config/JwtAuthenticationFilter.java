package com.group5.byebug.config;

import com.group5.byebug.repository.AdminRepository;
import com.group5.byebug.repository.UserRepository;
import com.group5.byebug.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository, AdminRepository adminRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());
        if (!jwtService.isTokenValid(token) || SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtService.extractUsername(token);
        String role = jwtService.extractRole(token);
        if (username == null || role == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if ("ADMIN".equals(role)) {
            adminRepository.findByUsername(username)
                    .filter(admin -> Boolean.TRUE.equals(admin.getIsActive()))
                    .ifPresent(admin -> authenticate(request, admin.getUsername(), "ADMIN"));
        } else {
            userRepository.findByUsername(username)
                    .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                    .filter(user -> user.getDeletedAt() == null)
                    .ifPresent(user -> authenticate(request, user.getUsername(), "USER"));
        }

        filterChain.doFilter(request, response);
    }

    private void authenticate(HttpServletRequest request, String username, String role) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                username,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
