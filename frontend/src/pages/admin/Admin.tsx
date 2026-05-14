import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Navbar from '../../components/Navbar';
import Overview from '../admin/Overview';
import UserManagement from './UserManagement';
import ProblemManagement from './ProblemManagement';
import ProblemCreate from './ProblemCreate';
import NotificationManagement from './NotificationManagement';

const Admin: React.FC = () => {
    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <main className="admin-main">
                <Navbar
                    title="HỆ THỐNG QUẢN TRỊ"
                    subtitle={<>Em chào <span className="admin-name">Sếp!</span></>}
                    hideActions
                />

                <div className="admin-content">
                    <Routes>
                        <Route index element={<Navigate to="overview" replace />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="problems" element={<ProblemManagement />} />
                        <Route path="problems/new" element={<ProblemCreate />} />
                        <Route path="notifications" element={<NotificationManagement />} />
                        <Route path="reports" element={<Navigate to="notifications" replace />} />
                        <Route path="problems/edit/:id" element={<ProblemCreate />} />
                    </Routes>
                </div>

            </main>
        </div>
    );
};

export default Admin;
