import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/admin/Admin';
import Statistics from './pages/Statistics';
import Home from './pages/Home';

const App: React.FC = () => {
    const location = useLocation();

    const noNavbarRoutes = ['/', '/login', '/register'];
    const isAdminRoute = location.pathname.startsWith('/admin');
    const hideNavbar = noNavbarRoutes.includes(location.pathname) || isAdminRoute;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {!hideNavbar && <Navbar />}

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Routes>
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
                                <ProblemList />
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
};

export default App;