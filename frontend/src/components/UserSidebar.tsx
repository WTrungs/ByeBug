import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import BrandLogo from "./BrandLogo";
import s from "../styles/modules/UserSidebar.module.css";
import "../index.css";

const menuItems = [
  { key: "home", label: "Home", icon: "", path: "/home" },
  { key: "statistics", label: "Statistics", icon: "", path: "/statistics" },
  { key: "problems", label: "Problems", icon: "", path: "/problems" },
  { key: "profile", label: "Profile", icon: "", path: "/profile/me" },
  { key: "settings", label: "Settings", icon: "", path: "/settings" },
  { key: "leaderboard", label: "Leaderboard", icon: "", path: "/leaderboard" },
  { key: "submission", label: "Submission", icon: "", path: null },
];

const UserSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [hasAvatarError, setHasAvatarError] = useState(false);

  const displayName = user?.username ?? "Người dùng";
  const avatarFallback = displayName.charAt(0).toUpperCase();
  const avatarSeed = encodeURIComponent(user?.username ?? "guest");
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  const activeKey =
    location.pathname === "/home"
      ? "home"
      : location.pathname === "/statistics"
        ? "statistics"
        : location.pathname.startsWith("/problems")
          ? "problems"
          : location.pathname.startsWith("/profile")
            ? "profile"
            : location.pathname === "/settings"
              ? "settings"
              : location.pathname.startsWith("/leaderboard")
                ? "leaderboard"
                : "";

  const handleLogout = () => {
    localStorage.removeItem("USER");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo" style={{ padding: "16px 18px" }}>
        <BrandLogo onClick={() => navigate("/home")} />
      </div>

      <nav className="menu">
        {menuItems.map((item) => {
          const disabled = item.path === null;
          const isActive = activeKey === item.key;

          return (
            <div
              key={item.key}
              className={`menu-item ${isActive ? "active" : ""} ${disabled ? "disabled" : ""}`}
              onClick={() => !disabled && item.path && navigate(item.path)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
              {disabled && <span className="menu-item-soon">soon</span>}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className={s.sidebarUser}>
          <button
            type="button"
            className={s.sidebarUserCard}
            onClick={() => navigate("/profile/me")}
            title={displayName}
          >
            <div className={s.sidebarAvatar} aria-hidden="true">
              {hasAvatarError ? (
                <span className={s.sidebarAvatarFallback}>
                  {avatarFallback}
                </span>
              ) : (
                <img
                  src={avatarUrl}
                  alt=""
                  className={s.sidebarAvatarImg}
                  onError={() => setHasAvatarError(true)}
                />
              )}
            </div>
            <div className={s.sidebarUserMeta}>
              <div className={s.sidebarUsername}>{displayName}</div>
              <div className={s.sidebarRole}>{user?.role ?? ""}</div>
            </div>
          </button>

          <button
            type="button"
            className={s.sidebarLogout}
            onClick={handleLogout}
          >
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
