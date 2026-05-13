<<<<<<< HEAD
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/admin/Admin";
import Statistics from "./pages/Statistics";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
=======
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
import Profile from './pages/Profile';
import Settings from './pages/Settings';
>>>>>>> eaacb0b1ab34c3e9f46a67b6b2abdf2ffea74b9c

const App: React.FC = () => {
  return (
    <div className="app-container">
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

<<<<<<< HEAD
          {/* User Routes */}
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
            path="/leaderboard"
            element={
              <ProtectedRoute userOnly>
                <Leaderboard />
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
=======
    // Thêm các đường dẫn admin vào danh sách ẩn Navbar
    // Vì Admin đã có Sidebar riêng rồi, không nên hiện Navbar chung nữa
    const hideNavbar =
        ['/', '/login', '/register'].includes(location.pathname) ||
        location.pathname.startsWith('/home') ||
        location.pathname.startsWith('/statistics') ||
        location.pathname.startsWith('/profile') ||
        location.pathname.startsWith('/settings') ||
        location.pathname.startsWith('/problems') ||
        location.pathname.startsWith('/admin');
>>>>>>> eaacb0b1ab34c3e9f46a67b6b2abdf2ffea74b9c

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

<<<<<<< HEAD
export default App;
=======
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

                    {/* Profile & Settings */}
                    <Route 
                        path="/profile/:username" 
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/settings" 
                        element={
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Catch-all route */}
                    <Route path="*" element={<Login />} />
                </Routes>

            </main>
        </div>
    );
}

export default App;
>>>>>>> eaacb0b1ab34c3e9f46a67b6b2abdf2ffea74b9c
