import React, { useCallback, useEffect, useState } from "react";
import {
  deleteAdminUser,
  getAdminUsers,
  getTopAdminUsers,
  restoreAdminUser,
  setAdminUserActive,
  type AdminUser,
} from "../../api/adminApi";

const PAGE_SIZE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toLocaleDateString("vi-VN");
};

const statusLabel: Record<AdminUser["status"], string> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Bị khóa",
  DELETED: "Đã xóa",
};

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [topUsers, setTopUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const [userPage, top] = await Promise.all([
        getAdminUsers({
          page,
          size: PAGE_SIZE,
          search: search.trim() || undefined,
          status: "all",
          sort: "totalScore,desc",
        }),
        getTopAdminUsers(3),
      ]);
      setUsers(userPage.content);
      setTopUsers(top);
      setTotalPages(userPage.totalPages);
      setTotalElements(userPage.totalElements);
      setError(null);
    } catch {
      setError("Không tải được danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = window.setTimeout(loadUsers, 250);
    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  const handleToggleActive = async (user: AdminUser) => {
    try {
      await setAdminUserActive(user.userId, !user.isActive);
      await loadUsers();
    } catch {
      setError("Không cập nhật được trạng thái tài khoản");
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Xóa mềm tài khoản @${user.username}?`)) return;
    try {
      await deleteAdminUser(user.userId);
      await loadUsers();
    } catch {
      setError("Không xóa được tài khoản này");
    }
  };

  const handleRestore = async (user: AdminUser) => {
    try {
      await restoreAdminUser(user.userId);
      await loadUsers();
    } catch {
      setError("Không khôi phục được tài khoản này");
    }
  };

  const rankLabels = ["#1", "#2", "#3"];

  return (
    <div className="um-wrapper">
      {error && (
        <div
          className="um-card"
          style={{ padding: 16, color: "var(--admin-red)", fontWeight: 800 }}
        >
          {error}
        </div>
      )}

      <div className="um-card">
        <div className="um-card-header">
          <div className="um-header-left">
            <h2 className="um-card-title">Bảng xếp hạng</h2>
          </div>
        </div>

        <div className="um-leaderboard">
          {topUsers.map((user, index) => (
            <div
              key={user.userId}
              className={`um-rank-item ${index === 0 ? "um-rank-gold" : ""}`}
            >
              <div className="um-rank-left">
                <span className="um-rank-medal">{rankLabels[index]}</span>
                <div className="um-avatar">
                  {(user.fullName || user.username).charAt(0).toUpperCase()}
                </div>
                <div className="um-rank-info">
                  <div className="um-rank-name">{user.fullName}</div>
                  <div className="um-rank-email">@{user.username}</div>
                </div>
              </div>
              <div className="um-score-badge">
                {(user.totalScore ?? 0).toLocaleString()}{" "}
                <span className="um-pts-label">pts</span>
              </div>
            </div>
          ))}
          {topUsers.length === 0 && (
            <div style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>
              Chưa có user đang hoạt động nào
            </div>
          )}
        </div>
      </div>

      <div className="um-card">
        <div className="um-card-header">
          <div className="um-header-left">
            <h2 className="um-table-title">Danh sách tài khoản</h2>
          </div>
          <div className="um-search-box">
            <input
              type="text"
              placeholder="Tìm username, tên, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>
        </div>

        <table className="um-table">
          <thead>
            <tr>
              <th>Ngày tham gia</th>
              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "center" }}>Điểm số</th>
              <th style={{ textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td className="um-date-cell">{formatDate(user.createdAt)}</td>
                <td className="um-user-cell">
                  @{user.username}
                  <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>
                    {user.fullName}
                  </div>
                </td>
                <td>
                  <span
                    className={`um-role-badge um-role-${user.role.toLowerCase()}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="um-email-cell">{user.email}</td>
                <td>
                  <span
                    className={`um-status-badge um-status-${user.status.toLowerCase()}`}
                  >
                    {statusLabel[user.status]}
                  </span>
                </td>
                <td className="um-score-cell">
                  {(user.totalScore ?? 0).toLocaleString()}
                </td>
                <td>
                  <div className="um-actions">
                    {user.status === "DELETED" ? (
                      <button
                        className="um-btn-edit"
                        title="Khôi phục"
                        onClick={() => handleRestore(user)}
                      >
                        ↺
                      </button>
                    ) : (
                      <>
                        <button
                          className="um-btn-ban"
                          title={
                            user.isActive
                              ? "Khóa tài khoản"
                              : "Mở khóa tài khoản"
                          }
                          onClick={() => handleToggleActive(user)}
                          disabled={user.role === "ADMIN"}
                        >
                          {user.isActive ? "!" : "✓"}
                        </button>
                        <button
                          className="um-btn-delete"
                          title="Xóa mềm tài khoản"
                          onClick={() => handleDelete(user)}
                          disabled={user.role === "ADMIN"}
                        >
                          ×
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: "#9ca3af",
                  }}
                >
                  Không tìm thấy tài khoản nào
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: "#6b7280",
                  }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 18px",
            borderTop: "2px solid var(--black)",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700 }}>
            Tổng {totalElements.toLocaleString()} tài khoản
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="um-view-all-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Trước
            </button>
            <span style={{ fontSize: 12, fontWeight: 800 }}>
              {totalPages === 0 ? 0 : page + 1}/{totalPages}
            </span>
            <button
              className="um-view-all-btn"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
