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

const App: React.FC = () => {
  return (
    <div className="app-container">
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
