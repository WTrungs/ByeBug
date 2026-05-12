import React, { useState } from 'react';

const mockProblems = [
    { id: 1, title: 'Tìm kiếm nhị phân nâng cao', author: 'coder_01', diff: 'Trung bình', status: 'pending' },
    { id: 2, title: 'Đồ thị có hướng - DFS', author: 'thoang_la', diff: 'Khó', status: 'pending' },
    { id: 3, title: 'Sắp xếp nổi bọt', author: 'newbie_dev', diff: 'Dễ', status: 'pending' },
];

const ProblemApprovalTable: React.FC = () => {
    return (
        <div className="admin-card">
            <div className="card-header" style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h3 className="card-title" style={{ fontSize: '18px' }}>Xét Duyệt Bài Tập</h3>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Có 3 bài tập mới đang chờ bạn xử lý</p>
                </div>
                <button className="ghost-btn">XEM TẤT CẢ →</button>
            </div>

            <table className="neo-table">
                <thead>
                    <tr>
                        <th>TÊN BÀI</th>
                        <th>TÁC GIẢ</th>
                        <th>ĐỘ KHÓ</th>
                        <th>HÀNH ĐỘNG</th>
                    </tr>
                </thead>
                <tbody>
                    {mockProblems.map((p) => (
                        <tr key={p.id}>
                            <td style={{ fontWeight: 700 }}>{p.title}</td>
                            <td style={{ color: '#666' }}>@{p.author}</td>
                            <td>
                                <span className={`status-badge ${p.diff === 'Khó' ? 'text-danger' : 'text-warning'}`} 
                                      style={{ border: '1px solid #111', padding: '2px 6px', background: 'var(--bg-soft)' }}>
                                    {p.diff}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn-neo-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>Duyệt</button>
                                    <button className="btn-neo-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>Hủy</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProblemApprovalTable;