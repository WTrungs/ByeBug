import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bugLogo from '../assets/bug.svg';
import '../index.css';

const menuItems = [
    { key: 'overview', label: 'Thống kê hệ thống' },
    { key: 'users', label: 'Quản lý người dùng' },
    { key: 'problems', label: 'Ngân hàng đề bài' },
    { key: 'notifications', label: 'Thông báo' },
];

const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeKey = location.pathname.split('/')[2] || 'overview';

    const handleLogout = () => {
        localStorage.removeItem('USER');
        localStorage.removeItem('user');
        localStorage.removeItem('TOKEN');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo logo-container-admin" onClick={() => navigate('/admin/overview')}>
                <img src={bugLogo} alt="bug logo" className="logo-icon" />
                <div>
                    <div className="logo-text-admin">BYEBUG</div>
                    <div className="sidebar-logo-sub">ADMIN PANEL</div>
                </div>
            </div>

            <nav className="menu">
                {menuItems.map((item) => (
                    <div
                        key={item.key}
                        className={`menu-item ${activeKey === item.key ? 'active' : ''}`}
                        onClick={() => navigate(`/admin/${item.key}`)}
                    >
                        <span>{item.label}</span>
                    </div>
                ))}

                <div style={{ padding: '16px 16px 0' }}>
                    <button
                        className="btn-neo-sub"
                        onClick={() => navigate('/admin/problems/new')}
                    >
                        + Tạo bài tập mới
                    </button>
                </div>
            </nav>

            <div className="sidebar-footer">
                <button
                    type="button"
                    className="admin-logout-btn"
                    onClick={handleLogout}
                >
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
