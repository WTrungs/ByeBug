import { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Register =() => {
    const[fullName, setFullname]=useState('');
    const[email, setEmail]=useState('');
    const[username, setUsername]=useState('');
    const[password, setPassword]=useState('');

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

        <Button text="Đăng ký"/>

        <p style={{ marginTop: '20px', color: 'gray', fontSize: '12px' }}>
                Preview: {username} | {email}
            </p>

        </div>
        
    );
};
export default Register;