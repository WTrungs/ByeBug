import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

import bugLogo from '../assets/bug.svg';
import codeLogo from '../assets/div.svg';
import bblg from '../assets/bblogo.svg';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [focusedInput, setFocusedInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        const { username, password, email, fullName, confirmPassword } = formData;
        
        if (!username || !password || !email || !fullName || !confirmPassword) {
            return alert("Vui lòng điền đủ thông tin");
        }
        
        if (password !== confirmPassword) {
            return alert("Mật khẩu xác nhận không khớp");
        }

        try {
            const response = await api.post('/users/register', { 
                username, 
                fullName, 
                email, 
                password 
            });
            alert(response.data.message);
            navigate('/login');
        } catch (error: any) {
            alert(error.response?.data?.message || "Đăng ký thất bại");
        }
    };

    return (
        <div className="wrapper">
            {/* HEADER */}
            <header className="header">
                <div className="logo-container" onClick={() => navigate('/')}>
                    <img src={bugLogo} alt="bug logo" className="logo-icon" />
                    <span>BYEBUG</span>
                </div>
                <div className="auth-buttons">
                    <button className="btn-neo-secondary" onClick={() => navigate('/login')}>Đăng nhập</button>
                    <button className="btn-neo-primary">Đăng ký</button>
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
                        Tổng hợp bài tập lập trình từ cơ bản đến nâng cao.<br />
                        Giúp bạn rèn luyện tư duy và kỹ năng giải quyết vấn đề.
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
                            <h2 className="card-title">Đăng Ký Tài Khoản</h2>
                        </div>

                        {/* ROW: USERNAME + EMAIL */}
                        <div className="form-row">
                            <div className="input-group">
                                <label className="label">Tên người dùng</label>
                                <input 
                                    name="username"
                                    className={`input-neo ${focusedInput === 'username' ? 'focused' : ''}`}
                                    placeholder="coder_01"
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('username')}
                                    onBlur={() => setFocusedInput('')}
                                />
                            </div>
                            <div className="input-group">
                                <label className="label">Email</label>
                                <input 
                                    name="email"
                                    className={`input-neo ${focusedInput === 'email' ? 'focused' : ''}`}
                                    placeholder="vd@gmail.com"
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput('')}
                                />
                            </div>
                        </div>

                        {/* FULL NAME */}
                        <div className="input-group">
                            <label className="label">Họ và tên</label>
                            <input 
                                name="fullName"
                                className={`input-neo ${focusedInput === 'fullName' ? 'focused' : ''}`}
                                placeholder="Nguyễn Văn A"
                                onChange={handleChange}
                                onFocus={() => setFocusedInput('fullName')}
                                onBlur={() => setFocusedInput('')}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="input-group">
                            <label className="label">Mật khẩu</label>
                            <input 
                                name="password"
                                type="password"
                                className={`input-neo ${focusedInput === 'password' ? 'focused' : ''}`}
                                placeholder="********"
                                onChange={handleChange}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput('')}
                            />
                        </div>

                        {/* CONFIRM PASSWORD - ĐÃ THÊM LẠI Ở ĐÂY */}
                        <div className="input-group">
                            <label className="label">Xác nhận mật khẩu</label>
                            <input 
                                name="confirmPassword"
                                type="password"
                                className={`input-neo ${focusedInput === 'confirm' ? 'focused' : ''}`}
                                placeholder="********"
                                onChange={handleChange}
                                onFocus={() => setFocusedInput('confirm')}
                                onBlur={() => setFocusedInput('')}
                            />
                        </div>

                        <button className="btn-neo-submit" onClick={handleRegister}>
                            Tạo tài khoản ➔
                        </button>

                        <div className="footer-link">
                            <span>Bạn đã có tài khoản?</span>
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

export default Register;