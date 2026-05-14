import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../utils/auth";

interface NavbarProps {
  title: string;
  subtitle?: ReactNode;
  hideActions?: boolean;
}

const Navbar = ({ title, subtitle, hideActions = false }: NavbarProps) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const user = getUser();
  const displayName = user?.username ?? "Người dùng";
  const avatarFallback = displayName.charAt(0).toUpperCase();
  const avatarSeed = encodeURIComponent(user?.username ?? "guest");
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  return (
    <div className="topbar user-navbar">
      <div>
        <p className="topbar-title">{title}</p>
        <p className="topbar-welcome">
          {subtitle ?? (
            <>
              Chào mừng trở lại, <strong>{displayName}</strong>.
            </>
          )}
        </p>
      </div>

      {!hideActions && (
        <div className="topbar-right navbar-actions">
          <div
            className={`navbar-notification ${isNotificationOpen ? "is-open" : ""}`}
            onMouseLeave={() => setIsNotificationOpen(false)}
          >
            <button
              type="button"
              className="navbar-bell-btn"
              aria-label="Thông báo"
              aria-expanded={isNotificationOpen}
              onClick={() => setIsNotificationOpen((isOpen) => !isOpen)}
              onMouseEnter={() => setIsNotificationOpen(true)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="navbar-bell-icon"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            <div className="navbar-notification-panel">
              <strong>Thông báo</strong>
              <p>Bạn chưa có thông báo mới.</p>
            </div>
          </div>

          <Link
            to={`/profile/${displayName}`}
            className="navbar-avatar-link"
            aria-label={`Mở hồ sơ của ${displayName}`}
            title={displayName}
          >
            {hasAvatarError ? (
              <span className="navbar-avatar-fallback">{avatarFallback}</span>
            ) : (
              <img
                src={avatarUrl}
                alt=""
                className="navbar-avatar-img"
                onError={() => setHasAvatarError(true)}
              />
            )}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
