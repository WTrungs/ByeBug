import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

import bugLogo from '../assets/bug.svg';
import codeLogo from '../assets/div.svg';
import bblg from '../assets/bblogo.svg';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
            return;
        }

        try {
            const response = await api.post('/users/login', { username, password });
            localStorage.setItem('USER', JSON.stringify(response.data));

            if (response.data.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu");
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
                    <button className="btn-neo-primary">Đăng nhập</button>
                    <button className="btn-neo-secondary" onClick={() => navigate('/register')}>Đăng ký</button>
                </div>
            </header>

            {/* MAIN */}
            <main className="main-content">
                <div className="content-left">
                    <h1 className="hero-text">
                        start from <span className="text-black">BUGS</span><br />
                        <span className="text-primary">rise to PRO</span>
                    </h1>
                    <p className="sub-text">
                        Tiếp tục hành trình luyện thuật toán,<br />
                        sửa bug và nâng cấp kỹ năng lập trình của bạn.
                    </p>
                    <div className="badge-neo">
                        <div className="badge-icon-box">
                            <img src={codeLogo} alt="code logo" className="badge-icon" />
                        </div>
                        <span className="badge-text">10,000+ Bug đã “bay màu”</span>
                    </div>
                </div>

                <div className="content-right">
                    <div className="register-card">
                        <div className="card-header">
                            <img src={bblg} alt="bblg" className="bb-logo-small" />
                            <h2 className="card-title">Đăng Nhập</h2>
                        </div>

                        <div className="input-group">
                            <label className="label">Tên người dùng</label>
                            <input 
                                className={`input-neo ${focusedInput === 'username' ? 'focused' : ''}`}
                                placeholder="coder_01"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={() => setFocusedInput('username')}
                                onBlur={() => setFocusedInput('')}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>

                        <div className="input-group">
                            <label className="label">Mật khẩu</label>
                            <input 
                                type="password"
                                className={`input-neo ${focusedInput === 'password' ? 'focused' : ''}`}
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput('')}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>

                        <div className="forgot-password-container">
                            <button className="forgot-btn">Quên mật khẩu?</button>
                        </div>

                        <button className="btn-neo-submit" onClick={handleLogin}>
                            Đăng nhập ➔
                        </button>

                        <div className="footer-link">
                            <span>Chưa có tài khoản?</span>
                            <button className="ghost-btn" onClick={() => navigate('/register')}>Đăng Ký</button>
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

export default Login;