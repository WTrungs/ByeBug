import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../utils/auth';
import BrandLogo from './BrandLogo';
import s from '../styles/modules/UserSidebar.module.css';
import '../index.css';

const menuItems = [
    { key: 'home', label: 'Trang chủ', icon: '🏠', path: '/home' },
    { key: 'statistics', label: 'Statistics', icon: '📊', path: '/statistics' },
    { key: 'problems', label: 'Problems', icon: '📚', path: '/problems' },
    { key: 'contests', label: 'Contests', icon: '🏆', path: null },
    { key: 'leaderboard', label: 'Leaderboard', icon: '🥇', path: null },
    { key: 'submission', label: 'Submission', icon: '📄', path: null },
    { key: 'report', label: 'Report', icon: '📝', path: null },
];

const UserSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const activeKey = location.pathname === '/home' ? 'home'
        : location.pathname === '/statistics' ? 'statistics'
            : location.pathname.startsWith('/problems') ? 'problems'
                : '';

    const handleLogout = () => {
        localStorage.removeItem('USER');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="sidebar">

            {/* LOGO */}
            <div className="sidebar-logo" style={{ padding: '16px 18px' }}>
                <BrandLogo onClick={() => navigate('/home')} />
            </div>

            {/* MENU */}
            <nav className="menu">
                {menuItems.map((item) => {
                    const disabled = item.path === null;
                    const isActive = activeKey === item.key;
                    return (
                        <div
                            key={item.key}
                            className={`menu-item ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                            onClick={() => !disabled && item.path && navigate(item.path)}
                        >
                            <span className="menu-icon">{item.icon}</span>
                            <span>{item.label}</span>
                            {disabled && <span className="menu-item-soon">soon</span>}
                        </div>
                    );
                })}
            </nav>

            {/* FOOTER — User info + logout */}
            <div className="sidebar-footer">
                <div className={s.sidebarUser}>
                    <div className={s.sidebarUserRow}>
                        <div className={s.sidebarAvatar}>
                            {user?.username?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <div className={s.sidebarUsername}>{user?.username ?? 'Người dùng'}</div>
                            <div className={s.sidebarRole}>{user?.role ?? ''}</div>
                        </div>
                    </div>
                    <div className={s.sidebarLogout} onClick={handleLogout}>
                        <span>🚪</span>
                        <span>Đăng xuất</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserSidebar;
