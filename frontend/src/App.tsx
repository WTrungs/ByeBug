import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/admin/Admin';
import Leaderboard from './pages/Leaderboard';
import Statistics from './pages/Statistics';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MainLayout from './components/MainLayout';


const App: React.FC = () => {
  return (
    <div className="app-container">
      <Routes>
        {/* --- NHÓM 1: TRANG TRẮNG (LOGIN/REGISTER) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* --- NHÓM 2: TRANG CÓ SIDEBAR + NAVBAR (MAIN LAYOUT) --- */}
        <Route element={<MainLayout />}>
          
          {/* 1. Trang chủ */}
          <Route path="/home" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />

          {/* 2. Bài tập & Chi tiết bài tập */}
          <Route path="/problems" element={
            <ProtectedRoute><Problems /></ProtectedRoute>
          } />
          <Route path="/problems/:id" element={
            <ProtectedRoute><ProblemDetail /></ProtectedRoute>
          } />

          {/* 3. Thống kê cá nhân & Bảng xếp hạng */}
          <Route path="/statistics" element={
            <ProtectedRoute userOnly><Statistics /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute userOnly><Leaderboard /></ProtectedRoute>
          } />

          {/* 4. Hồ sơ & Cài đặt */}
          <Route path="/profile/:username" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><Settings /></ProtectedRoute>
          } />

          {/* 5. Quản trị viên */}
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
          } />
          
        </Route>

        {/* Mặc định nếu gõ bậy bạ thì về Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;

