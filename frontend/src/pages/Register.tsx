import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../api/axios';

const Register =() => {
    const[fullName, setFullname]=useState('');
    const[email, setEmail]=useState('');
    const[username, setUsername]=useState('');
    const[password, setPassword]=useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username || !password || !email || !fullName) {
            alert("Vui lòng điền đủ thông tin");
            return;
        }
        try {
            const response = await api.post('/users/register', {
                username,
                fullName,
                email,
                password
            });
            alert(response.data.message);
        } catch (error: any) {
            alert(error.response?.data?.message || "Đăng ký thất bại");
        }
    };

    return(
        <div style={{padding: '20px'}}>
        <h2>Regist</h2>
        <InputField
            label="Họ và tên:"
            type="text"
            value={fullName}
            placeholder="Your name"
            onChange={(e:any)=>setFullname(e.target.value)}
        />
        <InputField
            label="Email:"
            type="email"
            value={email}
            placeholder="example@gmail.com"
            onChange={(e:any)=>setEmail(e.target.value)}
        />

        <InputField
            label="Tên đăng nhập:"
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e:any)=>setUsername(e.target.value)}
        />

        <InputField
            label="Mật khẩu:"
            type="text"
            value={password}
            placeholder="Ít nhất 6 kí tự"
            onChange={(e:any)=>setPassword(e.target.value)}
        />

        <Button text="Đăng ký" onClick={handleRegister}/>

        <div style={{ marginTop: '20px' }}>
            <span style={{ color: 'gray', marginRight: '10px' }}>Bạn đã có tài khoản?</span>
            <button onClick={() => navigate('/login')} style={{ cursor: 'pointer', padding: '5px 10px' }}>
                Đăng Nhập
            </button>
        </div>

        <p style={{ marginTop: '20px', color: 'gray', fontSize: '12px' }}>
                Preview: {username} | {email}
            </p>

        </div>
    );
};

export default Register;