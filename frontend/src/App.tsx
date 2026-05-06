import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login'
        || location.pathname === '/'
        || location.pathname === '/register';

    return (
        <div style={{ background: 'lightblue', color: 'black', minHeight: '100vh', padding: '20px' }}>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Route cần đăng nhập */}
                <Route path="/problems" element={
                    <ProtectedRoute>
                        <Problems />
                    </ProtectedRoute>
                } />
                <Route path="/problems/:id" element={
                    <ProtectedRoute>
                        <ProblemDetail />
                    </ProtectedRoute>
                } />

                {/* Ví dụ route chỉ admin — thêm sau nếu cần */}
                {/* <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                        <AdminDashboard />
                    </ProtectedRoute>
                } /> */}
            </Routes>
        </div>
    );
}

export default App;