package com.group5.byebug.service;

import com.group5.byebug.dto.ForgotPasswordRequest;
import com.group5.byebug.dto.LoginRequest;
import com.group5.byebug.dto.RegisterRequest;
import com.group5.byebug.dto.UserResponse;
import com.group5.byebug.entity.User;
import com.group5.byebug.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword())); 

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser.getUserId(), savedUser.getUsername(), savedUser.getFullName(), savedUser.getEmail(), "Đăng ký thành công");
    }

    public UserResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                user.setLastLoginAt(LocalDateTime.now());
                userRepository.save(user);
                return new UserResponse(user.getUserId(), user.getUsername(), user.getFullName(), user.getEmail(), "Đăng nhập thành công");
            }
        }
        throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
    }

    public UserResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return new UserResponse(user.getUserId(), user.getUsername(), user.getFullName(), user.getEmail(), "Khôi phục mật khẩu thành công");
        }
        throw new RuntimeException("Không tìm thấy email");
    }
}