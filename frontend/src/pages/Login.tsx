import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../api/axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ");
            return;
        }
        try {
            const response = await api.post('/users/login', { username, password });
            alert(response.data.message);
        } catch (error: any) {
            alert(error.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Login</h2>
            <InputField
                label="Tên đăng nhập:"
                type="text"
                value={username}
                placeholder="Enter here"
                onChange={(e) => setUsername(e.target.value)}
            />
            <InputField
                label="Mật khẩu:"
                type="password"
                value={password}
                placeholder="(6-15 kí tự)"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                text="Gửi"
                onClick={handleLogin}
            />

            <div style={{ marginTop: '20px' }}>
                <span style={{ color: 'gray', marginRight: '10px' }}>Bạn chưa có tài khoản?</span>
                <button onClick={() => navigate('/register')} style={{ cursor: 'pointer', padding: '5px 10px' }}>
                    Đăng Ký
                </button>
            </div>

            <p style={{ marginTop: '20px', color: 'gray' }}>
                Đang nhập: {username} | Mật khẩu: {password}
            </p>
        </div>
    );
};

export default Login;