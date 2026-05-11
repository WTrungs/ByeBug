import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    const location = useLocation();
    const noNavbarRoutes = ['/', '/login', '/register'];
    const hideNavbar = noNavbarRoutes.includes(location.pathname);

    return (
        <div className="app-container">
            {!hideNavbar && <Navbar />}

            <main>
                <Routes>
                    {/*ai vào cũng ok*/}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/*có tài khoản mới dc vô*/}
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
                </Routes>
            </main>
        </div>
    );
}

export default App;