import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const data = [
    { time: '00:00', cpu: 20, ram: 45 },
    { time: '04:00', cpu: 28, ram: 50 },
    { time: '08:00', cpu: 72, ram: 60 },
    { time: '12:00', cpu: 60, ram: 65 },
    { time: '16:00', cpu: 80, ram: 70 },
    { time: '20:00', cpu: 45, ram: 55 },
    { time: '23:59', cpu: 30, ram: 48 },
];

const SystemHealthChart: React.FC = () => {
    return (
        <div className="admin-card chart-card">
            <div className="chart-header">
                <div>
                    <h3 className="chart-title">HIỆU SUẤT HỆ THỐNG (24H)</h3>
                    <p className="chart-subtitle">So sánh tải CPU và mức sử dụng bộ nhớ RAM</p>
                </div>
            </div>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {/* Gradient cho CPU - Đỏ rực */}
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#df2828" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#df2828" stopOpacity={0.1} />
                            </linearGradient>
                            
                            <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFB338" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#FFB338" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
                        
                        <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#111' }} 
                            axisLine={{ stroke: '#111', strokeWidth: 2 }}
                        />
                        
                        <YAxis 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#111' }} 
                            axisLine={{ stroke: '#111', strokeWidth: 2 }}
                            tickFormatter={(v) => `${v}%`}
                        />

                        <Tooltip
                            contentStyle={{
                                border: '3px solid #111',
                                borderRadius: 0,
                                boxShadow: '6px 6px 0px #111',
                                fontSize: '11px',
                                fontWeight: 900
                            }}
                            formatter={(value: any, name: any) => [`${value}%`, name.toUpperCase()]}
                        />

                       
                        <Area 
                            name="RAM Usage"
                            type="monotone" 
                            dataKey="ram" 
                            stroke="#FFB338" 
                            strokeWidth={4} 
                            fill="url(#colorRam)" 
                            activeDot={{ r: 6, stroke: '#111', strokeWidth: 2 }}
                        />

                        
                        <Area 
                            name="CPU Load"
                            type="monotone" 
                            dataKey="cpu" 
                            stroke="#fa375e" 
                            strokeWidth={4} 
                            fill="url(#colorCpu)" 
                            activeDot={{ r: 6, stroke: '#111', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="chart-legend">
                <div className="legend-item">
                    <span className="dot cpu-dot"></span> CPU LOAD
                </div>
                <div className="legend-item">
                    <span className="dot ram-dot"></span> RAM USAGE
                </div>
            </div>
        </div>
    );
};

export default SystemHealthChart;