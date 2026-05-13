import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/admin/Admin';
import Statistics from './pages/Statistics';
import Home from './pages/Home';

const App: React.FC = () => {
    const location = useLocation();

    // Thêm các đường dẫn admin vào danh sách ẩn Navbar
    // Vì Admin đã có Sidebar riêng rồi, không nên hiện Navbar chung nữa
    const hideNavbar =
        ['/', '/login', '/register'].includes(location.pathname) ||
        location.pathname.startsWith('/home') ||
        location.pathname.startsWith('/statistics') ||
        location.pathname.startsWith('/problems') ||
        location.pathname.startsWith('/admin');

    return (
        <div className="app-container">
            {!hideNavbar && <Navbar />}

            <main>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* User Routes (Cần đăng nhập) */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute userOnly>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/statistics"
                        element={
                            <ProtectedRoute userOnly>
                                <Statistics />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/problems" 
                        element={
                            <ProtectedRoute>
                                <Problems />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/problems/:id" 
                        element={
                            <ProtectedRoute>
                                <ProblemDetail />
                            </ProtectedRoute>
                        } 
                    />

                    
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute adminOnly>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;