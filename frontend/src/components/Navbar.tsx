import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser } from "../utils/auth";
import BrandLogo from "./BrandLogo";
interface NavbarProps {
  title?: string;
  subtitle?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps>=({title, subtitle}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const user = getUser();
  const location = useLocation();

  // Lấy dữ liệu user
  const displayName = user?.username || "Bảnh";
  const avatarFallback = displayName.charAt(0).toUpperCase();
  const avatarUrl = null; // Lấy từ object user

  // Helper check active link
  const isActive = (path: string) => location.pathname === path ? "nav-link-active" : "";

  return (
    <nav className="navbar-container">
  {/* Cột 1: Logo nằm bên trái */}
  <div className="nav-section-left">
    <BrandLogo />
  </div>

  {/* Cột 2: Các nút điều hướng nằm CHÍNH GIỮA trang */}
  <div className="nav-section-center">
    <div className="nav-links">
      <Link to="/home" className={`nav-item ${isActive("/home")}`}>Trang chủ</Link>
      <Link to="/problems" className={`nav-item ${isActive("/problems")}`}>Bài tập</Link>
      <Link to="/leaderboard" className={`nav-item ${isActive("/leaderboard")}`}>Xếp hạng</Link>
      <Link to="/statistics" className={`nav-item ${isActive("/statistics")}`}>Thống kê</Link>
    </div>
  </div>

  {/* Cột 3: Nút Cài đặt, Thông báo, Avatar nằm bên phải */}
      <div className="navbar-right navbar-actions">
        {/* Nút Cài đặt */}
        <Link to="/settings" className={`nav-icon-btn ${isActive("/settings")}`} title="Cài đặt">
          <svg viewBox="0 0 24 24" className="nav-icon" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12.22 2a1.49 1.49 0 0 0-1.44 0l-1.07.62a1.49 1.49 0 0 1-2.04-.54l-.62-1.07a1.49 1.49 0 0 0-2.58 0l-.62 1.07a1.49 1.49 0 0 1-2.04.54l-1.07-.62a1.49 1.49 0 0 0-2.04 2.04l.62 1.07a1.49 1.49 0 0 1-.54 2.04l-1.07.62a1.49 1.49 0 0 0 0 2.58l1.07.62a1.49 1.49 0 0 1 .54 2.04l-.62 1.07a1.49 1.49 0 0 0 2.04 2.04l1.07-.62a1.49 1.49 0 0 1 2.04.54l.62 1.07a1.49 1.49 0 0 0 2.58 0l.62-1.07a1.49 1.49 0 0 1 2.04-.54l1.07.62a1.49 1.49 0 0 0 2.04-2.04l-.62-1.07a1.49 1.49 0 0 1 .54-2.04l1.07-.62a1.49 1.49 0 0 0 0-2.58l-1.07-.62a1.49 1.49 0 0 1-.54-2.04l.62-1.07a1.49 1.49 0 0 0-2.04-2.04Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </Link>

        {/* Thông báo */}
        <div
          className={`navbar-notification ${isNotificationOpen ? "is-open" : ""}`}
          onMouseLeave={() => setIsNotificationOpen(false)}
        >
          <button
            type="button"
            className="navbar-bell-btn"
            onClick={() => setIsNotificationOpen((isOpen) => !isOpen)}
            onMouseEnter={() => setIsNotificationOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="navbar-bell-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <div className="navbar-notification-panel">
            <div className="panel-header">Thông báo</div>
            <div className="panel-content">
               <p>Bạn chưa có thông báo mới.</p>
            </div>
          </div>
          </div>

        {/* Profile Avatar & Fallback */}
        <Link to="/profile/me" className="navbar-avatar-link" title="Hồ sơ cá nhân">
          {avatarUrl && !hasAvatarError ? (
            <img 
              src={avatarUrl} 
              alt={displayName} 
              className="navbar-avatar-img" 
              onError={() => setHasAvatarError(true)} 
            />
          ) : (
            <div className="navbar-avatar-fallback">
              {avatarFallback}
            </div>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;