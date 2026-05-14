import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { getUser, isAdmin } from "../utils/auth";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationRead,
  type UserNotification,
} from "../api/notificationApi";

interface NavbarProps {
  title: string;
  subtitle?: ReactNode;
  hideActions?: boolean;
}

const Navbar = ({ title, subtitle, hideActions = false }: NavbarProps) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<UserNotification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = getUser();
  const displayName = user?.username ?? "Người dùng";
  const username = user?.username;
  const avatarFallback = displayName.charAt(0).toUpperCase();
  const avatarSeed = encodeURIComponent(user?.username ?? "guest");
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  const loadNotifications = () => {
    if (hideActions || isAdmin() || !username) return;

    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => {});

    getMyNotifications({ size: 5 })
      .then((page) => setNotifications(page.content))
      .catch(() => {});
  };

  useEffect(() => {
    loadNotifications();
  }, [hideActions, username]);

  const handleOpenNotification = async (notification: UserNotification) => {
    setSelectedNotification(notification);
    setIsNotificationOpen(false);

    if (notification.isRead) return;

    try {
      await markNotificationRead(notification.notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notification.notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      // Keep the popup open even if the read-state update fails.
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("vi-VN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const getPriorityLabel = (priority: UserNotification["priority"]) => {
    if (priority === "URGENT") return "Khẩn cấp";
    if (priority === "IMPORTANT") return "Quan trọng";
    return "Thông báo";
  };

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
              onClick={() => {
                setIsNotificationOpen((isOpen) => !isOpen);
                loadNotifications();
              }}
              onMouseEnter={() => {
                setIsNotificationOpen(true);
                loadNotifications();
              }}
              style={{ position: "relative" }}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="navbar-bell-icon">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="navbar-bell-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
              )}
            </button>

            <div className="navbar-notification-panel">
              <strong>Thông báo</strong>
              {notifications.length === 0 ? (
                <p>Bạn chưa có thông báo mới.</p>
              ) : (
                <ul className="navbar-notif-list">
                  {notifications.map((notification) => (
                    <li
                      key={notification.notificationId}
                      className={`navbar-notif-item ${notification.isRead ? "is-read" : "is-unread"}`}
                      onClick={() => handleOpenNotification(notification)}
                    >
                      <span className="navbar-notif-title">{notification.title}</span>
                      <span className="navbar-notif-time">{formatDate(notification.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
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

      {selectedNotification && (
        <div className="navbar-modal-backdrop" role="presentation" onClick={() => setSelectedNotification(null)}>
          <section
            className="navbar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-notification-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="navbar-modal-header">
              <div>
                <span className={`navbar-modal-priority navbar-modal-priority-${selectedNotification.priority.toLowerCase()}`}>
                  {getPriorityLabel(selectedNotification.priority)}
                </span>
                <h3 id="user-notification-title">{selectedNotification.title}</h3>
              </div>
              <button type="button" className="navbar-modal-close" onClick={() => setSelectedNotification(null)} aria-label="Đóng">
                ×
              </button>
            </div>
            <p className="navbar-modal-time">{formatDate(selectedNotification.createdAt)}</p>
            <p className="navbar-modal-content">{selectedNotification.content}</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default Navbar;
