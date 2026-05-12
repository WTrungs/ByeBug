import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Overview from '../admin/Overview';
import UserManagement from './UserManagement';
import ProblemManagement from './ProblemManagement';

const Admin: React.FC = () => {
    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <main className="admin-main">

                <header className="topbar">
                    <div className="topbar-left">
                        <h1 className="topbar-title">HỆ THỐNG QUẢN TRỊ</h1>
                        <p className="topbar-welcome">Em chào <span className="admin-name">Sếp!</span></p>
                    </div>
                    <div className="topbar-right">
                        <div className="status-live">
                            <span className="pulse-dot"></span>
                            LIVE STATUS
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <Routes>
                        <Route index element={<Navigate to="overview" replace />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="problems" element={<ProblemManagement />} />
                    </Routes>
                </div>

            </main>
        </div>
    );
};

export default Admin;