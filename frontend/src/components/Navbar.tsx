import { Link, useLocation, useNavigate } from 'react-router-dom';
import bugLogo from '../assets/bug.svg';
import { useState, useEffect } from 'react';

const Navbar = () => {
<<<<<<< Updated upstream
  return (
    <nav style={{
      display: 'flex',
      gap: '20px',
      padding: '15px 20px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e4e7',
      alignItems: 'center'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#aa3bff', marginRight: 'auto' }}>
        ByeBug
      </div>

      {/*chuyển trang bằng link */}
      <Link to="/problems" style={{ textDecoration: 'none', color: '#6b6375' }}>Problems</Link>
      <Link to="/ranking" style={{ textDecoration: 'none', color: '#6b6375' }}>Ranking</Link>

      <Link to="/login" style={{
        padding: '8px 16px',
        borderRadius: '6px',
        backgroundColor: 'purple',
        color: '#fff',
        textDecoration: 'none'
      }}>Logout</Link>
    </nav>
  );
=======
    const location = useLocation();
    const navigate = useNavigate();
    
    // 1. Khai báo state để chứa username
    const [username, setUsername] = useState<string>('Guest');

    // 2. Lấy username từ localStorage khi component load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                // Lấy trường username từ JSON trong Database của bạn
                setUsername(user.username || 'User'); 
            } catch (error) {
                console.error("Lỗi parse user data:", error);
            }
        }
    }, []);

    const isActive = (path: string) => location.pathname === path;

    // Hàm xử lý Logout
    const handleLogout = () => {
        localStorage.removeItem('user'); // Xóa dữ liệu user
        navigate('/login'); // Đá về trang login
    };

    return (
        <header className="header">
            <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <img src={bugLogo} alt="bug logo" className="logo-icon" />
                <span className="logo-text">BYEBUG</span>
            </div>

            <nav className="prob-nav">
                <Link 
                    to="/problems" 
                    className={`prob-nav__link ${isActive('/problems') ? 'prob-nav__link--active' : ''}`}
                >
                    Bài tập
                </Link>
                
                <Link 
                    to="/leaderboard" 
                    className={`prob-nav__link ${isActive('/leaderboard') ? 'prob-nav__link--active' : ''}`}
                >
                    Xếp hạng
                </Link>
            </nav>

            <div className="auth-buttons">
                <button className="btn-neo-secondary">🔔</button>
                
                {/* 3. Hiển thị username động và dẫn vào Profile */}
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <button className="btn-neo-primary" title="Vào trang cá nhân">
                        {username}
                    </button>
                </Link>
                
                <button 
                    className="btn-neo-black" 
                    onClick={handleLogout}
                    style={{ marginLeft: '10px' }}
                >
                    Logout
                </button>
            </div>
        </header>
    );
>>>>>>> Stashed changes
};

export default Navbar;