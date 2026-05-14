import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import type { AdminOverview } from '../api/adminApi';

type Props = {
    overview?: AdminOverview | null;
};

const chartColors = ['#fa375e', '#ffb338', '#38a169'];

const SystemHealthChart: React.FC<Props> = ({ overview }) => {
    const data = [
        { label: 'Người dùng', count: overview?.totalUsers ?? 0 },
        { label: 'Bài tập', count: overview?.totalProblems ?? 0 },
        { label: 'Lượt nộp', count: overview?.totalSubmissions ?? 0 },
    ];

    return (
        <div className="admin-card chart-card">
            <div className="chart-header">
                <div>
                    <h3 className="chart-title">THỐNG KÊ HỆ THỐNG</h3>
                    <p className="chart-subtitle">Tổng quan người dùng, bài tập và lượt nộp từ database</p>
                </div>
            </div>

            <div className="chart-wrapper system-chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }} barCategoryGap="32%">
                        <CartesianGrid strokeDasharray="4 4" stroke="#ececec" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 12, fontWeight: 900, fill: '#111' }}
                            axisLine={{ stroke: '#111', strokeWidth: 2 }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fontWeight: 800, fill: '#111' }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(250, 55, 94, 0.06)' }}
                            formatter={(value) => [Number(value).toLocaleString('vi-VN'), 'Số lượng']}
                            labelStyle={{ color: '#111', fontWeight: 900, marginBottom: 4 }}
                            contentStyle={{
                                border: '3px solid #111',
                                borderRadius: 0,
                                boxShadow: '6px 6px 0px #111',
                                fontSize: '12px',
                                fontWeight: 800,
                            }}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]} stroke="#111" strokeWidth={2}>
                            {data.map((entry, index) => (
                                <Cell key={entry.label} fill={chartColors[index]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-summary">
                {data.map((item, index) => (
                    <div className="chart-summary-chip" key={item.label}>
                        <span className="chart-summary-dot" style={{ background: chartColors[index] }} />
                        <span>{item.label}</span>
                        <strong>{item.count.toLocaleString('vi-VN')}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemHealthChart;
