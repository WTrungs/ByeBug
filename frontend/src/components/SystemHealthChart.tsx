import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { AdminOverview } from '../api/adminApi';

type Props = {
    overview?: AdminOverview | null;
};

const SystemHealthChart: React.FC<Props> = ({ overview }) => {
    const data = [
        { label: 'Người dùng', count: overview?.totalUsers ?? 0 },
        { label: 'Bài tập', count: overview?.totalProblems ?? 0 },
        { label: 'Lượt nộp', count: overview?.totalSubmissions ?? 0 },
        { label: 'Bài đúng', count: overview?.acceptedSubmissions ?? 0 },
        { label: 'Chưa đúng', count: overview?.failedSubmissions ?? 0 },
    ];

    return (
        <div className="admin-card chart-card">
            <div className="chart-header">
                <div>
                    <h3 className="chart-title">THỐNG KÊ HỆ THỐNG</h3>
                    <p className="chart-subtitle">Dữ liệu tổng hợp trực tiếp từ database hiện tại</p>
                </div>
            </div>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fa375e" stopOpacity={0.65} />
                                <stop offset="95%" stopColor="#fa375e" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#111' }}
                            axisLine={{ stroke: '#111', strokeWidth: 2 }}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#111' }}
                            axisLine={{ stroke: '#111', strokeWidth: 2 }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                border: '3px solid #111',
                                borderRadius: 0,
                                boxShadow: '6px 6px 0px #111',
                                fontSize: '11px',
                                fontWeight: 900,
                            }}
                        />
                        <Area
                            name="Count"
                            type="monotone"
                            dataKey="count"
                            stroke="#fa375e"
                            strokeWidth={4}
                            fill="url(#colorCount)"
                            activeDot={{ r: 6, stroke: '#111', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-legend">
                <div className="legend-item">
                    <span className="dot cpu-dot"></span> SỐ LIỆU DB
                </div>
                <div className="legend-item">
                    <span className="dot ram-dot"></span> TỈ LỆ ĐÚNG {overview?.acceptanceRate ?? 0}%
                </div>
            </div>
        </div>
    );
};

export default SystemHealthChart;
