import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

import bugLogo from '../assets/bug.svg';
import codeLogo from '../assets/div.svg';
import bblg from '../assets/bblogo.svg';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState('');

    const handleResetPassword = async () => {
        if (!email || !newPassword || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            const response = await api.post('/users/forgot-password', { email, newPassword });
            alert(response.data.message || "Khôi phục mật khẩu thành công!");
            navigate('/login');
        } catch (error: any) {
            alert(error.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại");
        }
    };

    return (
        <div className="wrapper">
            {/* HEADER */}
            <header className="header">
                <div className="logo-container" onClick={() => navigate('/')}>
                    <img src={bugLogo} alt="bug logo" className="logo-icon" />
                    <span className="logo-text">BYEBUG</span>
                </div>
                <div className="auth-buttons">
                    <button className="btn-neo-secondary" onClick={() => navigate('/login')}>Đăng nhập</button>
                    <button className="btn-neo-secondary" onClick={() => navigate('/register')}>Đăng ký</button>
                </div>
            </header>

            {/* MAIN */}
            <main className="main-content">
                <div className="content-left">
                    <h1 className="hero-text">
                        reset your <span className="text-black">PASS</span><br />
                        <span className="text-primary">back to CODE</span>
                    </h1>
                    <p className="sub-text">
                        Đừng lo lắng, chỉ vài bước đơn giản<br />
                        để khôi phục quyền truy cập vào tài khoản của bạn.
                    </p>
                    <div className="badge-neo">
                        <div className="badge-icon-box">
                            <img src={codeLogo} alt="code logo" className="badge-icon" />
                        </div>
                        <span className="badge-text">Bảo mật & Nhanh chóng</span>
                    </div>
                </div>

                <div className="content-right">
                    <div className="register-card">
                        <div className="card-header">
                            <img src={bblg} alt="bblg" className="bb-logo-small" />
                            <h2 className="card-title">Quên Mật Khẩu</h2>
                        </div>

                        <div className="input-group">
                            <label className="label">Email đăng ký</label>
                            <input 
                                className={`input-neo ${focusedInput === 'email' ? 'focused' : ''}`}
                                placeholder="vd@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput('')}
                            />
                        </div>

                        <div className="input-group">
                            <label className="label">Mật khẩu mới</label>
                            <input 
                                type="password"
                                className={`input-neo ${focusedInput === 'newPassword' ? 'focused' : ''}`}
                                placeholder="********"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                onFocus={() => setFocusedInput('newPassword')}
                                onBlur={() => setFocusedInput('')}
                            />
                        </div>

                        <div className="input-group">
                            <label className="label">Xác nhận mật khẩu mới</label>
                            <input 
                                type="password"
                                className={`input-neo ${focusedInput === 'confirmPassword' ? 'focused' : ''}`}
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={() => setFocusedInput('confirmPassword')}
                                onBlur={() => setFocusedInput('')}
                                onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                            />
                        </div>

                        <button className="btn-neo-submit" onClick={handleResetPassword}>
                            Khôi phục mật khẩu ➔
                        </button>

                        <div className="footer-link">
                            <span>Quay lại?</span>
                            <button className="ghost-btn" onClick={() => navigate('/login')}>Đăng Nhập</button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <span>ByeBug</span>
                <span>© 2026 ByeBug Team</span>
            </footer>
        </div>
    );
};

export default ForgotPassword;
