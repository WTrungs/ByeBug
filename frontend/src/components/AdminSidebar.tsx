import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bugLogo from '../assets/bug.svg';
import '../index.css';

const menuItems = [
    { key: 'overview',  label: 'Thống kê hệ thống', icon: '📊' },
    { key: 'users',     label: 'Quản lý người dùng', icon: '👥' },
    { key: 'problems',  label: 'Ngân hàng đề bài',   icon: '📚' },
    { key: 'reports',   label: 'Báo cáo',             icon: '🚩' },
];

const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeKey = location.pathname.split('/')[2] || 'overview';

    return (
        <div className="sidebar">

            {/* LOGO */}
            <div className="sidebar-logo logo-container-admin" onClick={() => navigate('/')}>
                <img src={bugLogo} alt="bug logo" className="logo-icon"  />
                <div>
                    <div className="logo-text-admin">BYEBUG</div>
                    <div className="sidebar-logo-sub">ADMIN PANEL</div>
                </div>
            </div>

            {/* MENU */}
            <nav className="menu">
                {menuItems.map((item) => (
                    <div
                        key={item.key}
                        className={`menu-item ${activeKey === item.key ? 'active' : ''}`}
                        onClick={() => navigate(`/admin/${item.key}`)}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}

                <div style={{ padding: '16px 16px 0' }}>
                    <button
                        className="btn-neo-sub"
                        onClick={() => navigate('/admin/problems/new')}
                    >
                        ➕ Tạo bài tập mới
                    </button>
                </div>
            </nav>

            {/* LOGOUT */}
            <div className="sidebar-footer">
                <div
                    className="menu-item logout-btn"
                    onClick={() => {
                        localStorage.removeItem('USER');
                        navigate('/login');
                    }}
                >
                    <span className="menu-icon">🚪</span>
                    <span>Đăng xuất</span>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
