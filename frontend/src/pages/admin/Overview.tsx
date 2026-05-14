import React, { useEffect, useState } from 'react';
import AdminStatsCards from '../../components/StatCard';
import SystemHealthChart from '../../components/SystemHealthChart';
import ActivityLog from '../../components/ActivityLog';
import { getAdminOverview, type AdminOverview } from '../../api/adminApi';

const Overview: React.FC = () => {
    const [overview, setOverview] = useState<AdminOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        getAdminOverview()
            .then((data) => {
                if (!mounted) return;
                setOverview(data);
                setError(null);
            })
            .catch(() => {
                if (!mounted) return;
                setError('Không tải được thống kê hệ thống');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="overview-wrapper">
            {error && (
                <div className="admin-card" style={{ marginBottom: 16, color: 'var(--admin-red)', fontWeight: 800 }}>
                    {error}
                </div>
            )}
            {loading && (
                <div className="admin-card" style={{ marginBottom: 16, fontWeight: 800 }}>
                    Đang tải dữ liệu...
                </div>
            )}
            <AdminStatsCards overview={overview} />
            <SystemHealthChart overview={overview} />
            <ActivityLog activities={overview?.recentActivities ?? []} />
        </div>
    );
};

export default Overview;
