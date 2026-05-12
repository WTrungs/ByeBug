import React from 'react';
import AdminStatsCards from '../../components/StatCard';
import SystemHealthChart from '../../components/SystemHealthChart';
import ActivityLog from '../../components/ActivityLog';

const Overview: React.FC = () => {
    return (
        <div className="overview-wrapper">
            <AdminStatsCards />
            <SystemHealthChart />
            <ActivityLog />
        </div>
    );
};

export default Overview;