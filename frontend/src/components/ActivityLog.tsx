import React from 'react';

const mockLogs = [
    { id: 1, time: '2024-05-24 14:02:11', user: 'user_123',   action: 'session_login',   target: 'Auth_Server_West',  status: 'SUCCESS'     },
    { id: 2, time: '2024-05-24 14:00:45', user: 'admin_1',    action: 'problem_edit',    target: 'Bài tập #402',      status: 'PENDING'     },
    { id: 3, time: '2024-05-24 13:58:22', user: 'system_bot', action: 'db_cleanup',      target: 'Logs_Partition_04', status: 'COMPLETED'   },
    { id: 4, time: '2024-05-24 13:55:10', user: 'user_789',   action: 'submission_fail', target: 'Bài tập #101',      status: 'RUNTIME_ERR' },
];

const statusColor: Record<string, { bg: string; color: string }> = {
    SUCCESS:     { bg: '#dcfce7', color: '#16a34a' },
    COMPLETED:   { bg: '#dcfce7', color: '#16a34a' },
    PENDING:     { bg: '#fff4d6', color: '#a66a00' },
    RUNTIME_ERR: { bg: '#ffdae4', color: '#d62a4d' },
};

const ActivityLog: React.FC = () => {
    return (
        <div className="activity-log-card">
            {/* HEADER */}
            <div className="activity-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>⌨️</span>
                    <h3 className="chart-title">Nhật ký hoạt động gần đây</h3>
                </div>
                <button className="btn-act-log">
                    ● LUỒNG TRỰC TIẾP
                </button>
            </div>

            {/* TABLE */}
            <div style={{ overflowX: 'auto' }}>
                <table className="neo-grid-table">
                    <thead>
                        <tr>
                            <th>Thời gian</th>
                            <th>Người thực hiện</th>
                            <th>Hành động</th>
                            <th>Đối tượng</th>
                            <th style={{ textAlign: 'right' }}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockLogs.map((log) => {
                            const s = statusColor[log.status] ?? { bg: '#f3f4f6', color: '#374151' };
                            return (
                                <tr key={log.id}>
                                    <td className="time-cell">{log.time}</td>
                                    <td className="user-cell">{log.user}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{log.action}</td>
                                    <td>{log.target}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span
                                            className="action-badge"
                                            style={{ background: s.bg, color: s.color }}
                                        >
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityLog;