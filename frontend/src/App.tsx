import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';


function App() {
  const location = useLocation();
  const hideNavbar=location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register';
  return (
    <div style={{ background: 'lightblue', color: 'black', minHeight: '100vh', padding: '20px' }}>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
      </Routes>
    </div>
  );
}

export default App;