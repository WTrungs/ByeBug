import { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                onClick={() => {
                    if (!username || !password) {
                        alert("Vui lòng nhập đầy đủ");
                        return;
                    }
                    console.log("Login:", { username, password });
                }}
            />
            <p style={{ marginTop: '20px', color: 'gray' }}>
                Đang nhập: {username} | Mật khẩu: {password}
            </p>
        </div>
    );
};

export default Login;