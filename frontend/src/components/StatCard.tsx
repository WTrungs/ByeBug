import React from 'react';

const cards = [
    { key: 'users',    label: 'TỔNG NGƯỜI DÙNG',       value: '142,890', icon: '👥', trend: '↑ 12.4% vs tháng trước', type: 'normal' },
    { key: 'problems', label: 'BÀI TẬP CHỜ DUYỆT',     value: '12',      icon: '📝', trend: '! Giao cho bạn giải',    type: 'normal' },
    { key: 'load',     label: 'TẢI HỆ THỐNG',           value: '88%',     icon: '⚡', trend: 'Duy trì ở mức cao',     type: 'normal' },
    { key: 'alerts',   label: 'CẢNH BÁO QUAN TRỌNG',    value: '3',       icon: '🚨', trend: 'Xem chi tiết lỗi',      type: 'danger' },
];

const AdminStatsCards: React.FC = () => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '24px'
        }}>
            {cards.map((card) => (
                <div
                    key={card.key}
                    className={`admin-card ${card.type === 'danger' ? 'card-danger' : ''}`}
                >
                   
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            color: card.type === 'danger' ? 'rgba(255,255,255,0.8)' : '#888',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                        }}>
                            {card.label}
                        </span>
                        <div className="stat-icon-box"
                            style={card.type === 'danger' ? {
                                background: 'rgba(255,255,255,0.2)',
                                borderColor: 'rgba(255,255,255,0.4)'
                            } : {}}
                        >
                            {card.icon}
                        </div>
                    </div>

                    {/* VALUE */}
                    <div style={{
                        fontSize: '36px',
                        fontWeight: 900,
                        margin: '10px 0 6px',
                        color: card.type === 'danger' ? 'var(--white)' : 'var(--black)',
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1,
                    }}>
                        {card.value}
                    </div>

                    {/* TREND */}
                    <div style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: card.type === 'danger' ? 'rgba(255,255,255,0.85)' : '#4ADE80',
                    }}>
                        {card.trend}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminStatsCards;