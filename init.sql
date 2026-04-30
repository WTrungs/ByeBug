-- tkhoan admin
INSERT INTO users (username, full_name, email, password_hash, gender, role, total_score, is_active) 
VALUES (
    'admin123', 
    'Chủ Trang Web', 
    'admin123@gmail.com', 
    '$2a$10$8.UnVuG9HHgffUDAlk8q6uy5akL74U.9Tj4.1m9/Fq9.999999999', 
    'female', 
    'ADMIN',
    0, 
    true
);

-- tkhoan user
INSERT INTO users (username, full_name, email, password_hash, gender, role, total_score, is_active) 
VALUES (
    'coder_01', 
    'Người Dùng Mẫu', 
    'user@example.com', 
    '$2a$10$8.UnVuG9HHgffUDAlk8q6uy5akL74U.9Tj4.1m9/Fq9.999999999', 
    'male', 
    'USER', -- Cột role mới thêm
    150, 
    true
);