import React, { useState } from 'react';

const UserManagement: React.FC = () => {
    const [search, setSearch] = useState('');

    const users = [
        { id: 1, name: 'Sếp!', score: 2500, status: 'ONLINE', role: 'ADMIN', email: 'an.nguyen@uit.edu.vn', joinDate: '2024-01-10' },
        { id: 2, name: 'Xuân Trung', score: 2100, status: 'OFFLINE', role: 'USER', email: 'trung.x@byebug.vn', joinDate: '2024-02-15' },
        { id: 3, name: 'Minh Hoàng', score: 1850, status: 'ONLINE', role: 'USER', email: 'hoang.m@gmail.com', joinDate: '2024-03-08' },
        { id: 4, name: 'Hacker Lỏ', score: 50, status: 'BANNED', role: 'USER', email: 'hack@bug.com', joinDate: '2024-05-01' },
    ];

    const topUsers = [...users].sort((a, b) => b.score - a.score).slice(0, 3);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const rankMedals = ['🥇', '🥈', '🥉'];

    return (
        <div className="um-wrapper">

            {/* PHẦN 1: BẢNG XẾP HẠNG */}
            <div className="um-card">
                <div className="um-card-header">
                    <div className="um-header-left">
                        <span className="um-card-icon">🏆</span>
                        <h2 className="um-card-title">Bảng xếp hạng</h2>
                    </div>
                    <button className="um-view-all-btn">Hiển thị tất cả →</button>
                </div>

                <div className="um-leaderboard">
                    {topUsers.map((user, index) => (
                        <div key={user.id} className={`um-rank-item ${index === 0 ? 'um-rank-gold' : ''}`}>
                            <div className="um-rank-left">
                                <span className="um-rank-medal">{rankMedals[index]}</span>
                                <div className="um-avatar">{user.name.charAt(0).toUpperCase()}</div>
                                <div className="um-rank-info">
                                    <div className="um-rank-name">{user.name}</div>
                                    <div className="um-rank-email">{user.email}</div>
                                </div>
                            </div>
                            <div className="um-score-badge">
                                {user.score.toLocaleString()} <span className="um-pts-label">pts</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PHẦN 2: DANH SÁCH TÀI KHOẢN */}
            <div className="um-card">
                <div className="um-card-header">
                    <div className="um-header-left">
                        <h2 className="um-table-title">Danh sách tài khoản</h2>
                    </div>
                    <div className="um-search-box">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài khoản..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="um-table">
                    <thead>
                        <tr>
                            <th>Ngày tham gia</th>
                            <th>Người dùng</th>
                            <th>Vai trò</th>
                            <th>Email</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: 'center' }}>Điểm số</th>
                            <th style={{ textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((user) => (
                            <tr key={user.id}>
                                <td className="um-date-cell">{user.joinDate}</td>
                                <td className="um-user-cell">
                                    @{user.name.toLowerCase().replace(' ', '_')}
                                </td>
                                <td>
                                    <span className={`um-role-badge um-role-${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="um-email-cell">{user.email}</td>
                                <td>
                                    <span className={`um-status-badge um-status-${user.status.toLowerCase()}`}>
                                        ● {user.status}
                                    </span>
                                </td>
                                <td className="um-score-cell">{user.score.toLocaleString()}</td>
                                <td>
                                    <div className="um-actions">
                                        <button className="um-btn-edit" title="Sửa tài khoản">✏️</button>
                                        <button className="um-btn-ban" title="Cấm tài khoản">🚫</button>
                                        <button className="um-btn-delete" title="Xóa tài khoản">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                                    Không tìm thấy tài khoản nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;