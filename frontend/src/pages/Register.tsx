import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

import bugLogo from '../assets/bug.svg';
import codeLogo from '../assets/div.svg';
import bblg from '../assets/bblogo.svg';

const Register: React.FC = () => {

    const navigate = useNavigate();

    const [fullName, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [focusedInput, setFocusedInput] = useState('');

    const [isLoginHover, setIsLoginHover] = useState(false);
    const [isSignUpHover, setIsSignUpHover] = useState(false);
    const [isLogoHover, setIsLogoHover] = useState(false);
    const [isSubmitHover, setIsSubmitHover] = useState(false);
    const [isCardHeaderHover, setIsCardHeaderHover] = useState(false);

    const handleRegister = async () => {

        if (!username || !password || !email || !fullName) {
            alert("Vui lòng điền đủ thông tin");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp");
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

            navigate('/login');

        } catch (error: any) {

            alert(
                error.response?.data?.message ||
                "Đăng ký thất bại"
            );
        }
    };

    return (

        <div style={styles.wrapper}>

            {/* HEADER */}
            <header style={styles.header}>

                <div
                    style={{
                        ...styles.logo,

                        transform: isLogoHover
                            ? 'translateY(-2px)'
                            : 'translateY(0)',

                        textShadow: isLogoHover
                            ? '4px 4px 0px #FFB338'
                            : '2px 2px 0px #FFB338'
                    }}

                    onMouseEnter={() => setIsLogoHover(true)}
                    onMouseLeave={() => setIsLogoHover(false)}
                >

                    <img
                        src={bugLogo}
                        alt="bug logo"
                        style={styles.logoIcon}
                    />

                    <span>BYEBUG</span>

                </div>

                <div style={styles.authButtons}>

                    <button
                        style={{
                            ...styles.loginBtn,

                            transform: isLoginHover
                                ? 'translate(-3px, -3px)'
                                : 'translate(0,0)',

                            boxShadow: isLoginHover
                                ? '4px 4px 0px #111'
                                : '0px 0px 0px #111'
                        }}

                        onMouseEnter={() => setIsLoginHover(true)}
                        onMouseLeave={() => setIsLoginHover(false)}

                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập
                    </button>

                    <button
                        style={{
                            ...styles.signUpHeaderBtn,

                            transform: isSignUpHover
                                ? 'translate(-3px, -3px)'
                                : 'translate(0,0)',

                            boxShadow: isSignUpHover
                                ? '4px 4px 0px #111'
                                : '0px 0px 0px #111'
                        }}

                        onMouseEnter={() => setIsSignUpHover(true)}
                        onMouseLeave={() => setIsSignUpHover(false)}
                    >
                        Đăng ký
                    </button>

                </div>

            </header>

            {/* MAIN */}
            <main style={styles.main}>

                {/* LEFT */}
                <div style={styles.contentLeft}>

                    <h1 style={styles.heroText}>
                        start from <span style={{ color: '#000' }}>BUGS</span>
                        <br />

                        <span style={{ color: '#FFB338' }}>
                            rise to PRO
                        </span>
                    </h1>

                    <p style={styles.subText}>
                        Tổng hợp bài tập lập trình từ cơ bản đến nâng cao.
                        <br />
                        Giúp bạn rèn luyện tư duy và kỹ năng giải quyết vấn đề.
                    </p>

                    <div style={styles.badge}>

                        <div style={styles.badgeIconBox}>

                            <img
                                src={codeLogo}
                                alt="code logo"
                                style={styles.badgeIcon}
                            />

                        </div>

                        <span style={styles.badgeText}>
                            10,000+ Bug đã “bay màu”
                        </span>

                    </div>

                </div>

                {/* RIGHT */}
                <div style={styles.contentRight}>

                    <div style={styles.registerCard}>

                        {/* CARD HEADER */}
                        <div
                            style={{
                                ...styles.cardHeader,

                                transform: isCardHeaderHover
                                    ? 'translateY(-2px)'
                                    : 'translateY(0)',

                                transition: '0.2s',
                            }}

                            onMouseEnter={() => setIsCardHeaderHover(true)}
                            onMouseLeave={() => setIsCardHeaderHover(false)}
                        >

                            <img
                                src={bblg}
                                alt="bblg"

                                style={{
                                    ...styles.bbogo,

                                    transform: isCardHeaderHover
                                        ? 'translateY(-2px) scale(1.03)'
                                        : 'translateY(0) scale(1)',

                                    transition: '0.2s',
                                }}
                            />

                            <h2
                                style={{
                                    ...styles.cardTitle,

                                    textShadow: isCardHeaderHover
                                        ? '4px 4px 0px #FFB338'
                                        : '2px 2px 0px #FFB338',
                                }}
                            >
                                Đăng Ký Tài Khoản
                            </h2>

                        </div>

                        {/* USERNAME + EMAIL */}
                        <div style={styles.formRow}>

                            <div style={styles.inputGroup}>

                                <label style={styles.label}>
                                    Tên người dùng
                                </label>

                                <input
                                    style={{
                                        ...styles.input,

                                        backgroundColor:
                                            focusedInput === 'username' || username
                                                ? '#FFFBEF'
                                                : '#FFF',
                                    }}

                                    placeholder="coder_01"

                                    value={username}

                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }

                                    onFocus={() =>
                                        setFocusedInput('username')
                                    }

                                    onBlur={() =>
                                        setFocusedInput('')
                                    }
                                />

                            </div>

                            <div style={styles.inputGroup}>

                                <label style={styles.label}>
                                    Email
                                </label>

                                <input
                                    style={{
                                        ...styles.input,

                                        backgroundColor:
                                            focusedInput === 'email' || email
                                                ? '#FFFBEF'
                                                : '#FFF',
                                    }}

                                    placeholder="vd@gmail.com"

                                    value={email}

                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }

                                    onFocus={() =>
                                        setFocusedInput('email')
                                    }

                                    onBlur={() =>
                                        setFocusedInput('')
                                    }
                                />

                            </div>

                        </div>
                        {/* FULL NAME */}
<div style={styles.inputGroup}>
    <label style={styles.label}>
        Họ và tên
    </label>
    <input
        style={{
            ...styles.input,
            backgroundColor:
                focusedInput === 'fullName' || fullName
                    ? '#FFFBEF'
                    : '#FFF',
        }}
        placeholder="Nguyễn Văn A"
        value={fullName}
        onChange={(e) => setFullname(e.target.value)}
        onFocus={() => setFocusedInput('fullName')}
        onBlur={() => setFocusedInput('')}
    />
</div>

                        {/* PASSWORD */}
                        <div style={styles.inputGroup}>

                            <label style={styles.label}>
                                Mật khẩu
                            </label>

                            <input
                                style={{
                                    ...styles.input,

                                    backgroundColor:
                                        focusedInput === 'password' || password
                                            ? '#FFFBEF'
                                            : '#FFF',
                                }}

                                type="password"
                                placeholder="********"

                                value={password}

                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }

                                onFocus={() =>
                                    setFocusedInput('password')
                                }

                                onBlur={() =>
                                    setFocusedInput('')
                                }
                            />

                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div style={styles.inputGroup}>

                            <label style={styles.label}>
                                Xác nhận mật khẩu
                            </label>

                            <input
                                style={{
                                    ...styles.input,

                                    backgroundColor:
                                        focusedInput === 'confirm' || confirmPassword
                                            ? '#FFFBEF'
                                            : '#FFF',
                                }}

                                type="password"
                                placeholder="********"

                                value={confirmPassword}

                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }

                                onFocus={() =>
                                    setFocusedInput('confirm')
                                }

                                onBlur={() =>
                                    setFocusedInput('')
                                }
                            />

                        </div>

                        {/* SUBMIT */}
                        <button
                            style={{
                                ...styles.submitBtn,

                                transform: isSubmitHover
                                    ? 'translate(-4px, -4px)'
                                    : 'translate(0,0)',

                                boxShadow: isSubmitHover
                                    ? '8px 8px 0px #111'
                                    : '5px 5px 0px #111',
                            }}

                            onMouseEnter={() => setIsSubmitHover(true)}
                            onMouseLeave={() => setIsSubmitHover(false)}

                            onClick={handleRegister}
                        >
                            Tạo tài khoản ➔
                        </button>

                        {/* FOOTER LINK */}
                        <div style={styles.footerLink}>

                            <p style={{ margin: 0 }}>
                                Bạn đã có tài khoản?
                            </p>

                            <button
                                style={styles.ghostBtn}
                                onClick={() => navigate('/login')}
                            >
                                Đăng Nhập
                            </button>

                        </div>

                    </div>

                </div>

            </main>

            {/* FOOTER */}
            <footer
                style={{
                    ...styles.footer,
                    justifyContent: 'center',
                    gap: '20px',
                }}
            >

                <span>ByeBug</span>
                <span>© 2026 ByeBug Team</span>

            </footer>

        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {

    wrapper: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#FDFDFD',
        fontFamily: 'sans-serif',
    },

    header: {
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        padding: '3px 30px',
        borderBottom: '2px solid #111',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        position: 'relative',
        zIndex: 10,
    },

    main: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '0 100px',

        backgroundColor: '#fff',

        backgroundImage: `
        linear-gradient(45deg, #FAF3DD 25%, transparent 25%),
        linear-gradient(-45deg, #FAF3DD 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #FAF3DD 75%),
        linear-gradient(-45deg, transparent 75%, #FAF3DD 75%)
        `,

        backgroundSize: '120px 120px',

        backgroundPosition:
            '0 0, 0 60px, 60px -60px, -60px 0px'
    },

    authButtons: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },

    loginBtn: {
        padding: '7px 20px',
        border: '2px solid #111',
        backgroundColor: '#fff',
        borderRadius: '999px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: '0.2s',
        color: '#111'
    },

    signUpHeaderBtn: {
        padding: '7px 20px',
        border: '2px solid #111',
        backgroundColor: '#FFB338',
        borderRadius: '999px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: '0.2s',
        color: '#111'
    },

    logo: {
        fontSize: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 900,
        letterSpacing: '-1px',
        color: '#111',
        cursor: 'pointer',
        userSelect: 'none',
        transition: '0.2s',
        textShadow: '2px 2px 0px #FFB338',
    },

    logoIcon: {
        width: '40px',
        height: '40px',
        objectFit: 'contain',
    },

    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '40px',
    },

    badgeIcon: {
        width: '40px',
        height: '40px',
        objectFit: 'contain',
    },

    badgeText: {
        fontSize: '15px',
        fontWeight: 500,
        color: '#111',
        lineHeight: 1,
    },

    subText: {
        fontSize: '15px',
        fontWeight: 500,
        color: '#111',
        lineHeight: 1.5,
    },

    contentLeft: {
        flex: 1
    },

    contentRight: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center'
    },

    heroText: {
        fontSize: '60px',
        fontWeight: 'bold',
        lineHeight: 1.1
    },

    registerCard: {
        backgroundColor: '#fff',
        border: '3px solid #000',
        padding: '30px',
        width: '320px',
        boxShadow: '10px 10px 0px #000',
    },

    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
    },

    cardTitle: {
        fontSize: '24px',
        fontWeight: 700,
        color: '#111',
        textShadow: '2px 2px 0px #FFB338',
        transition: '0.2s',
    },

    formRow: {
        display: 'flex',
        gap: '10px'
    },

    

    label: {
        display: 'block',
        marginBottom: '5px',
        marginTop: '18px',
        fontSize: '12px',
        fontWeight: 700,
        color: '#111',
    },

    input: {
        width: '100%',
        padding: '7px 14px',
        border: '2px solid #111',
        backgroundColor: '#FFF',
        boxSizing: 'border-box',
        fontSize: '15px',
        fontWeight: 500,
        outline: 'none',
        transition: '0.2s',
        boxShadow: '4px 4px 0px #111',
    },

    submitBtn: {
        width: '100%',
        backgroundColor: '#FFB338',
        border: '2px solid #000',
        padding: '13px',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '4px 4px 0px #000',
        marginTop: '20px',
        borderRadius: '999px',
        transition: '0.2s',
        color: '#111',
    },

    footerLink: {
        marginTop: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '18px',
        flexWrap: 'wrap',
    },

    ghostBtn: {
        border: 'none',
        background: 'transparent',
        fontWeight: 700,
        cursor: 'pointer',
        color: '#FFB338',
        fontSize: '14px',
    },

    footer: {
        height: '40px',
        borderTop: '2px solid #000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        fontSize: '13px',
        fontWeight: 600,
        color: '#111',
        backgroundColor: '#fff'
    },

    bbogo: {
        boxShadow: '3px 3px 0px #111',
        border: '2px solid #111',
        backgroundColor: '#FFB338',
    },
};

export default Register;